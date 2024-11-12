import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class ContentBasedRecommender:
    def __init__(self, items_db):
        self.items_db = items_db
        # 원-핫 인코딩
        self.category_one_hot = pd.get_dummies(self.items_db["category"])
        self.mood_one_hot = pd.get_dummies(self.items_db["mood"])

    def recommend(self, category_preferences: dict, mood_preferences: dict, top_n: int = 10):
        # 사용자 선호도 벡터 만들기
        user_cat_vec = np.array([
            category_preferences.get(col, 0) for col in self.category_one_hot.columns
        ]) 
        user_mood_vec = np.array([
            mood_preferences.get(col, 0) for col in self.mood_one_hot.columns
        ])

        # 아이템 벡터 만들기
        item_cat_vec = self.category_one_hot.values
        item_mood_vec = self.mood_one_hot.values

        # 유사도 계산하기
        category_similarity = cosine_similarity([user_cat_vec], item_cat_vec).flatten()
        mood_similarity = cosine_similarity([user_mood_vec], item_mood_vec).flatten()

        # 점수 합산하기
        total_similarity = (0.7 * category_similarity) + (0.3 * mood_similarity)
        self.items_db["total_score"] = total_similarity

        # 결과 반환
        top_recommendations = self.items_db.sort_values(by="total_score", ascending=False).head(top_n)
        return top_recommendations[["item_id", "category", "mood", "total_score"]].to_dict(orient="records")