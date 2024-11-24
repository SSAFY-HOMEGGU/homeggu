# import pandas as pd
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity

# class ContentBasedRecommender:
#     def __init__(self, items_db):
#         self.items_db = items_db
#         # 원-핫 인코딩
#         self.category_one_hot = pd.get_dummies(self.items_db["category"])
#         self.mood_one_hot = pd.get_dummies(self.items_db["mood"])

#     def recommend(self, category_preferences: dict, mood_preferences: dict, top_n: int = 10):
#         print("Category columns in one-hot encoding:", self.category_one_hot.columns)
#         print("Mood columns in one-hot encoding:", self.mood_one_hot.columns)
#         print("Category preferences keys:", category_preferences.keys())
#         print("Mood preferences keys:", mood_preferences.keys())

#         # DataFrame에 누락된 카테고리 열 추가 (0으로 초기화)
#         for category in category_preferences.keys():
#             if category not in self.category_one_hot.columns:
#                 print(f"Adding missing category column: {category}")
#                 self.category_one_hot[category] = 0

#         # DataFrame에 누락된 무드 열 추가 (0으로 초기화)
#         for mood in mood_preferences.keys():
#             if mood not in self.mood_one_hot.columns:
#                 print(f"Adding missing mood column: {mood}")
#                 self.mood_one_hot[mood] = 0

#         # 사용자 선호도 벡터 만들기
#         user_cat_vec = np.array([
#             category_preferences.get(col, 0) for col in self.category_one_hot.columns
#         ]) 
#         user_mood_vec = np.array([
#             mood_preferences.get(col, 0) for col in self.mood_one_hot.columns
#         ])

#         # 아이템 벡터 만들기
#         item_cat_vec = self.category_one_hot.values
#         item_mood_vec = self.mood_one_hot.values

#         # 유사도 계산하기
#         category_similarity = cosine_similarity([user_cat_vec], item_cat_vec).flatten()
#         mood_similarity = cosine_similarity([user_mood_vec], item_mood_vec).flatten()

#         # 점수 합산하기
#         total_similarity = (0.7 * category_similarity) + (0.3 * mood_similarity)
#         self.items_db["total_score"] = total_similarity

#         # 결과 반환
#         top_recommendations = self.items_db.sort_values(by="total_score", ascending=False).head(top_n)
#         return top_recommendations[["item_id", "category", "mood", "total_score"]].to_dict(orient="records")

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
        # 누락된 카테고리 및 무드 열 추가
        for category in category_preferences.keys():
            if category not in self.category_one_hot.columns:
                self.category_one_hot[category] = 0
        for mood in mood_preferences.keys():
            if mood not in self.mood_one_hot.columns:
                self.mood_one_hot[mood] = 0

        # 열 순서 정렬
        self.category_one_hot = self.category_one_hot.reindex(columns=category_preferences.keys(), fill_value=0)
        self.mood_one_hot = self.mood_one_hot.reindex(columns=mood_preferences.keys(), fill_value=0)

        # 사용자 벡터 생성
        user_cat_vec = np.array([category_preferences.get(col, 0) for col in self.category_one_hot.columns])
        user_mood_vec = np.array([mood_preferences.get(col, 0) for col in self.mood_one_hot.columns])

        # 아이템 벡터 생성
        item_cat_vec = self.category_one_hot.values
        item_mood_vec = self.mood_one_hot.values

        # 유사도 계산
        category_similarity = cosine_similarity([user_cat_vec], item_cat_vec).flatten()
        mood_similarity = cosine_similarity([user_mood_vec], item_mood_vec).flatten()

        # 점수 합산
        total_similarity = (0.7 * category_similarity) + (0.3 * mood_similarity)
        self.items_db["total_score"] = total_similarity

        # 결과 반환
        top_recommendations = self.items_db.sort_values(by="total_score", ascending=False).head(top_n)
        return top_recommendations[["sales_board_id", "category", "mood", "total_score"]].to_dict(orient="records")
