from fastapi import FastAPI
from app.routers import recommendation

app = FastAPI()

# 추천 API 라우터 등록
app.include_router(recommendation.router, prefix="/fast-api", tags=["Recommendation"])