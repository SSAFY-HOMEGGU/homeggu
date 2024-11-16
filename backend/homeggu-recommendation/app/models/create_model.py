import pandas as pd
import numpy as np
import pickle
import requests
from app.models.recommender import ContentBasedRecommender

# Goods 서버 API URL
GOODS_SERVER_URL = "https://k11b206.p.ssafy.io/api/goods/board"

def fetch_goods_from_server():
    # Goods 서버에서 상품 데이터를 가져옵니다
    try:
        response = requests.get(GOODS_SERVER_URL)
        response.raise_for_status()
        goods_data = response.json()
        return goods_data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching goods data: {e}")
        return []
    
goods_data = fetch_goods_from_server()

if goods_data:
    # JSON 데이터를 Pandas DataFrame으로 변경
    items_db = pd.DataFrame(goods_data)

    # 추천 시스템 생성
    recommender = ContentBasedRecommender(items_db)

    # 모델 저장
    with open("app/models/trained_model.pkl", "wb") as f:
        pickle.dump(recommender, f)
else:
    print("No data")

# # 데이터 생성
# items_db = pd.DataFrame({
#     "item_id": range(1, 21), 
#     "category": np.random.choice(["가전", "침대", "책상", "식탁", "의자", "소파", "조명", "전등", "수납", "서랍"], 20),
#     "mood": np.random.choice(["우드 & 빈티지", "블랙 & 메탈릭", "화이트 & 미니멀", "모던 & 클래식"], 20),
# })

# # 추천 시스템 생성
# recommender = ContentBasedRecommender(items_db)

# # 모델 저장
# with open("app/models/trained_model.pkl", "wb") as f:
#     pickle.dump(recommender, f)

# print("Model saved as trained_model.pkl")

# 아래는 우리 프로젝트 db의 상품과 연결할 때 참고
# import requests
# import pandas as pd
# import pickle
# from app.models.recommender import ContentBasedRecommender

# # Goods 서버의 API 호출
# GOODS_SERVER_URL = "http://goods-server-url/goods/board"

# def fetch_goods_from_server():
#     try:
#         response = requests.get(GOODS_SERVER_URL)
#         response.raise_for_status()  # HTTP 에러 확인
#         goods_data = response.json()
#         return goods_data
#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching goods data: {e}")
#         return []

# # Goods 서버에서 상품 데이터 가져오기
# goods_data = fetch_goods_from_server()

# # 데이터 변환
# if goods_data:
#     items_db = pd.DataFrame(goods_data)  # JSON 데이터를 Pandas DataFrame으로 변환
#     print("Data successfully loaded from Goods server.")

#     # 추천 시스템 생성
#     recommender = ContentBasedRecommender(items_db)

#     # 모델 저장
#     with open("app/models/trained_model.pkl", "wb") as f:
#         pickle.dump(recommender, f)

#     print("Model saved as trained_model.pkl")
# else:
#     print("No data received from Goods server.")

