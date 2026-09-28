import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <h1>Welcome to CyberWatch</h1>
      <p>Report cybercrime and stay safe online.</p>

      <div className="card">
        <h3>Report Cybercrime</h3>
        <p>File a complaint against online fraud.</p>
        <Link to="/report" className="btn btn-primary">Report Now</Link>
      </div>

      <div className="card">
        <h3>Check Blacklist</h3>
        <p>Verify if a phone number or email is blacklisted.</p>
        <Link to="/blacklist" className="btn btn-success">Check Now</Link>
      </div>

      <div className="card">
        <h3>Track Complaint</h3>
        <p>Check the status of your complaint.</p>
        <Link to="/track" className="btn btn-warning">Track Now</Link>
      </div>
    </div>
  );
}

export default Home;
