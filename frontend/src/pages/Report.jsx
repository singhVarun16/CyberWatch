import { useState } from "react";

function Report() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [yourName, setYourName] = useState("");
  const [yourPhone, setYourPhone] = useState("");
  const [suspectName, setSuspectName] = useState("");
  const [suspectPhone, setSuspectPhone] = useState("");
  const [suspectUpi, setSuspectUpi] = useState("");
  const [suspectProfile, setSuspectProfile] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suspectPhone && !suspectUpi && !suspectProfile) {
      alert("Please enter suspect Phone, UPI ID, or Social Profile.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category, description, city, yourName, yourPhone,
          suspectName, suspectPhone, suspectUpi, suspectProfile,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit report.");
      }
    } catch {
      alert("Backend server is not running.");
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <h1>Report Submitted!</h1>
        <p>Your complaint has been filed successfully.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Report a Crime</h1>

      <form onSubmit={handleSubmit}>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select</option>
          <option>UPI Fraud</option>
          <option>Phishing</option>
          <option>Fake Job Scam</option>
          <option>Identity Theft</option>
          <option>Social Media Fraud</option>
        </select>

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="What happened?" />

        <label>City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Enter city" />

        <h3>Your Details</h3>
        <label>Your Name</label>
        <input value={yourName} onChange={(e) => setYourName(e.target.value)} required placeholder="Enter your name" />

        <label>Your Phone</label>
        <input value={yourPhone} onChange={(e) => setYourPhone(e.target.value)} placeholder="Enter your phone number" />

        <h3>Suspect Details</h3>
        <label>Suspect Name</label>
        <input value={suspectName} onChange={(e) => setSuspectName(e.target.value)} placeholder="Name (if known)" />

        <label>Suspect Phone Number</label>
        <input value={suspectPhone} onChange={(e) => setSuspectPhone(e.target.value)} placeholder="Phone number" />

        <label>Suspect UPI ID</label>
        <input value={suspectUpi} onChange={(e) => setSuspectUpi(e.target.value)} placeholder="example@upi" />

        <label>Suspect Social Media Profile</label>
        <input value={suspectProfile} onChange={(e) => setSuspectProfile(e.target.value)} placeholder="Instagram/Facebook link" />

        <button type="submit" className="btn btn-primary">Submit Report</button>
      </form>
    </div>
  );
}

export default Report;