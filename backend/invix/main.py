from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from typing import List
import logging
from fastapi.staticfiles import StaticFiles
import os

# Local imports
from routes import auth, event
from models import User as UserModel
from schemas import PublicUser
from database import get_db, init_db
# from .routes import auth, event
# from .models import User as UserModel
# from .schemas import PublicUser
# from .database import get_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.title = "Invix API"
app.description = "API for Invix, a guest management system."

# Get the absolute path to the static directory
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    # app.mount("/static", StaticFiles(directory=static_dir), name="static") ##production
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
else:
    logging.warning(
        f"Static directory not found at {static_dir}. Static files will not be served."
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logging.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://invix-mocha.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers with explicit prefixes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(event.router, prefix="/event", tags=["Events"])


@app.get("/")
def get_status():
    return {"message": "Your URL is working! API is up and running 🚀"}


@app.get("/users", response_model=List[PublicUser])
def get_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return [PublicUser.model_validate(user) for user in users]
