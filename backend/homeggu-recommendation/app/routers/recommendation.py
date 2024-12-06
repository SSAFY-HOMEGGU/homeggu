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
    """
    Goods 서버에서 데이터를 가져와 isSell이 'AVAILABLE'인 항목만 반환.
    """
    try:
        response = requests.get(GOODS_SERVER_URL)
        response.raise_for_status()
        goods_data = response.json()

        # DataFrame 생성
        items_db = pd.DataFrame(goods_data.get("content", []))

        # 'sales_board_id' 열 생성 (필요 시)
        if "sales_board_id" not in items_db.columns:
            items_db["sales_board_id"] = range(1, len(items_db) + 1)

        # isSell이 'AVAILABLE'인 제품만 필터링
        available_items = items_db[items_db["isSell"].str.strip().str.upper() == "AVAILABLE"]

        # 비어있는 경우 예외 처리
        if available_items.empty:
            raise ValueError("No AVAILABLE products found.")

        print(available_items.head())  # 필터링된 데이터 확인
        return available_items

    except ValueError as ve:
        print(f"Error: {ve}")
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        print(f"Error fetching goods data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch goods data.")

@router.post("/recommend")
def recommend_items(preferences: Preferences):
    """
    FastAPI 엔드포인트: isSell이 'AVAILABLE'인 제품 기반 추천 리스트 반환
    """
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
