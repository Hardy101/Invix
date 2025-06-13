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
    phone = Column(String, default="--")
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="invitee")
    plan = Column(String, default="basic")
    location = Column(String, default="--")
    created_at = Column(DateTime, default=datetime.now())
    acct_type = Column(String, nullable=False)

    # Relationships
    events = relationship("Event", back_populates="creator")
    activitylogs = relationship("ActivityLog", back_populates="user")


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
    status = Column(String, default="upcoming")
    created_at = Column(DateTime, default=datetime.now())

    # Relationships
    creator = relationship("User", back_populates="events")
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
    activitylogs = relationship("ActivityLog", back_populates="guest")

    def __repr__(self):
        return f"<Guest(id={self.id}, name={self.name}, tags={self.tags})>"


class ActivityLog(Base):
    __tablename__ = "activitylogs"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    guest_id = Column(
        Integer, ForeignKey("guests.id"), nullable=True
    )  # Nullable since not all activities are guest-related
    user_id = Column(
        Integer, ForeignKey("users.id"), nullable=True
    )  # Track who performed the action

    # Activity details
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="completed")

    # Metadata
    method = Column(String, nullable=True)
    activity_data = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

    # Relationships
    event = relationship("Event", back_populates="activitylogs")
    guest = relationship("Guest", back_populates="activitylogs")
    user = relationship("User", back_populates="activitylogs")

    def __repr__(self):
        return f"<ActivityLog(id={self.id}, type={self.type}, description={self.description})>"
