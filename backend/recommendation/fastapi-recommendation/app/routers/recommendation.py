from fastapi import APIRouter, HTTPException
import pickle
from app.models.recommender import ContentBasedRecommender

router = APIRouter()

# 모델 로드
with open("app/models/trained_model.pkl", "rb") as f:
    recommender = pickle.load(f)

@router.post("/recommend")
def recommend_items(category_preferences: dict, mood_preferences: dict, top_n: int = 10):
    try:
        recommendations = recommender.recommend(category_preferences, mood_preferences, top_n)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
