# Smart Attendance System (CAVS) - Technical Documentation

## System Architecture Deep Dive

### 1. Core System Components

#### 1.1 Backend Architecture (Django)

**Project Structure:**
```
backend/
├── app/
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── api/
│   │   ├── v1/
│   │   │   ├── urls.py
│   │   │   ├── views/
│   │   │   │   ├── attendance.py
│   │   │   │   ├── students.py
│   │   │   │   ├── devices.py
│   │   │   │   └── auth.py
│   │   │   └── serializers/
│   │   └── routers.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── core.py
│   │   ├── attendance.py
│   │   ├── students.py
│   │   └── devices.py
│   ├── services/
│   │   ├── face_recognition.py
│   │   ├── image_processing.py
│   │   └── device_manager.py
│   ├── management/
│   │   └── commands/
│   │       ├── enroll_students.py
│   │       └── sync_attendance.py
│   ├── utils/
│   │   ├── validators.py
│   │   └── helpers.py
│   └── middleware/
│       ├── auth.py
│       └── logging.py
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
└── tests/
    ├── test_models.py
    ├── test_views.py
    └── test_services.py
```

#### 1.2 Database Schema

**Core Tables:**

```sql
-- Students table
CREATE TABLE students_student (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(254) UNIQUE,
    department VARCHAR(100),
    class_section VARCHAR(50),
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student embeddings table (separated for security)
CREATE TABLE students_faceembedding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students_student(id) ON DELETE CASCADE,
    embedding_vector BYTEA NOT NULL, -- Encrypted face embeddings
    embedding_version INTEGER DEFAULT 1,
    image_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, embedding_version)
);

-- Devices table
CREATE TABLE devices_device (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) UNIQUE NOT NULL,
    device_type VARCHAR(20) CHECK (device_type IN ('raspberry_pi', 'esp32_cam')),
    classroom_id VARCHAR(50) NOT NULL,
    location_description TEXT,
    ip_address INET,
    mac_address MACADDR,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    last_seen TIMESTAMP WITH TIME ZONE,
    configuration JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records table
CREATE TABLE attendance_attendancerecord (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES devices_device(id),
    classroom_id VARCHAR(50) NOT NULL,
    captured_image_path VARCHAR(500),
    processed_image_path VARCHAR(500),
    predicted_student_id UUID REFERENCES students_student(id),
    predicted_confidence DECIMAL(4,3) CHECK (predicted_confidence >= 0 AND predicted_confidence <= 1),
    actual_student_id UUID REFERENCES students_student(id),
    review_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (review_status IN ('pending', 'approved', 'rejected', 'flagged')),
    reviewer_id UUID REFERENCES auth_user(id),
    review_timestamp TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    capture_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_timestamp TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_attendance_review_status ON attendance_attendancerecord(review_status);
CREATE INDEX idx_attendance_timestamp ON attendance_attendancerecord(capture_timestamp);
CREATE INDEX idx_attendance_device_classroom ON attendance_attendancerecord(device_id, classroom_id);
CREATE INDEX idx_attendance_predicted_student ON attendance_attendancerecord(predicted_student_id);
CREATE INDEX idx_devices_status ON devices_device(status);
CREATE INDEX idx_students_active ON students_student(is_active);
```

#### 1.3 Face Recognition Pipeline

**Technical Implementation:**

