import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Report from "./pages/Report";
import Blacklist from "./pages/Blacklist";
import TrackComplaint from "./pages/TrackComplaint";
import Dashboard from "./pages/Dashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-theme" : ""}`}>
      <BrowserRouter>
        <nav className="navbar">
          <strong><Link to="/">CYBERWATCH</Link></strong>
          <div>
            <Link to="/">Home</Link>
            {!user ? (
              <Link to="/login">Login</Link>
            ) : (
              <>
                {user.role === "police" && <Link to="/dashboard">Dashboard</Link>}
                <button onClick={handleLogout} className="btn btn-danger btn-small">
                  Logout ({user.name})
                </button>
              </>
            )}
            <Link to="/report">Report</Link>
            <Link to="/blacklist">Blacklist</Link>
            <Link to="/track">Track</Link>
            <button onClick={() => setDarkMode(!darkMode)} className="btn btn-primary btn-small">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/report" element={user ? <Report /> : <Navigate to="/login" />} />
            <Route path="/blacklist" element={user ? <Blacklist /> : <Navigate to="/login" />} />
            <Route path="/track" element={user ? <TrackComplaint /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        <footer className="footer">© 2026 CyberWatch &bull; Cyber Security & Crime Reporting Portal</footer>
      </BrowserRouter>
    </div>
  );
}

export default App;