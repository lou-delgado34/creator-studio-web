import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setWorking(true);

    try {
      if (mode === "signup") {
        const result = await signUp(email, password, fullName);

        if (result?.error) {
          setErrorMessage(result.error);
          setWorking(false);
          return;
        }

        setSuccessMessage(
          "Account created. Check your email, then log in."
        );

        setMode("login");
        setPassword("");
        setWorking(false);
        return;
      }

      const result = await signIn(email, password);

      if (result?.error) {
        setErrorMessage(result.error);
        setWorking(false);
        return;
      }

      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage(error?.message || "Something went wrong.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 65%, #000814 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(15, 23, 42, 0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "54px",
            lineHeight: 1,
            fontWeight: 800,
            margin: "0 0 16px 0",
            letterSpacing: "-1px",
          }}
        >
          CreatorStudio
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            marginBottom: "28px",
          }}
        >
          Build content, manage plans, and grow your creator business.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 700,
              background:
                mode === "login"
                  ? "linear-gradient(90deg, #ec4899, #a855f7)"
                  : "#1e293b",
              color: "white",
            }}
          >
            Log In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            style={{
              padding: "14px 16px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 700,
              background:
                mode === "signup"
                  ? "linear-gradient(90deg, #ec4899, #a855f7)"
                  : "#1e293b",
              color: "white",
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                style={inputStyle}
              />
            </>
          )}

          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
            style={inputStyle}
          />

          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={working}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "18px",
              border: "none",
              cursor: working ? "not-allowed" : "pointer",
              fontSize: "18px",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(90deg, #ec4899, #a855f7)",
              opacity: working ? 0.8 : 1,
            }}
          >
            {working
              ? "Working..."
              : mode === "signup"
              ? "Create Account"
              : "Log In"}
          </button>
        </form>

        {successMessage ? (
          <p
            style={{
              color: "#4ade80",
              marginTop: "18px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {successMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p
            style={{
              color: "#f87171",
              marginTop: "18px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 18px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0f172a",
  color: "white",
  fontSize: "18px",
  marginBottom: "18px",
  outline: "none",
  boxSizing: "border-box",
};