```python
# inference/detector.py
import cv2
import numpy as np
from typing import List, Tuple, Optional
import insightface
from insightface.app import FaceAnalysis

class FaceDetector:
    def __init__(self, model_path: str = 'buffalo_l', providers: List = None):
        self.app = FaceAnalysis(
            name=model_path,
            providers=providers or ['CPUExecutionProvider']
        )
        self.app.prepare(ctx_id=0, det_size=(640, 640))
    
    def detect_faces(self, image: np.ndarray) -> List[dict]:
        """
        Detect faces in image and return face objects with embeddings
        """
        try:
            faces = self.app.get(image)
            results = []
            
            for face in faces:
                face_data = {
                    'bbox': face.bbox.astype(int).tolist(),  # [x1, y1, x2, y2]
                    'landmarks': face.kps.astype(int).tolist(),  # 5 key points
                    'embedding': face.embedding,  # 512-dim embedding
                    'confidence': face.det_score,
                    'face_area': self._calculate_face_area(face.bbox)
                }
                results.append(face_data)
            
            return results
        except Exception as e:
            logger.error(f"Face detection error: {str(e)}")
            return []
    
    def _calculate_face_area(self, bbox: np.ndarray) -> float:
        x1, y1, x2, y2 = bbox
        return (x2 - x1) * (y2 - y1)

# inference/matcher.py
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple, Dict
import heapq

class FaceMatcher:
    def __init__(self, similarity_threshold: float = 0.6):
        self.similarity_threshold = similarity_threshold
        self.student_embeddings = {}  # student_id -> embedding vector
        self.student_metadata = {}    # student_id -> metadata
    
    def add_student_embedding(self, student_id: str, embedding: np.ndarray, metadata: dict = None):
        """Add student embedding to database"""
        self.student_embeddings[student_id] = embedding
        self.student_metadata[student_id] = metadata or {}
    
    def find_best_match(self, query_embedding: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        """
        Find top_k matches for query embedding
        Returns list of (student_id, similarity_score)
        """
        if not self.student_embeddings:
            return []
        
        similarities = []
        query_embedding = query_embedding.reshape(1, -1)
        
        for student_id, embedding in self.student_embeddings.items():
            embedding = embedding.reshape(1, -1)
            similarity = cosine_similarity(query_embedding, embedding)[0][0]
            
            if similarity >= self.similarity_threshold:
                similarities.append((student_id, similarity))
        
        # Return top_k matches
        return heapq.nlargest(top_k, similarities, key=lambda x: x[1])
    
    def batch_match(self, query_embeddings: List[np.ndarray]) -> List[List[Tuple[str, float]]]:
        """Match multiple embeddings efficiently"""
        return [self.find_best_match(embedding) for embedding in query_embeddings]
```

### 2. API Specification

#### 2.1 Core Endpoints

**Authentication:**
```python
# api/v1/views/auth.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token obtain view with additional user data
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            user = User.objects.get(username=request.data['username'])
            response.data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.profile.role if hasattr(user, 'profile') else 'user'
            }
        
        return response

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """
    Logout endpoint - adds token to blacklist
    """
    try:
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

**Attendance Capture:**
```python
# api/v1/views/attendance.py
import base64
import io
from PIL import Image
import numpy as np
from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

