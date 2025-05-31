# Backend - Guest Management QR Code Scanner App

This is the backend service for the Guest Management QR Code Scanner App. The backend is built using **FastAPI** and **Socket.IO** to handle API requests and real-time communication.

## Features

- **FastAPI**: Provides a robust and fast REST API for the application.
- **Socket.IO**: Enables real-time communication between the frontend and backend.
- **QR Code Management**: Handles QR code generation and validation for guest check-ins.
- **Guest Management**: Manages guest data and their check-in/check-out statuses.

## Requirements

- Python 3.9+
- FastAPI
- Socket.IO
- Other dependencies listed in `requirements.txt`

## Installation

1. Clone the repository:

   ```bash
   git clone <[Scanner Repo](https://github.com/Hardy101/Scanner.git)>
   cd backend
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

1. Start the FastAPI server:

   ```bash
   uvicorn main:app --reload
   ```

2. The server will be available at `http://127.0.0.1:8000`.

## API Endpoints

- **`GET /api/guests`**: Retrieve a list of all guests.
- **`POST /api/guests`**: Add a new guest.
- **`POST /api/scan`**: Validate a QR code and update guest status.

## WebSocket Communication

The backend uses Socket.IO for real-time updates. Events include:

- **`guest_checked_in`**: Notifies the frontend when a guest checks in.
- **`guest_checked_out`**: Notifies the frontend when a guest checks out.

## Folder Structure

```
backend/
├── app/
│   ├── main.py          # Entry point for the FastAPI app
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── tests/               # Unit and integration tests
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For questions or support, please contact [Eghosa Ordia/eghordia130@gmail.com].
