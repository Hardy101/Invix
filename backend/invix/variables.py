import os

EXPIRY_DATE = 60 * 60 * 24 * 7
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "whitecrow")