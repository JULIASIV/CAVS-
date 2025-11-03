# 📸 Multi-Face Detection System
## Classroom Group Attendance Capture (Up to 50 Students)

---

## Overview

The CAVS system supports **group attendance capture**, allowing teachers to photograph an entire classroom and automatically detect and identify up to **50 students** in a single image.

### Key Features

- ✅ **Group Capture**: Capture entire classroom in one photo
- ✅ **Multi-Face Detection**: Detect up to 50 faces simultaneously
- ✅ **Batch Processing**: Process all students in one operation
- ✅ **High Resolution**: 1920x1080 camera resolution for clarity
- ✅ **Smart Recognition**: Match each detected face against student database
- ✅ **Confidence Scoring**: Each match includes confidence percentage
- ✅ **Error Handling**: Handles occlusions, angles, and lighting variations

---

## How It Works

### 1. Camera Capture (Frontend)

```javascript
// Frontend sends group photo to backend
const formData = new FormData();
formData.append('image', photoBlob, 'classroom.jpg');
formData.append('max_faces', 50);  // Maximum faces to detect
formData.append('capture_type', 'group');
formData.append('course_id', courseId);
```

**Camera Settings:**
- Resolution: 1920x1080 (Full HD)
- Format: JPEG, 95% quality
- Facing: Rear camera (environment mode)
- Field of View: Wide-angle recommended

### 2. Face Detection (Backend)

The backend processes the image through multiple stages:

#### Stage 1: Face Detection
```python
# Using MTCNN or RetinaFace for multi-face detection
detector = MTCNN(min_face_size=20, thresholds=[0.6, 0.7, 0.7])
faces = detector.detect_faces(image)

# Filter faces by size (minimum 40x40 pixels)
valid_faces = [f for f in faces if f['box'][2] > 40 and f['box'][3] > 40]

# Limit to maximum 50 faces
faces_to_process = valid_faces[:50]
```

**Detection Parameters:**
- Minimum face size: 40x40 pixels
- Detection confidence threshold: 70%
- Maximum faces per image: 50
- Face angle tolerance: ±45 degrees

#### Stage 2: Face Extraction & Alignment
```python
for face in faces_to_process:
    # Extract face region
    x, y, w, h = face['box']
    face_img = image[y:y+h, x:x+w]
    
    # Align face using facial landmarks
    aligned_face = align_face(face_img, face['keypoints'])
    
    # Resize to standard 160x160 for embedding
    face_resized = cv2.resize(aligned_face, (160, 160))
```

#### Stage 3: Embedding Generation
```python
# Generate 512-dimensional embeddings using FaceNet/InsightFace
embeddings = model.predict(face_batch)

# Each face gets a unique embedding vector
face_embeddings = embeddings  # Shape: (num_faces, 512)
```

#### Stage 4: Face Matching
```python
# Load all enrolled student embeddings from database
student_embeddings = load_student_embeddings()

# For each detected face, find closest match
for face_embedding in face_embeddings:
    # Calculate cosine similarity
    similarities = cosine_similarity([face_embedding], student_embeddings)[0]
    
    # Find best match
    best_match_idx = np.argmax(similarities)
    confidence = similarities[best_match_idx]
    
    if confidence > CONFIDENCE_THRESHOLD:  # 0.75 default
        student = students[best_match_idx]
        matches.append({
            'student_id': student.id,
            'name': student.name,
            'confidence': confidence,
            'face_coordinates': face['box']
        })
```

#### Stage 5: Record Creation
```python
# Create attendance records for all matched students
for match in matches:
    AttendanceRecord.objects.create(
        student_id=match['student_id'],
        course_id=course_id,
        timestamp=timezone.now(),
        confidence=match['confidence'],
        status='pending',  # Requires teacher verification
        capture_type='group',
        face_coordinates=match['face_coordinates']
    )
```

### 3. Response to Frontend

```json
{
  "success": true,
  "total_faces_detected": 45,
  "students_identified": 42,
  "unidentified_faces": 3,
  "matches": [
    {
      "student_id": "STU001",
      "name": "Melkamu Wako",
      "confidence": 0.95,
      "face_box": [120, 80, 150, 200]
    },
    {
      "student_id": "STU002",
      "name": "Tigist Alemayehu",
      "confidence": 0.89,
      "face_box": [450, 90, 140, 190]
    }
    // ... up to 50 students
  ],
  "processing_time": "2.3s"
}
```

---

## Classroom Setup Guidelines

### Optimal Positioning

```
                    [Whiteboard/Front of Class]
                    
    Student   Student   Student   Student   Student
    Student   Student   Student   Student   Student
    Student   Student   Student   Student   Student
    Student   Student   Student   Student   Student
    Student   Student   Student   Student   Student
    
                    [Teacher + Camera]
                         3-5m
```

### Camera Position
- **Distance**: 3-5 meters from front row
- **Height**: 1.5-1.8 meters (eye level)
- **Angle**: Slightly elevated (10-15° above horizontal)
- **Orientation**: Landscape (horizontal)

