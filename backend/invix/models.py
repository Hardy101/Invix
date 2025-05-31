from sqlalchemy import Column, Integer, String, Date, ForeignKey, VARCHAR, DateTime
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime

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
    activitylogs = relationship("ActivityLog", back_populates="event")


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


class ActivityLog(Base):
    __tablename__ = "activitylogs"

    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(VARCHAR, nullable=False)
    check_in_time = Column(DateTime, default=datetime.now)
    check_out_time = Column(DateTime, default=datetime.now)
    status = Column(String, default="pending")
    method = Column(String)

    event = relationship("Event", back_populates="activitylogs")
