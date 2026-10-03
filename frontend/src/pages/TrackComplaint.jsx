import { useState, useEffect } from "react";

function TrackComplaint() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <h1>Track Complaints</h1>

      {reports.length === 0 && <p>No complaints found.</p>}

      {reports.map((r) => (
        <div className="card" key={r._id}>
          <p><b>Complaint ID:</b> {r._id}</p>
          <p><b>Category:</b> {r.category}</p>
          <p><b>City:</b> {r.city}</p>
          {r.suspectPhone && <p><b>Suspect Phone:</b> {r.suspectPhone}</p>}
          {r.suspectUpi && <p><b>Suspect UPI:</b> {r.suspectUpi}</p>}
          {r.suspectProfile && <p><b>Suspect Profile:</b> {r.suspectProfile}</p>}
          <p><b>Status:</b> {r.status}</p>
          <p><b>Date:</b> {new Date(r.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default TrackComplaint;