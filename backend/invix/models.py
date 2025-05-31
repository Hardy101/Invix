from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4

# Local imports
from database import Base
# from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="invitee")
    plan = Column(String, default="basic")


# Model for Event Table
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    date = Column(Date, nullable=False)
    location = Column(String, default="not set")
    expected_guests = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"))
    time = Column(String, nullable=True)
    image_url = Column(String, default="default_event.jpg")
    guests = relationship("Guest", back_populates="event")


# Guest model
class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    tags = Column(String, default="")
    email = Column(String, default="")
    event_id = Column(Integer, ForeignKey("events.id"))
    qr_token = Column(String, unique=True, default=lambda: str(uuid4()))
    qr_path = Column(String, default="null", unique=True)

    event = relationship("Event", back_populates="guests")

    def __repr__(self):
        return f"<Guest(id={self.id}, name={self.name}, tags={self.tags})>"