### Lighting Requirements
- **Brightness**: 300-500 lux (normal classroom lighting)
- **Direction**: Front lighting (avoid backlighting)
- **Uniformity**: Even lighting across all students
- **Shadows**: Minimize facial shadows

### Student Positioning
- ✅ Face camera directly
- ✅ Remove hats, sunglasses, masks
- ✅ Clear view of entire face
- ✅ Maintain 50cm minimum spacing
- ❌ Avoid overlapping faces
- ❌ No extreme head angles

---

## Frontend Implementation

### Camera Capture Component

```jsx
// src/components/CameraCapture.js

const CameraCapture = ({ onCapture, courseId }) => {
  const MAX_FACES = 50;
  
  // High-resolution camera settings for group photos
  const constraints = {
    video: {
      facingMode: 'environment',  // Rear camera
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    }
  };
  
  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append('image', capturedImage.blob);
    formData.append('max_faces', MAX_FACES);
    formData.append('capture_type', 'group');
    formData.append('course_id', courseId);
    
    // Send to backend
    const response = await api.post('/api/capture', formData);
    
    // Display results
    showResults(response.data);
  };
  
  return (
    <div className="camera-modal">
      {/* Group capture mode UI */}
      <div className="instructions">
        📸 Group Capture Mode
        Position camera to include all students (max 50 faces)
      </div>
      
      {/* Live video preview */}
      <video ref={videoRef} autoPlay />
      
      {/* Detection indicator */}
      {isDetecting && (
        <div className="detection-badge">
          Detecting Faces...
        </div>
      )}
      
      <button onClick={capturePhoto}>Capture Class</button>
    </div>
  );
};
```

### Results Display

```jsx
// Show detection results after processing
const ResultsModal = ({ results }) => {
  return (
    <div className="results-modal">
      <h2>Attendance Captured</h2>
      
      <div className="stats">
        <div>Total Faces: {results.total_faces_detected}</div>
        <div>Identified: {results.students_identified}</div>
        <div>Unknown: {results.unidentified_faces}</div>
      </div>
      
      <div className="student-list">
        {results.matches.map(match => (
          <div key={match.student_id} className="student-item">
            <img src={match.face_crop} alt={match.name} />
            <div>
              <p>{match.name}</p>
              <p className="confidence">
                {(match.confidence * 100).toFixed(1)}% match
              </p>
            </div>
            {match.confidence < 0.85 && (
              <span className="warning">⚠️ Low confidence - review</span>
            )}
          </div>
        ))}
      </div>
      
      <button onClick={confirmAttendance}>Confirm All</button>
    </div>
  );
};
```

---

## Backend API Endpoint

### POST `/api/capture`

**Request:**
```
Content-Type: multipart/form-data

image: [binary image file]
max_faces: 50
capture_type: "group"
course_id: "CSE301"
timestamp: "2025-01-15T09:30:00Z"
```

**Response (Success):**
```json
{
  "success": true,
  "total_faces_detected": 45,
  "students_identified": 42,
  "unidentified_faces": 3,
  "matches": [
    {
      "student_id": "STU001",
      "name": "Melkamu Wako",
      "confidence": 0.95,
      "face_box": [120, 80, 150, 200],
      "status": "pending"
    }
  ],
  "processing_time": "2.3s",
  "image_url": "/media/captures/2025-01-15/classroom_001.jpg"
}
```

**Response (Partial Success):**
```json
{
  "success": true,
  "warning": "Some faces could not be identified",
  "total_faces_detected": 50,
  "students_identified": 45,
  "unidentified_faces": 5,
  "matches": [...],
  "unidentified_coordinates": [
    [800, 120, 100, 130],
    [950, 140, 95, 125]
  ]
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "No faces detected in image",
  "suggestions": [
    "Ensure students are visible in frame",
    "Check lighting conditions",
    "Verify camera angle"
  ]
}
```

---

## Performance Optimization

### Image Processing
- **Resize large images**: Max 1920x1080 before processing
- **Parallel processing**: Use batch embedding generation
- **GPU acceleration**: Utilize CUDA/TensorRT for inference
- **Caching**: Cache student embeddings in Redis

### Database Optimization
- **Indexing**: Index student_id, course_id, timestamp
- **Batch inserts**: Use bulk_create() for attendance records
- **Async tasks**: Use Celery for background processing

### Expected Performance
| Students | Processing Time | Hardware |
|----------|----------------|----------|
| 10-20    | 0.5-1.0s       | CPU (4 cores) |
| 20-30    | 1.0-1.5s       | CPU (4 cores) |
| 30-40    | 1.5-2.0s       | CPU (8 cores) |
| 40-50    | 2.0-3.0s       | CPU (8 cores) |
| 40-50    | 0.5-1.0s       | GPU (NVIDIA) |

---

## Error Handling

### Common Issues

