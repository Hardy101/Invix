from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ALGORITHM: str
    SECRET_KEY: str
    GOOGLE_CLIENT_ID: str

    class Config:
        env_file = ".env"

settings = Settings()