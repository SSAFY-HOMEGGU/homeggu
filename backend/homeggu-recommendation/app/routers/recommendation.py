from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
import pandas as pd
import requests
from app.models.recommender import ContentBasedRecommender

router = APIRouter()

# Goods 서버 API URL
GOODS_SERVER_URL = "http://localhost:8082/api/goods/board"

class Preferences(BaseModel):
    category_preferences: Dict[str, float]
    mood_preferences: Dict[str, float]
    top_n: int = 10

def fetch_goods_from_server():
    try:
        response = requests.get(GOODS_SERVER_URL)
        response.raise_for_status()
        goods_data = response.json()

        # DataFrame 생성
        items_db = pd.DataFrame(goods_data.get("content", []))

        # 'sales_board_id' 열 생성
        if "sales_board_id" not in items_db.columns:
            items_db["sales_board_id"] = range(1, len(items_db) + 1)

        print(items_db.head())  # 데이터 확인
        return items_db
    except Exception as e:
        print(f"Error fetching goods data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch goods data.")

@router.post("/recommend")
def recommend_items(preferences: Preferences):
    try:
        items_db = fetch_goods_from_server()
        recommender = ContentBasedRecommender(items_db)
        recommendations = recommender.recommend(
            category_preferences=preferences.category_preferences,
            mood_preferences=preferences.mood_preferences,
            top_n=preferences.top_n
        )
        return {"recommendations": recommendations}
    except Exception as e:
        print(f"Error in FastAPI endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")


