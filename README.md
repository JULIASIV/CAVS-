# CAVS-
central attendance variance  system  /
├── README.md
├── LICENSE
├── .gitignore
├── docs/
│ ├── architecture.md
│ ├── api.md
│ ├── deployment.md
│ └── privacy_policy.md
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── api/
│ │ ├── models/
│ │ ├── services/
│ │ ├── db/
│ │ └── tests/
│ ├── Dockerfile
│ └── requirements.txt
├── inference/
│ ├── models/
│ ├── embedder.py
│ └── tests/
├── frontend/
│ ├── public/
│ ├── src/
│ └── package.json
├── devices/
│ ├── pi/
│ │ └── capture_script.py
│ └── esp32/
│ └── README.md
├── infra/
│ ├── docker-compose.yml
│ └── k8s/ (optional)
├── docs/ (user guides, consent forms)
└── .github/
├── ISSUE_TEMPLATE/
├── workflows/
│ └── ci.yml
└── PULL_REQUEST_TEMPLATE.md
