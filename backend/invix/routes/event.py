from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, status, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import pandas as pd
from io import BytesIO
import uuid
import os
import logging
import shutil
from datetime import datetime, timedelta
import json

# Local imports
from models import Event, Guest as GuestModel, ActivityLog
from schemas import (
    PublicUser,
    EventUpdate,
    EventOut,
    EventResponse,
    Guest,
    EventCreate,
    GuestResponse,
)
from database import get_db
from operations.functions import (
    get_events as fetch_events,
    create_event as create_event_crud,
    add_guests_to_event,
    fetch_current_user,
)

# from models import Event, Guest as GuestModel, ActivityLog
# from ..schemas import (
#     PublicUser,
#     EventUpdate,
#     EventOut,
#     EventResponse,
#     Guest,
#     EventCreate,
#     GuestResponse,
# )
# from ..database import get_db
# from ..operations.functions import (
#     get_events as fetch_events,
#     create_event as create_event_crud,
#     add_guests_to_event,
#     fetch_current_user,
# )

router = APIRouter(tags=["Events Management"])


@router.get("/")
def get_status():
    return {"message": "Your URL is working! Events API is up and running."}


# Returns the list of all the events
@router.get("/all", response_model=List[EventResponse])
def get_all_events(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    events = fetch_events(db=db, skip=skip, limit=limit)
    return events


# Returns the list of events belonging to the authenticated user
@router.get("/events", response_model=List[EventResponse])
def get_user_events(
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    events = db.query(Event).filter(Event.created_by == current_user.id).all()
    if not events:
        return []
    return events


# Returns a newly-created event
@router.post("/add", response_model=EventOut)
async def create_event(
    name: str = Form(...),
    date: str = Form(...),
    time: Optional[str] = Form(None),
    location: str = Form(...),
    expected_guests: int = Form(...),
    image: Optional[UploadFile] = File(None),
    guest_list: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    if not name or not date or not location or not expected_guests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There is an issue with your form, please check again and fill it correctly",
        )

    # Parse date string
    try:
        parsed_date = (
            datetime.fromisoformat(date.replace("Z", "+00:00"))
            if "T" in date
            else datetime.strptime(date, "%Y-%m-%d")
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD or ISO format.",
        )

    # Handle image upload
    image_url = "default_event.jpg"
    if image and image.filename:
        try:
            upload_dir = "static/events"
            os.makedirs(upload_dir, exist_ok=True)
            ext = os.path.splitext(image.filename)[1]
            unique_name = f"{uuid.uuid4()}{ext}"
            path = os.path.join(upload_dir, unique_name)
            with open(path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = unique_name
        except Exception as e:
            logging.error(f"Image save failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to save image")

    # Create the event object
    event_data = EventCreate(
        name=name,
        date=parsed_date,
        time=time,
        location=location,
        expected_guests=expected_guests,
        image_url=image_url,
    )

    try:
        new_event = create_event_crud(db=db, event=event_data, user_id=current_user.id)

        # Create activity log for event creation
        activity_log = ActivityLog(
            event_id=new_event.id,
            user_id=current_user.id,
            type="event_created",
            description=f"Event '{name}' was created",
            status="completed",
            method="manual",
            activity_data=json.dumps(
                {
                    "expected_guests": expected_guests,
                    "event_date": parsed_date.isoformat(),
                    "location": location,
                }
            ),
        )
        db.add(activity_log)

        # Handle guest list file after event creation
        if guest_list and guest_list.filename:
            try:
                contents = await guest_list.read()
                filename = guest_list.filename.lower()
                if filename.endswith(".csv"):
                    df = pd.read_csv(BytesIO(contents))
                elif filename.endswith((".xlsx", ".xls")):
                    df = pd.read_excel(BytesIO(contents))
                else:
                    raise HTTPException(
                        status_code=400, detail="Unsupported guest list file type"
                    )

                guest_count = 0
                for _, row in df.iterrows():
                    name = row.get("name")
                    email = row.get("email", "")
                    tags = row.get("tags", "")
                    guest_data = Guest(name=name, tags=tags, email=email)
                    add_guests_to_event(
                        db=db,
                        event_id=new_event.id,
                        guest=guest_data,
                        uuid=str(uuid.uuid4()),
                    )
                    guest_count += 1

                # Create activity log for bulk guest addition
                if guest_count > 0:
                    bulk_activity_log = ActivityLog(
                        event_id=new_event.id,
                        user_id=current_user.id,
                        type="guest_list_updated",
                        description=f"Added {guest_count} guests via file upload",
                        status="completed",
                        method="bulk_import",
                        activity_data=json.dumps(
                            {
                                "file_type": filename.split(".")[-1],
                                "guests_added": guest_count,
                            }
                        ),
                    )
                    db.add(bulk_activity_log)

            except Exception as e:
                logging.error(f"Error parsing guest list file: {str(e)}")
                raise HTTPException(
                    status_code=500, detail="Failed to process guest list file"
                )

        db.commit()
        return new_event
    except Exception as e:
        db.rollback()
        logging.error(f"Event creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Event creation failed")


# Returns the event with the given ID and If the event is not found, it raises a 404 error
@router.get("/get-event/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.created_by != current_user.id:
        raise HTTPException(
            status_code=403, detail="You don't have permission to access this event"
        )

    return event


@router.get("/event-image/{event_id}")
def get_event_image(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if not event.image_url:
        raise HTTPException(status_code=404, detail="No image available for this event")

    image_path = os.path.join("static/events", event.image_url)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")

    return FileResponse(path=image_path, media_type="image/jpeg")


# Route to get all guests
@router.get("/guests/all", response_model=List[GuestResponse])
def get_all_guests(db: Session = Depends(get_db)):
    guests = db.query(GuestModel).all()
    if not guests:
        return []
    return guests


# Adds guests to an event and returns the newly added guest
@router.post("/add-guest/{event_id}", response_model=GuestResponse)
def add_guest(
    event_id: int,
    guest: Guest,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    if not guest.name or not guest.tags:
        raise HTTPException(
            status_code=400, detail="Guest name and tags cannot be empty"
        )
    new_guest = add_guests_to_event(
        db=db, event_id=event_id, guest=guest, uuid=str(uuid.uuid4())
    )

    # Create activity log for guest addition
    activity_log = ActivityLog(
        event_id=event_id,
        guest_id=new_guest.id,
        user_id=current_user.id,
        type="guest_added",
        description=f"Guest '{guest.name}' was added manually",
        status="completed",
        method="manual",
        activity_data=json.dumps(
            {"guest_email": guest.email, "guest_tags": guest.tags}
        ),
    )
    db.add(activity_log)
    db.commit()

    return new_guest


# Route to get guests by event ID
@router.get("/guests/{event_id}", response_model=List[GuestResponse])
def get_guests_by_event(event_id: int, db: Session = Depends(get_db)):
    guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()
    return guests


# Route to add guests in bulk
@router.post("/guests-bulk/{event_id}", response_model=List[Guest])
async def add_bulk_guests(
    event_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        processed: List[Guest] = []
        for _, row in df.iterrows():
            name = row.get("name")
            tags = row.get("tags", "")
            email = row.get("email", "")
            guest_data = Guest(name=name, tags=tags, email=email)
            add_guests_to_event(
                db=db, event_id=event_id, guest=guest_data, uuid=str(uuid.uuid4())
            )

        return processed

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# Update an event by ID
@router.put("/update/{event_id}", response_model=EventOut)
def update_event(event_id: int, updated: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get the update data, excluding None values
    update_data = {k: v for k, v in updated.model_dump().items() if v is not None}

    # Update the event with non-None values
    for key, value in update_data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)
    return event


# Delete an event by ID
@router.delete("/delete/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    try:
        # Get the event
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        # Create activity log for event deletion
        activity_log = ActivityLog(
            event_id=event_id,
            user_id=current_user.id,
            type="event_deleted",
            description=f"Event '{event.name}' was deleted",
            status="completed",
            method="manual",
            activity_data=json.dumps(
                {
                    "event_date": event.date.isoformat(),
                    "expected_guests": event.expected_guests,
                    "location": event.location,
                }
            ),
        )
        db.add(activity_log)

        # Delete event image if it exists
        if event.image_url and event.image_url != "default_event.jpg":
            image_path = os.path.join("static/events", event.image_url)
            if os.path.exists(image_path):
                try:
                    os.remove(image_path)
                except Exception as e:
                    logging.error(f"Error deleting event image: {str(e)}")

        # Get all guests associated with this event
        guests = db.query(GuestModel).filter(GuestModel.event_id == event_id).all()

        # Delete QR code files for all guests
        for guest in guests:
            if guest.qr_path and os.path.exists(guest.qr_path):
                try:
                    os.remove(guest.qr_path)
                except Exception as e:
                    logging.error(
                        f"Error deleting QR code file for guest {guest.id}: {str(e)}"
                    )

        # Delete activity logs
        activity_logs = (
            db.query(ActivityLog).filter(ActivityLog.event_id == event_id).all()
        )
        for log in activity_logs:
            db.delete(log)

        # Delete guests
        for guest in guests:
            db.delete(guest)

        # Finally delete the event
        db.delete(event)
        db.commit()

        return {"message": "Event and all associated data deleted successfully"}
    except Exception as e:
        db.rollback()
        logging.error(f"Error deleting event: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")


@router.put("/activate/{event_id}", response_model=EventOut)
def activate_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    # Verify event exists and belongs to user
    event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.created_by == current_user.id)
        .first()
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.status == "active":
        raise HTTPException(status_code=400, detail="Event is already active")

    # Update event status to active
    event.status = "active"
    db.commit()
    db.refresh(event)

    return event


# Delete a guest by ID
@router.delete("/delete-guest/{guest_id}")
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    guest = db.query(GuestModel).filter(GuestModel.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    # Create activity log for guest deletion
    activity_log = ActivityLog(
        event_id=guest.event_id,
        guest_id=guest.id,
        user_id=current_user.id,
        type="guest_deleted",
        description=f"Guest '{guest.name}' was deleted",
        status="completed",
        method="manual",
        activity_data=json.dumps(
            {"guest_email": guest.email, "guest_tags": guest.tags}
        ),
    )
    db.add(activity_log)

    # Delete the QR code file if it exists
    if guest.qr_path and os.path.exists(guest.qr_path):
        try:
            os.remove(guest.qr_path)
        except Exception as e:
            logging.error(f"Error deleting QR code file: {str(e)}")

    db.delete(guest)
    db.commit()
    return {"message": "Guest deleted"}


@router.get("/qrcode/{uuid}")
def view_qrcode(uuid: str, db: Session = Depends(get_db)):
    guest = db.query(GuestModel).filter(GuestModel.qr_token == uuid).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    file_path = guest.qr_path

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="QR code file not found")

    return FileResponse(path=guest.qr_path, media_type="image/png")


@router.get("/readqrcode/{uuid}")
def read_qrcode(uuid: str, db: Session = Depends(get_db)):
    try:
        guest = db.query(GuestModel).filter(GuestModel.qr_token == uuid).first()

        if not guest:
            raise HTTPException(status_code=404, detail="Guest not found")

        # Get the event details
        event = db.query(Event).filter(Event.id == guest.event_id).first()

        # Get check-in status from activity log
        activity_log = (
            db.query(ActivityLog)
            .filter(
                ActivityLog.guest_id == guest.id, ActivityLog.event_id == guest.event_id
            )
            .order_by(ActivityLog.check_in_time.desc())
            .first()
        )

        status = "pending"
        if activity_log:
            status = activity_log.status

        return {
            "name": guest.name,
            "email": guest.email,
            "tags": guest.tags,
            "event": {
                "id": event.id,
                "name": event.name,
                "date": event.date,
                "location": event.location,
            },
            "status": status,
            "lastActivity": activity_log.check_in_time if activity_log else None,
            "qr_token": guest.qr_token,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Guest not found")


@router.get("/{event_id}/analytics")
def get_event_analytics(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    # Verify event exists and belongs to user
    event = (
        db.query(Event)
        .filter(Event.id == event_id, Event.created_by == current_user.id)
        .first()
    )

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get guest status counts
    checked_in = (
        db.query(func.count(ActivityLog.id))
        .filter(ActivityLog.event_id == event_id, ActivityLog.status == "checked_in")
        .scalar()
        or 0
    )

    checked_out = (
        db.query(func.count(ActivityLog.id))
        .filter(ActivityLog.event_id == event_id, ActivityLog.status == "checked_out")
        .scalar()
        or 0
    )

    # Calculate pending guests (total guests minus checked in and checked out)
    total_guests = (
        db.query(func.count(GuestModel.id))
        .filter(GuestModel.event_id == event_id)
        .scalar()
        or 0
    )
    pending = total_guests - checked_in - checked_out

    # Get check-in times by hour
    check_in_times = []
    for hour in range(9, 17):  # 9 AM to 4 PM
        hour_start = datetime.now().replace(
            hour=hour, minute=0, second=0, microsecond=0
        )
        hour_end = hour_start + timedelta(hours=1)

        count = (
            db.query(func.count(ActivityLog.id))
            .filter(
                ActivityLog.event_id == event_id,
                ActivityLog.status == "checked_in",
                ActivityLog.check_in_time >= hour_start,
                ActivityLog.check_in_time < hour_end,
            )
            .scalar()
            or 0
        )

        check_in_times.append(
            {"hour": f"{hour} AM" if hour < 12 else f"{hour - 12} PM", "count": count}
        )

    # Get activity logs for the event
    activity_logs = (
        db.query(ActivityLog)
        .filter(ActivityLog.event_id == event_id)
        .order_by(ActivityLog.check_in_time.desc())
        .all()
    )

    # Format activity logs for response
    formatted_logs = []
    for log in activity_logs:
        formatted_log = {
            "guest_name": log.name,
            "status": log.status,
            "check_in_time": (
                log.check_in_time.isoformat() if log.check_in_time else None
            ),
            "check_out_time": (
                log.check_out_time.isoformat() if log.check_out_time else None
            ),
            "method": log.method,
            "timestamp": (
                log.check_in_time.isoformat()
                if log.check_in_time
                else log.check_out_time.isoformat() if log.check_out_time else None
            ),
        }
        formatted_logs.append(formatted_log)

    return {
        "checkedIn": checked_in,
        "checkedOut": checked_out,
        "pending": pending,
        "totalGuests": total_guests,
        "checkInTimes": check_in_times,
        "activityLogs": formatted_logs,
    }


@router.post("/check-in/{uuid}")
def check_in_guest(
    uuid: str,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    guest = db.query(GuestModel).filter(GuestModel.qr_token == uuid).first()
    if not guest:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "GUEST_NOT_FOUND",
                "message": "Guest not found",
                "qr_token": uuid,
            },
        )

    # Check if guest is already checked in
    latest_activity = (
        db.query(ActivityLog)
        .filter(
            ActivityLog.guest_id == guest.id,
            ActivityLog.event_id == guest.event_id,
            ActivityLog.type == "check_in",
        )
        .order_by(ActivityLog.created_at.desc())
        .first()
    )

    if latest_activity and latest_activity.status == "completed":
        raise HTTPException(
            status_code=400,
            detail={
                "error": "ALREADY_CHECKED_IN",
                "message": f"{guest.name} is already checked in",
                "guest_name": guest.name,
                "last_check_in": (
                    latest_activity.activity_data.get("check_in_time")
                    if latest_activity.activity_data
                    else None
                ),
            },
        )

    # Create activity log entry
    check_in_time = datetime.now()
    activity_log = ActivityLog(
        guest_id=guest.id,
        event_id=guest.event_id,
        user_id=current_user.id,
        type="check_in",
        description=f"Guest {guest.name} checked in via QR code",
        status="completed",
        method="qr_code",
        activity_data=json.dumps(
            {
                "check_in_time": check_in_time.isoformat(),
                "location": "main entrance",  # You can make this dynamic if needed
            }
        ),
    )
    db.add(activity_log)
    db.commit()

    return {
        "message": f"Guest {guest.name} checked in successfully",
        "status": "success",
        "guest_name": guest.name,
        "check_in_time": check_in_time.isoformat(),
    }


@router.post("/check-out/{uuid}")
def check_out_guest(
    uuid: str,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    guest = db.query(GuestModel).filter(GuestModel.qr_token == uuid).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    # Get the latest check-in activity
    latest_activity = (
        db.query(ActivityLog)
        .filter(
            ActivityLog.guest_id == guest.id,
            ActivityLog.event_id == guest.event_id,
            ActivityLog.type == "check_in",
            ActivityLog.status == "completed",
        )
        .order_by(ActivityLog.created_at.desc())
        .first()
    )

    if not latest_activity:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "NOT_CHECKED_IN",
                "message": f"{guest.name} is not checked in",
                "guest_name": guest.name,
            },
        )

    # Create activity log entry
    check_out_time = datetime.now()
    activity_log = ActivityLog(
        guest_id=guest.id,
        event_id=guest.event_id,
        user_id=current_user.id,
        type="check_out",
        description=f"Guest {guest.name} checked out via QR code",
        status="completed",
        method="qr_code",
        activity_data=json.dumps(
            {
                "check_out_time": check_out_time.isoformat(),
                "check_in_time": latest_activity.activity_data.get("check_in_time"),
                "duration": (
                    check_out_time
                    - datetime.fromisoformat(
                        latest_activity.activity_data.get("check_in_time")
                    )
                ).total_seconds()
                / 3600,  # Duration in hours
            }
        ),
    )
    db.add(activity_log)
    db.commit()

    return {
        "message": f"Guest {guest.name} checked out successfully",
        "check_out_time": check_out_time.isoformat(),
    }


@router.get("/search-guest", response_model=List[GuestResponse])
def search_guest(
    query: str,
    db: Session = Depends(get_db),
    current_user: PublicUser = Depends(fetch_current_user),
):
    # Search for guests where name, email, or tags contain the query string
    guests = (
        db.query(GuestModel)
        .join(Event)
        .filter(Event.created_by == current_user.id)
        .filter(
            (GuestModel.name.ilike(f"%{query}%"))
            | (GuestModel.email.ilike(f"%{query}%"))
            | (GuestModel.tags.ilike(f"%{query}%"))
        )
        .all()
    )
    return guests
