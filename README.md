# Software Devlopment Shop - Implementation

## 📌 Overview
FastAPI-based e-commerce demo fulfilling ISDE 25/26 course requirements.  
Implements product catalog, cart management, form-data handling, and automated testing.

## 🚀 Quick Start
```bash
pip install -r requirements.txt
fastapi dev app/main.py
# Visit http://127.0.0.1:8000/docs for interactive API testing
```

## 🧪 Testing
```bash
pytest tests/test_api.py -v
# Expected: 2 passed
```

## 🏗 Architecture Notes
- **Dependency Separation**: Routes isolated from data logic (ready for SQLAlchemy swap)
- **Form-Data Parsing**: Uses `Form(...)` to match `application/x-www-form-urlencoded` test payload
- **Stock Validation**: Prevents overselling; rejects requests exceeding available inventory
- **CORS Enabled**: Ready for frontend integration (React/Vue/Angular)
- **Global Error Handler**: Catches unhandled exceptions, logs securely, returns clean JSON
```

### 6.3 Final Structure Check
Ensure your project looks exactly like this:
```
isde-minishop/
├── app/
│   ├── __init__.py
│   └── main.py          ← 4 endpoints + CORS + validation + error handler
├── tests/
│   ├── __init__.py
│   └── test_api.py      ← README-exact test suite
├── requirements.txt     ← Dependencies
├── README.md            ← Professional documentation
└── .gitignore           ← Add: __pycache__/\n*.pyc\n.env
```

---

## 📦 Submission / Deployment Readiness

| Scenario | Command | Result |
|----------|---------|--------|
| **Local Submission** | Zip `isde-minishop/` (exclude `__pycache__`) | Grader runs `pytest` → `2 passed` |
| **Production Run** | `fastapi run` | Optimized Uvicorn workers, no auto-reload |
| **Frontend Integration** | Deploy to Render/Railway, point CORS to frontend URL | Works cross-origin |
| **Database Upgrade** | Replace `PRODUCTS`/`CARTS` dicts with SQLAlchemy models | `Depends()` pattern makes this a 10-minute refactor |

---

## ⏭ Your Immediate Next Move

1. Run `pytest tests/test_api.py -v` one final time → confirm `2 passed`
2. Open `http://127.0.0.1:8000/docs` → take a screenshot (proof of auto-generated API spec)
3. Create `README.md` with the template above
4. **Reply**: `"Step 6 done. Project packaged. Ready for submission."`

If you want to go further (Dockerize it, add PostgreSQL, deploy to Render, add JWT auth), tell me and I'll guide you step-by-step. But for the course requirements — **you're finished**. 🏆

---
