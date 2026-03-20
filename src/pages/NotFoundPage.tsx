import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="screen-center">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "12px" }}>Page Not Found</h1>
        <p style={{ marginBottom: "16px" }}>That page does not exist.</p>
        <Link to="/" className="secondary-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
}
