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

# 아래는 우리 프로젝트 db의 상품과 연결할 때 참고
# import pandas as pd
# import numpy as np
# import pickle
# import mysql.connector
# from app.models.recommender import ContentBasedRecommender

# # MySQL 데이터베이스 연결 설정
# db_config = {
#     'user': 'your_username',         # MySQL 사용자 이름
#     'password': 'your_password',     # MySQL 비밀번호
#     'host': 'localhost',             # MySQL 호스트
#     'database': 'your_database',     # 사용할 데이터베이스 이름
# }

# # MySQL에서 데이터 가져오기
# try:
#     # MySQL 연결
#     connection = mysql.connector.connect(**db_config)

#     # SQL 쿼리 작성
#     query = """
#         SELECT 
#             item_id,
#             category,
#             mood
#         FROM
#             your_items_table;
#     """

#     # 데이터 읽기
#     items_db = pd.read_sql(query, connection)

#     print("Data successfully loaded from MySQL.")

# except mysql.connector.Error as err:
#     print(f"Error: {err}")
# finally:
#     if connection.is_connected():
#         connection.close()

# # 추천 시스템 생성
# recommender = ContentBasedRecommender(items_db)

# # 모델 저장
# with open("app/models/trained_model.pkl", "wb") as f:
#     pickle.dump(recommender, f)

# print("Model saved as trained_model.pkl")
