CAVS/
├── 📁 backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── api/               # API routes and endpoints
│   │   ├── models/            # Data models and schemas
│   │   ├── services/          # Business logic and services
│   │   ├── db/                # Database configuration and migrations
│   │   └── tests/             # Backend test suite
│   ├── Dockerfile
│   └── requirements.txt
│
├── 📁 inference/              # Machine learning inference engine
│   ├── models/               # Pre-trained ML models
│   ├── embedder.py           # Facial embedding generation
│   └── tests/                # Model inference tests
│
├── 📁 frontend/              # React frontend application
│   ├── public/               # Static assets
│   ├── src/                  # React components and logic
│   └── package.json
│
├── 📁 devices/               # Hardware device implementations
│   ├── pi/                   # Raspberry Pi capture scripts
│   │   └── capture_script.py
│   └── esp32/                # ESP32 microcontroller code
│       └── README.md
│
├── 📁 infra/                 # Infrastructure configurations
│   ├── docker-compose.yml    # Local development setup
│   └── k8s/                  # Kubernetes deployment (optional)
│
├── 📁 docs/                  # Documentation
│   ├── architecture.md       # System architecture
│   ├── api.md               # API documentation
│   ├── deployment.md        # Deployment guide
│   └── privacy_policy.md    # Privacy policy
│
├── 📁 .github/              # GitHub configurations
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   │   └── ci.yml          # Continuous integration
│   └── PULL_REQUEST_TEMPLATE.md
│
├── README.md
├── LICENSE
└── .gitignore



✨ Features

    🤖 Facial Recognition: Real-time face detection and identification using advanced ML models

    📱 Multi-device Support: Raspberry Pi and ESP32 integration for flexible deployment

    🌐 Web Dashboard: Modern React-based administration interface

    🔗 RESTful API: FastAPI backend with comprehensive endpoints

    🐳 Containerized: Docker support for easy deployment and scaling

    🔒 Privacy-focused: Clear privacy policy and data protection measures

    📊 Real-time Monitoring: Live attendance tracking and variance detection

    🔔 Notifications: Automated alerts for attendance anomalies

🛠️ Prerequisites

Before you begin, ensure you have the following installed:

    Python 3.9+

    Node.js 16+

    Docker and Docker Compose (optional)

    Raspberry Pi with camera module (for device deployment)

    ESP32 microcontroller (optional)
