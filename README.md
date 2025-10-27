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