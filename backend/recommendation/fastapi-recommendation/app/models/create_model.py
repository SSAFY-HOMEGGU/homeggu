import pandas as pd
import numpy as np
import pickle
from app.models.recommender import ContentBasedRecommender

# 데이터 생성
items_db = pd.DataFrame({
    "item_id": range(1, 201), 
    "category": np.random.choice(["가전", "침대", "책상", "식탁", "의자", "소파", "조명", "전등", "수납", "서랍"], 200),
    "mood": np.random.choice(["우드 & 빈티지", "블랙 & 메탈릭", "화이트 & 미니멀", "모던 & 클래식"], 200),
})

# 추천 시스템 생성
recommender = ContentBasedRecommender(items_db)

# 모델 저장
with open("app/models/trained_model.pkl", "wb") as f:
    pickle.dump(recommender, f)

print("Model saved as trained_model.pkl")
