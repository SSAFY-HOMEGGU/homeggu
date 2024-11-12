from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import pickle

router = APIRouter()

# 모델 로드
with open("app/models/trained_model.pkl", "rb") as f:
    recommender = pickle.load(f)

# 요청 데이터 스키마 정의
class Preferences(BaseModel):
    category_preferences: Dict[str, float]
    mood_preferences: Dict[str, float]
    top_n: int = 10  # 기본값 10개 추천

@router.post("/recommend")
def recommend_items(preferences: Preferences):
    """
    FastAPI 엔드포인트: 추천 리스트 반환
    """
    try:
        # 추천 수행
        recommendations = recommender.recommend(
            category_preferences=preferences.category_preferences,
            mood_preferences=preferences.mood_preferences,
            top_n=preferences.top_n
        )
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")
