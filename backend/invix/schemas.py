# File for FastAPI operations and database connection management.
from datetime import date
from pydantic import BaseModel
from typing import Optional, List


# For Authentication and User Management
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "invitee"


class UserLogin(BaseModel):
    email: str
    password: str


class GoogleAuthRequest(BaseModel):
    token: str


class GoogleUser(BaseModel):
    email: str
    name: str
    token: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "token": "your_google_id_token_here",
            }
        }


class PublicUser(BaseModel):
    id: int
    name: str
    email: str
    role: str
    plan: str

    class Config:
        from_attributes = True


# For Event Management
class Guest(BaseModel):
    name: str
    tags: str
    email: str = ""

    class Config:
        from_attributes = True


class GuestResponse(BaseModel):
    id: int
    name: str
    tags: str
    email: str
    qr_token: str

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    name: str
    date: date
    location: str
    expected_guests: int


# Model for Event Response (for viewing)
class EventResponse(EventBase):
    id: int

    class Config:
        from_attributes = True  # To support SQLAlchemy models directly


class EventUpdate(EventBase):
    name: Optional[str] = None
    date: date
    time: Optional[str] = None
    location: Optional[str] = None
    expected_guests: Optional[int] = None
    image_url: Optional[str] = None


class EventCreate(EventBase):
    time: Optional[str] = None
    image_url: Optional[str] = "default_event.jpg"

    class Config:
        from_attributes = True


class EventOut(EventCreate):
    id: int

    class Config:
        from_attributes = True