class AttendanceViewSet(GenericViewSet):
    """
    Attendance capture and management API
    """
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def capture(self, request):
        """
        Capture attendance from IoT device
        ---
        parameters:
          - name: device_id
            type: string
            required: true
          - name: classroom_id
            type: string
            required: true
          - name: image
            type: file
            required: true
          - name: timestamp
            type: string
            format: date-time
        """
        try:
            # Validate device
            device = self._validate_device(request.data.get('device_id'))
            if not device:
                return Response(
                    {"error": "Invalid or unauthorized device"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Process image
            image_file = request.FILES.get('image')
            if not image_file:
                return Response(
                    {"error": "No image provided"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save original image
            image_path = self._save_captured_image(image_file, device.device_id)
            
            # Process face recognition
            recognition_results = self._process_face_recognition(image_path)
            
            # Create attendance record
            attendance_record = self._create_attendance_record(
                device=device,
                classroom_id=request.data.get('classroom_id'),
                image_path=image_path,
                recognition_results=recognition_results
            )
            
            return Response({
                "record_id": str(attendance_record.id),
                "predicted_student": recognition_results.get('best_match'),
                "confidence": recognition_results.get('confidence'),
                "status": "processed",
                "faces_detected": recognition_results.get('faces_detected', 0)
            })
            
        except Exception as e:
            logger.error(f"Capture error: {str(e)}")
            return Response(
                {"error": "Internal server error"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _process_face_recognition(self, image_path: str) -> dict:
        """Process image through face recognition pipeline"""
        from ..services.face_recognition import FaceRecognitionService
        
        service = FaceRecognitionService()
        results = service.process_image(image_path)
        
        return {
            'best_match': results.get('best_match_id'),
            'confidence': results.get('best_match_confidence'),
            'faces_detected': results.get('faces_detected'),
            'all_matches': results.get('all_matches', [])
        }
```

#### 2.2 API Response Formats

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "record_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "predicted_student": "STU-2024-001",
    "confidence": 0.87,
    "faces_detected": 1,
    "timestamp": "2024-03-20T10:30:00Z"
  },
  "metadata": {
    "version": "1.0",
    "processing_time": 1.23
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid device ID",
    "details": {
      "device_id": ["This field is required."]
    }
  },
  "metadata": {
    "version": "1.0",
    "timestamp": "2024-03-20T10:30:00Z"
  }
}
```

### 3. Frontend Architecture

#### 3.1 React Component Structure

```typescript
// src/types/api.ts
export interface AttendanceRecord {
  id: string;
  device_id: string;
  classroom_id: string;
  captured_image_path: string;
  predicted_student_id?: string;
  predicted_name?: string;
  confidence: number;
  timestamp: string;
  review_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reviewer_id?: string;
  review_timestamp?: string;
}

export interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  department: string;
  class_section: string;
  is_active: boolean;
  enrollment_date: string;
}

export interface Device {
  id: string;
  device_id: string;
  device_type: 'raspberry_pi' | 'esp32_cam';
  classroom_id: string;
  location_description: string;
  status: 'active' | 'inactive' | 'maintenance';
  last_seen: string;
  configuration: Record<string, any>;
}

// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      dispatch({ type: 'SET_TOKEN', payload: token });
      // Verify token and get user data
      verifyToken(token);
    }
  }, []);
  
  const login = async (username: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authAPI.login(username, password);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token: access } 
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 3.2 Dashboard Components

```typescript
// src/components/Dashboard/StatisticsCards.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { attendanceAPI } from '../../services/api';

const StatisticsCards: React.FC = () => {
  const { data: stats, isLoading } = useQuery(
    'dashboard-stats',
    () => attendanceAPI.getStatistics(),
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );
  
  if (isLoading) return <div>Loading statistics...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Pending Reviews"
        value={stats?.pending_reviews || 0}
        icon="⏳"
        color="yellow"
      />
      <StatCard
        title="Today's Attendance"
        value={stats?.today_attendance || 0}
        icon="✅"
        color="green"
      />
      <StatCard
        title="Active Devices"
        value={stats?.active_devices || 0}
        icon="📱"
        color="blue"
      />
      <StatCard
        title="Recognition Accuracy"
        value={`${stats?.accuracy || 0}%`}
        icon="🎯"
        color="purple"
      />
    </div>
  );
};

// src/components/Attendance/ReviewQueue.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { attendanceAPI } from '../../services/api';

const ReviewQueue: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  
  const { data: queue, isLoading } = useQuery(
    ['attendance-queue', page],
    () => attendanceAPI.getPendingRecords({ page, page_size: 20 })
  );
  
  const reviewMutation = useMutation(attendanceAPI.reviewRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('attendance-queue');
      queryClient.invalidateQueries('dashboard-stats');
    }
  });
  
  const handleReview = (recordId: string, action: string, studentId?: string) => {
    reviewMutation.mutate({
      record_id: recordId,
      action,
      assigned_student_id: studentId
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Attendance Review Queue</h2>
        <p className="text-gray-600">
          {queue?.total_count || 0} records pending review
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prediction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queue?.results.map((record) => (
              <ReviewQueueItem
                key={record.id}
                record={record}
                onReview={handleReview}
                isProcessing={reviewMutation.isLoading}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 4. IoT Device Integration

#### 4.1 Raspberry Pi Capture Script

```python
# devices/pi/capture_script.py
#!/usr/bin/env python3
import time
import json
import logging
import requests
from pathlib import Path
from datetime import datetime
import cv2
from picamera2 import Picamera2

class AttendanceCapture:
    def __init__(self, config_path: str = "config.json"):
        self.config = self.load_config(config_path)
        self.setup_logging()
        self.setup_camera()
        self.session = requests.Session()
        
    def load_config(self, config_path: str) -> dict:
        """Load device configuration"""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            required_fields = ['api_url', 'device_id', 'classroom_id', 'auth_token']
            for field in required_fields:
                if field not in config:
                    raise ValueError(f"Missing required config field: {field}")
            
            return config
        except Exception as e:
            print(f"Error loading config: {e}")
            raise
    
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('capture.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def setup_camera(self):
        """Initialize camera with optimal settings for face recognition"""
        try:
            self.camera = Picamera2()
            
            # Configure camera for face recognition
            config = self.camera.create_still_configuration(
                main={"size": (1640, 1232), "format": "RGB888"},
                controls={
                    "AwbMode": 0,  # Auto white balance
                    "ExposureTime": 10000,  # 10ms exposure
                    "AnalogueGain": 1.0,
                    "FrameRate": 30.0
                }
            )
            self.camera.configure(config)
            self.camera.start()
            
            # Allow camera to warm up
            time.sleep(2)
            self.logger.info("Camera initialized successfully")
            
        except Exception as e:
            self.logger.error(f"Camera setup failed: {e}")
            raise
    
    def capture_image(self) -> tuple[bool, bytes]:
        """Capture image from camera"""
        try:
            # Capture image
            image_array = self.camera.capture_array()
            
            # Convert to JPEG
            success, buffer = cv2.imencode('.jpg', image_array, [
                cv2.IMWRITE_JPEG_QUALITY, 85
            ])
            
            if success:
                return True, buffer.tobytes()
            else:
                return False, b""
                
        except Exception as e:
            self.logger.error(f"Image capture failed: {e}")
            return False, b""
    
    def send_to_server(self, image_data: bytes) -> bool:
        """Send captured image to backend server"""
        try:
            files = {
                'image': ('capture.jpg', image_data, 'image/jpeg')
            }
            data = {
                'device_id': self.config['device_id'],
                'classroom_id': self.config['classroom_id'],
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }
            headers = {
                'Authorization': f"Bearer {self.config['auth_token']}"
            }
            
            response = self.session.post(
                f"{self.config['api_url']}/api/capture",
                files=files,
                data=data,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                self.logger.info(
                    f"Capture successful: {result.get('predicted_student', 'Unknown')} "
                    f"(confidence: {result.get('confidence', 0):.2f})"
                )
                return True
            else:
                self.logger.error(
                    f"Server returned error: {response.status_code} - {response.text}"
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Network error: {e}")
            return False
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            return False
    
    def run(self):
        """Main capture loop"""
        self.logger.info("Starting attendance capture system")
        
        while True:
            try:
                # Capture image
                success, image_data = self.capture_image()
                
                if success and image_data:
                    # Send to server
                    self.send_to_server(image_data)
                else:
                    self.logger.warning("Image capture failed")
                
                # Wait for next capture
                time.sleep(self.config.get('capture_interval', 5))
                
            except KeyboardInterrupt:
                self.logger.info("Shutting down...")
                break
            except Exception as e:
                self.logger.error(f"Unexpected error in main loop: {e}")
                time.sleep(5)  # Wait before retrying

if __name__ == "__main__":
    capture = AttendanceCapture()
    capture.run()
```

#### 4.2 Device Configuration

```json
{
  "device_id": "pi-classroom-a-01",
  "device_type": "raspberry_pi",
  "classroom_id": "CSE-101",
  "api_url": "https://attendance.astu.edu",
  "auth_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "capture_interval": 5,
  "max_retries": 3,
  "image_quality": 85,
  "motion_detection": true,
  "motion_threshold": 0.1,
  "storage": {
    "local_backup": true,
    "max_backup_files": 100,
    "backup_retention_days": 7
  },
  "network": {
    "timeout": 30,
    "retry_delay": 5,
    "max_retry_delay": 60
  },
  "logging": {
    "level": "INFO",
    "max_file_size": "10MB",
    "backup_count": 5
  }
}
```

### 5. Deployment and Infrastructure

#### 5.1 Docker Configuration

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    python3-opencv \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements/production.txt .
RUN pip install --no-cache-dir -r production.txt

# Copy project
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120"]
```

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: attendance_db
      POSTGRES_USER: attendance_user
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://attendance_user:${DATABASE_PASSWORD}@database:5432/attendance_db
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${DJANGO_SECRET_KEY}
      - DEBUG=False
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}
    volumes:
      - media_volume:/app/media
      - static_volume:/app/static
    depends_on:
      - database
      - redis
    networks:
      - backend
    restart: unless-stopped

  celery-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A app worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://attendance_user:${DATABASE_PASSWORD}@database:5432/attendance_db
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - media_volume:/app/media
    depends_on:
      - database
      - redis
    networks:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:1.23-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
      - static_volume:/static
      - media_volume:/media
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    networks:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  media_volume:
  static_volume:

networks:
  backend:
    driver: bridge
```

#### 5.2 Nginx Configuration

```nginx
# nginx/nginx.conf
upstream backend {
    server backend:8000;
}

server {
    listen 80;
    server_name attendance.astu.edu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name attendance.astu.edu;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Static files
    location /static/ {
        alias /static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # API routes
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Admin interface
    location /admin/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (if serving from Django)
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Monitoring and Logging

#### 6.1 Performance Monitoring

```python
# backend/app/monitoring/middleware.py
import time
import logging
from django.conf import settings
from django.db import connection
from prometheus_client import Counter, Histogram, Gauge

# Prometheus metrics
REQUEST_COUNT = Counter(
    'django_requests_total',
    'Total HTTP Requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'django_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_USERS = Gauge(
    'django_active_users',
    'Number of active users'
)

class MetricsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        start_time = time.time()
        
        # Process request
        response = self.get_response(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Record metrics
        endpoint = self._get_endpoint_name(request)
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=endpoint,
            status=response.status_code
        ).inc()
        
        REQUEST_DURATION.labels(
            method=request.method,
            endpoint=endpoint
        ).observe(duration)
        
        return response
    
    def _get_endpoint_name(self, request):
        """Extract meaningful endpoint name from request"""
        if hasattr(request, 'resolver_match') and request.resolver_match:
            return request.resolver_match.route
        return request.path
```

#### 6.2 Health Checks

```python
# backend/app/api/views/health.py
from django.db import connections
from django.db.utils import OperationalError
from redis import Redis
from redis.exceptions import RedisError
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """
    Comprehensive health check endpoint
    """
    checks = {
        'database': check_database(),
        'redis': check_redis(),
        'storage': check_storage(),
        'face_model': check_face_model()
    }
    
    overall_status = 'healthy' if all(checks.values()) else 'unhealthy'
    status_code = status.HTTP_200_OK if overall_status == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
    
    return Response({
        'status': overall_status,
        'timestamp': timezone.now().isoformat(),
        'checks': checks
    }, status=status_code)

def check_database():
    """Check database connectivity"""
    try:
        connections['default'].cursor()
        return {'status': 'healthy'}
    except OperationalError as e:
        return {'status': 'unhealthy', 'error': str(e)}

def check_redis():
    """Check Redis connectivity"""
    try:
        redis = Redis.from_url(settings.REDIS_URL)
        redis.ping()
        return {'status': 'healthy'}
    except RedisError as e:
        return {'status': 'unhealthy', 'error': str(e)}
```

This comprehensive technical documentation provides deep insights into the system architecture, implementation details, and operational considerations for the Smart Attendance System.