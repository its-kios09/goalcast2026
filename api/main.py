from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import predict, simulate, africa, market, upsets

app = FastAPI(
    title="GoalCast 2026",
    description="AI-powered World Cup 2026 prediction engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api/predict", tags=["predict"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["simulate"])
app.include_router(africa.router, prefix="/api/africa", tags=["africa"])
app.include_router(market.router, prefix="/api/market", tags=["market"])
app.include_router(upsets.router, prefix="/api/upsets", tags=["upsets"])

@app.get("/")
def root():
    return {"status": "ok", "project": "GoalCast 2026"}
