from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
import os
import logging
import time
import asyncio


# Local imports
from database import SessionLocal
from models import User
from schemas import PublicUser, UserCreate, UserLogin, GoogleAuthRequest
from security import (
    hash_password,
    verify_password,
    create_access_token,
)
from variables import EXPIRY_DATE
from operations.functions import fetch_current_user

# from ..database import SessionLocal
# from ..models import User
# from ..schemas import PublicUser, UserCreate, UserLogin
# from ..security import (
#     hash_password,
#     verify_password,
#     create_access_token,
# )
# from ..variables import EXPIRY_DATE
# from ..operations.functions import fetch_current_user

router = APIRouter(tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if user.role not in ["admin", "event_manager", "invitee"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="invitee",
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.email, "role": db_user.role})
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=EXPIRY_DATE,
    )
    return response


@router.post("/google")
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    if not payload.token:
        raise HTTPException(status_code=400, detail="Google token is required")

    try:
        # Get the client ID from environment variable
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not client_id:
            raise HTTPException(
                status_code=500, detail="Google client ID not configured"
            )

        # Verify the token with clock skew tolerance
        try:
            idinfo = id_token.verify_oauth2_token(
                payload.token,
                requests.Request(),
                client_id,
                clock_skew_in_seconds=10,  # Allow 10 seconds of clock skew
            )
        except ValueError as e:
            if "Token used too early" in str(e):
                # If token is too early, wait a moment and try again
                await asyncio.sleep(1)
                idinfo = id_token.verify_oauth2_token(
                    payload.token,
                    requests.Request(),
                    client_id,
                    clock_skew_in_seconds=10,
                )
            else:
                raise

        # Extract user information
        user_email = idinfo.get("email")
        user_name = idinfo.get(
            "name", user_email.split("@")[0]
        )  # Use email username if name not provided

        if not user_email:
            raise HTTPException(
                status_code=400, detail="Invalid token: email not found"
            )

        # Check if user exists
        db_user = db.query(User).filter(User.email == user_email).first()

        if not db_user:
            # Create new user if doesn't exist
            db_user = User(
                name=user_name,
                email=user_email,
                hashed_password="",  # No password for Google auth
                role="invitee",
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        # Generate JWT token
        token = create_access_token({"sub": user_email, "role": db_user.role})
        response = JSONResponse(content={"message": "Google authentication successful"})
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="None",
            max_age=EXPIRY_DATE,
        )
        return response

    except ValueError as e:
        logging.error(f"Google token verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        logging.error(f"Google authentication error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


@router.get("/me", response_model=PublicUser)
def get_current_user(current_user: User = Depends(fetch_current_user)):
    return PublicUser.model_validate(current_user, from_attributes=True)


@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(
        key="access_token", httponly=True, secure=True, samesite="None"
    )
    return response


@router.get("/user", response_model=PublicUser)
def get_user(user: User = Depends(get_current_user)):
    return PublicUser.model_validate(user)
