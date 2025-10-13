import React, { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else {
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(email)) errs.email = "Please enter a valid email";
    }
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { email: email.trim(), password, remember };

      if (onLogin && typeof onLogin === "function") {
        await onLogin(payload);
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({ message: "Login failed" }));
          throw new Error(json.message || "Login failed");
        }
      }
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23676F7A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M8 12h8'/></svg>"
            alt="Logo"
            className="logo"
          />
          <h2>Sign in to your account</h2>
          <p>
            Or <a href="#">start your free trial</a>
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className={errors.password ? "input-error" : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="show-pass-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={isSubmitting}
              />
              Remember me
            </label>
            <a href="#">Forgot your password?</a>
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button type="submit" disabled={isSubmitting} className="login-btn">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="terms">
            By signing in, you agree to our <a href="#">terms</a> and <a href="#">privacy policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
