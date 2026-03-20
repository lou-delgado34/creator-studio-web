import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { session, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    if (mode === "signup") {
      const result = await signUp(email, password, fullName);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage("Account created. You can now enter the app.");
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
    }

    setSubmitting(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">CreatorStudio</div>
        <div className="auth-subtitle">
          Build content, manage plans, and grow your creator business.
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Log In
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input
                className="text-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="text-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="text-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Working..." : mode === "signup" ? "Create Account" : "Log In"}
          </button>

          {message && <div className="success-text">{message}</div>}
          {error && <div className="error-text">{error}</div>}
        </form>
      </div>
    </div>
  );
}
