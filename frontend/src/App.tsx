import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import SplashScreen from "./pages/splashscreen";
import Register from "./pages/register";
import Home from "./pages/home";
import EventDetails from "./pages/eventdetails";
import Scan from "./pages/scan";
import Profile from "./pages/profile";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/AuthProvider";
import ToastNotification from "./components/toast";
import Analytics from "./pages/analytics";
import EventDetailsPage from "./pages/event-details-page";

function App() {
  return (
    <main>
      <section className="font-poppins">
        <ToastNotification />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="" element={<SplashScreen />} />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path="/eventdetailspage/" element={<EventDetailsPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </section>
    </main>
  );
}

export default App;
