# Event Invitee Management - Frontend

This is the frontend for the Event Invitee Management tool, built using **React (TypeScript + Vite)**. The app provides event managers with an intuitive UI to create events, manage invitees, and track attendance via QR code scanning.

## 🚀 Features

- Event creation & management
- Invitee list with QR code generation
- Seamless invite sharing
- QR code scanning for check-in
- Real-time attendance tracking
- Analytics dashboard

## 🛠 Tech Stack

- **React (TypeScript)** – Core framework
- **Vite** – Fast build tool
- **Tailwind CSS** – Styling
- **React Router** – Navigation
- **Axios** – API calls
- **Socket.IO Client** – Real-time updates

## 📦 Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <[Scanner Repo](https://github.com/Hardy101/Scanner.git)>
cd frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8000  # FastAPI backend URL
```

### 4️⃣ Start the Development Server

```bash
npm run dev
```

## 📡 API Integration

The frontend communicates with the FastAPI backend for event management, invitee handling, QR code retrieval, and analytics. Ensure the backend is running before testing API requests.

## 📌 TODO

- [ ] Implement authentication flow
- [ ] Complete event & invitee management UI
- [ ] Integrate QR scanning feature
- [ ] Finalize analytics dashboard

---

For any issues or feature requests, feel free to open an issue in the repository!
