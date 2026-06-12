"""Run the backend app with `uvicorn app.main:app` from the repo root."""

from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from backend.app.main import app  # noqa: E402
