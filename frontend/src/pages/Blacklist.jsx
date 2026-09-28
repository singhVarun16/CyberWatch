import { useState } from "react";

function Blacklist() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/blacklist/check?value=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.blacklisted) {
        setResult("danger");
      } else {
        setResult("safe");
      }
    } catch {
      setResult("error");
    }
  };

  return (
    <div className="page">
      <h1>Check Blacklist</h1>
      <p>Enter a phone number, email, UPI ID or social media profile to check.</p>

      <form onSubmit={handleCheck}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          placeholder="Enter phone, UPI, email or profile"
        />
        <button type="submit" className="btn btn-primary">Check Database</button>
      </form>

      {result === "danger" && (
        <div className="alert alert-danger">
          <b>WARNING: BLACKLISTED</b>
          <p>This identifier is recorded in our cyber fraud database. Do not transact or engage.</p>
        </div>
      )}

      {result === "safe" && (
        <div className="alert alert-success">
          <b>CLEAR: Not Found</b>
          <p>This identifier is not currently in the blacklist database.</p>
        </div>
      )}

      {result === "error" && (
        <div className="alert alert-warning">
          Backend server is not running. Please start the backend.
        </div>
      )}
    </div>
  );
}

export default Blacklist;