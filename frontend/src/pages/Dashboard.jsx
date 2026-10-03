import { useState, useEffect, useRef } from "react";

const cityCoords = {
  Mumbai: [19.07, 72.87], Delhi: [28.61, 77.2], Bangalore: [12.97, 77.59],
  Chennai: [13.08, 80.27], Kolkata: [22.57, 88.36], Hyderabad: [17.38, 78.47],
  Pune: [18.52, 73.85], Jaipur: [26.91, 75.78], Lucknow: [26.84, 80.94],
};

function Dashboard({ user }) {
  const [reports, setReports] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [tab, setTab] = useState("overview");
  const [blType, setBlType] = useState("Phone");
  const [blValue, setBlValue] = useState("");
  const mapRef = useRef(null);

  const fetchData = () => {
    fetch("http://localhost:3000/api/complaints")
      .then((res) => res.json())
      .then((data) => {setReports(data); })
      .catch(() => {});

    fetch("http://localhost:3000/api/blacklist")
      .then((res) => res.json())
      .then((data) => {setBlacklist(data); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Free OpenStreetMap Heatmap (No API Key Required)
  useEffect(() => {
    if (tab !== "overview" || !window.L) return;
    const mapEl = document.getElementById("crime-map");
    if (!mapEl) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = window.L.map("crime-map", {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([22.5, 82.5], 5);
    mapRef.current = map;
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    const cityCounts = {};
    reports.forEach((r) => { if (r.city) cityCounts[r.city] = (cityCounts[r.city] || 0) + 1; });

    Object.entries(cityCounts).forEach(([city, count]) => {
      const coords = cityCoords[city];
      if (coords) {
        const color = count >= 4 ? "#ef4444" : count >= 2 ? "#f97316" : "#2563eb";

        // Outer glow halo
        window.L.circleMarker(coords, {
          radius: Math.max(count * 12, 14),
          color: color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.25,
        }).addTo(map);

        // Core vivid hotspot marker
        window.L.circleMarker(coords, {
          radius: Math.max(count * 6, 7),
          color: "#ffffff",
          weight: 2,
          fillColor: color,
          fillOpacity: 0.9,
        })
          .bindPopup(`
            <div class="map-popup">
              <h4>${city}</h4>
              <p><b>${count}</b> incident report${count > 1 ? "s" : ""}</p>
            </div>
          `)
          .addTo(map);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [tab, reports]);

  if (!user || user.role !== "police") {
    return (
      <div className="page">
        <div className="card access-denied">
          <h2>Police Access Required</h2>
          <p className="text-red">This dashboard is restricted to authorized Police officers. Please login as police.</p>
        </div>
      </div>
    );
  }

  const total = reports.length;
  const pending = reports.filter((r) => r.status === "Pending").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) setReports(reports.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch {
      alert("Error updating status.");
    }
  };

  const addToBlacklist = async (e) => {
    e.preventDefault();
    if (!blValue.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: blType, value: blValue.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlacklist([data.entry, ...blacklist]);
        setBlValue("");
      }
    } catch {
      alert("Error adding to blacklist.");
    }
  };

  const deleteFromBlacklist = async (id) => {
    if (!window.confirm("Remove this entry from blacklist?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/blacklist/${id}`, { method: "DELETE" });
      if (res.ok) setBlacklist(blacklist.filter((b) => b._id !== id));
    } catch {
      alert("Error deleting from blacklist.");
    }
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Police Command Dashboard</h1>
        <p>Live cyber crime tracking, regional heatmap analysis, and blacklist management</p>
      </div>

      <div className="tabs">
        <button onClick={() => setTab("overview")} className={`btn ${tab === "overview" ? "btn-primary" : "btn-light"}`}>Overview</button>
        <button onClick={() => setTab("cases")} className={`btn ${tab === "cases" ? "btn-primary" : "btn-light"}`}>All Cases ({reports.length})</button>
        <button onClick={() => setTab("blacklist")} className={`btn ${tab === "blacklist" ? "btn-primary" : "btn-light"}`}>Blacklist ({blacklist.length})</button>
      </div>

      {tab === "overview" && (
        <>
          <div className="stats-row">
            <div className="stat-card stat-total"><h2>{total}</h2><p>Total Cases</p></div>
            <div className="stat-card stat-pending"><h2 className="text-orange">{pending}</h2><p>Pending</p></div>
            <div className="stat-card stat-resolved"><h2 className="text-green">{resolved}</h2><p>Resolved</p></div>
            <div className="stat-card stat-blacklist"><h2>{blacklist.length}</h2><p>Blacklisted</p></div>
          </div>

          <div className="card map-card">
            <div className="map-card-header">
              <h2>Regional Crime Heatmap</h2>
              <div className="heatmap-legend">
                <span><i className="dot dot-high"></i> High</span>
                <span><i className="dot dot-medium"></i> Moderate</span>
                <span><i className="dot dot-low"></i> Low</span>
              </div>
            </div>
            <div id="crime-map" className="map-container"></div>
          </div>
        </>
      )}

      {tab === "cases" && (
        <div className="card">
          <h2>All Reported Cases</h2>
          <table>
            <thead>
              <tr><th>Category</th><th>City</th><th>Suspect</th><th>Status</th><th>Update Status</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
              <td><b>{r.category}</b></td>
              <td>{r.city}</td>
              <td>
                <b>{r.suspectName}</b>
                <br />
                {r.suspectPhone || r.suspectUpi || r.suspectProfile}
              </td>
              <td>
                <span className={`status-pill ${r.status === "Resolved" ? "status-resolved" : r.status === "Pending" ? "status-pending"   : "status-investigation" }`} >
                  {r.status}
                </span>
              </td>
              <td>
                <select className="auto-width select-status" value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)}>
                  <option>Pending</option>
                  <option>Under Investigation</option>
                  <option>Resolved</option>
                </select>
              </td>
            </tr>

              ))}
            </tbody>
          </table>
          {reports.length === 0 && <p>No cases recorded yet.</p>}
        </div>
      )}

      {tab === "blacklist" && (
        <div className="card">
          <h2>Manage Blacklisted Contacts</h2>
          <form onSubmit={addToBlacklist} className="flex-form">
            <div className="auto-width">
              <label>Type</label>
              <select value={blType} onChange={(e) => setBlType(e.target.value)}>
                <option>Phone</option>
                <option>UPI ID</option>
                <option>Email</option>
                <option>Social Media Profile</option>
              </select>
            </div>
            <div className="form-control">
              <label>Value</label>
              <input value={blValue} onChange={(e) => setBlValue(e.target.value)} required placeholder="Enter number, UPI ID or profile link" />
            </div>
            <button type="submit" className="btn btn-success">Add to Blacklist</button>
          </form>

          <table>
            <thead>
              <tr><th>Type</th><th>Value</th><th>Action</th></tr>
            </thead>
            <tbody>
              {blacklist.map((b) => (
                <tr key={b._id}>
                  <td><b>{b.type}</b></td>
                  <td>{b.value}</td>
                  <td><button onClick={() => deleteFromBlacklist(b._id)} className="btn btn-danger btn-small">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {blacklist.length === 0 && <p>No blacklisted entries yet.</p>}
        </div>
      )}
    </div>
  );
}

export default Dashboard;