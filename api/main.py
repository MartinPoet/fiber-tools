# api/main.py
from fastapi import FastAPI

app = FastAPI(
    title="FTTH Tools API",
    description="API Skeleton für Dashboard, CAPEX, Restoration, …",
    version="0.1.0"
)

@app.get("/health", tags=["Monitoring"])
async def health():
    """
    Health‑Check‑Endpoint, liefert {"status":"ok"}.
    """
    return {"status": "ok"}