#### 1. Too Many Faces (>50)
```python
if len(detected_faces) > MAX_FACES:
    # Take the 50 largest faces
    faces_sorted = sorted(detected_faces, 
                         key=lambda f: f['box'][2] * f['box'][3], 
                         reverse=True)
    faces_to_process = faces_sorted[:MAX_FACES]
    
    return {
        'warning': f'{len(detected_faces)} faces detected, processing largest 50'
    }
```

#### 2. No Faces Detected
```python
if len(detected_faces) == 0:
    return {
        'success': False,
        'error': 'No faces detected',
        'suggestions': [
            'Ensure students are in frame',
            'Check camera focus',
            'Improve lighting'
        ]
    }
```

#### 3. Poor Image Quality
```python
def check_image_quality(image):
    # Check brightness
    avg_brightness = np.mean(image)
    if avg_brightness < 50:
        return {'quality': 'too_dark'}
    if avg_brightness > 200:
        return {'quality': 'too_bright'}
    
    # Check blur (Laplacian variance)
    laplacian_var = cv2.Laplacian(image, cv2.CV_64F).var()
    if laplacian_var < 100:
        return {'quality': 'blurry'}
    
    return {'quality': 'good'}
```

#### 4. Low Confidence Matches
```python
# Flag low confidence for manual review
if confidence < 0.85:
    record.status = 'review_required'
    record.notes = f'Low confidence match: {confidence:.2f}'
```

---

## Testing

### Unit Tests
```python
def test_multi_face_detection():
    # Load test image with 30 students
    image = load_test_image('classroom_30_students.jpg')
    
    # Process image
    result = detect_and_match_faces(image, max_faces=50)
    
    # Assertions
    assert len(result['matches']) == 30
    assert all(m['confidence'] > 0.7 for m in result['matches'])
    assert result['processing_time'] < 5.0  # seconds
```

### Integration Tests
```python
def test_group_capture_endpoint():
    with open('test_classroom.jpg', 'rb') as f:
        response = client.post('/api/capture', {
            'image': f,
            'max_faces': 50,
            'capture_type': 'group',
            'course_id': 'TEST101'
        })
    
    assert response.status_code == 200
    assert response.json()['success'] == True
    assert len(response.json()['matches']) > 0
```

---

## Best Practices

### For Teachers

1. **Prepare Classroom**
   - Turn on all lights
   - Close blinds if bright sun causes glare
   - Arrange students in visible rows

2. **Camera Setup**
   - Use tripod for stability
   - Position 3-5 meters from front row
   - Frame to include all students
   - Test focus before capture

3. **Capture Timing**
   - Wait for students to settle
   - Ensure all faces visible
   - Take 2-3 photos for backup

4. **Post-Capture Review**
   - Review all detected students
   - Manually add any missed students
   - Confirm attendance before submitting

### For Administrators

1. **Student Enrollment**
   - Require multiple photos per student (5-10)
   - Capture various angles and expressions
   - Update photos each semester

2. **System Monitoring**
   - Track average detection rates
   - Monitor processing times
   - Review low-confidence matches

3. **Data Management**
   - Store original classroom photos (90 days)
   - Backup attendance records daily
   - Archive old data annually

---

## Future Enhancements

- [ ] Real-time face detection during live preview
- [ ] Automatic classroom seating chart generation
- [ ] Attendance pattern analysis
- [ ] Missing student alerts
- [ ] Integration with student ID cards
- [ ] Support for masked/partially occluded faces
- [ ] Age verification (prevent photo spoofing)
- [ ] Multi-classroom simultaneous processing

---

## Technical Requirements

### Frontend
- Modern browser with WebRTC support
- Camera resolution: 1920x1080 minimum
- JavaScript ES6+
- React 18.2+

### Backend
- Python 3.9+
- TensorFlow 2.x or PyTorch 1.x
- OpenCV 4.8+
- MTCNN or RetinaFace
- FaceNet or InsightFace model
- 8GB RAM minimum (16GB recommended)
- GPU recommended for >30 students

### Network
- Upload bandwidth: 5 Mbps minimum
- Latency: <200ms to backend
- Image size: 2-5 MB per capture

---

## FAQ

**Q: Can the system handle more than 50 students?**  
A: The system is optimized for up to 50 faces. For larger classes, split into multiple groups or use multiple cameras.

**Q: What happens if a student is not detected?**  
A: Teachers can manually mark attendance or retake the photo. The system highlights unidentified faces.

**Q: How accurate is the multi-face detection?**  
A: With proper lighting and positioning, accuracy is 95%+ for groups of 30-40 students.

**Q: Can students wear glasses or hats?**  
A: Clear glasses are fine. Hats and sunglasses should be removed for best results.

**Q: How long does processing take?**  
A: Typically 1-3 seconds for 40 students on a modern CPU, under 1 second with GPU.

**Q: Is the system GDPR compliant?**  
A: Yes, with proper consent and data retention policies. Consult your institution's privacy officer.

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Author**: CAVS Development Team

