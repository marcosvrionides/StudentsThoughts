import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import "./Login.css"
import { GoogleButton } from 'react-google-button'
import { UserAuth } from "../Context/AuthContext"

const Login = () => {
  let [authMode, setAuthMode] = useState("signin")
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = UserAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/home');
    } catch (error) {
      alert('Error, please try again.');
    }
  };

  const [DisplayName, setDisplayName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { signUp } = UserAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (newPassword.length >= 6) {
      try {
        await signUp(newEmail, newPassword, DisplayName)
        navigate('/home');
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Password must be at least 6 characters.')
    }
  }

  const { googleSignIn, user } = UserAuth();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("error")
    }
  }

  useEffect(() => {
    if (user !== null && Object.keys(user) !== 0) {
      navigate('/home')
    }
  }, [user])

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const setWindowDimensions = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', setWindowDimensions);
    return () => {
      window.removeEventListener('resize', setWindowDimensions)
    }
  }, []);

  if (authMode === "signin") {
    if (windowWidth > 600) {
      return (
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={handleLogin}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign In</h3>
              <div className="text-center">
                <>Not registered yet? </>
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign Up
                </span>
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button className="no-account-continue" onClick={() => navigate('/home')}>Continue without an account</button>
              </div>
            </div>
          </form>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
            <GoogleButton onClick={handleGoogleSignIn} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="Auth-form-container-ss">
          <form onSubmit={handleLogin}>
            <h3 className="Auth-form-title-ss">Sign In</h3>
            <div className="email-password">
              <div>
                <div className="form-group mt-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button className="no-account-continue" onClick={() => navigate('/home')}>Continue without an account</button>
              </div>
            </div>
          </form>
          <div className="change-auth-mode">
            <GoogleButton onClick={handleGoogleSignIn} />
            Not registered yet?
            <span className="link-primary" onClick={changeAuthMode}>
              Sign Up
            </span>
            <a style={{ display: "flex", justifyContent: "center", marginTop: "1em" }} href="/terms_and_conditions">Terms and Conditions</a>
          </div>
        </div>
      )
    }
  }
  if (authMode === "signup") {
    if (windowWidth > 600) {
      return (
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={handleRegister}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Register</h3>
              <div className="text-center">
                Already registered?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign In
                </span>
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Display Name</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  placeholder="e.g Jane Doe"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
            <GoogleButton onClick={handleGoogleSignIn} />
          </div>
          <a style={{ display: "flex", justifyContent: "center", marginTop: "1em" }} href="/terms_and_conditions">Terms and Conditions</a>
        </div>
      )
    } else {
      return (
        <div className="Auth-form-container-ss">
          <form onSubmit={handleRegister}>
            <h3 className="Auth-form-title-ss">Register</h3>
            <div className="email-password">
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Display Name</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  placeholder="e.g Jane Doe"
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
          <div className="change-auth-mode">
            <GoogleButton onClick={handleGoogleSignIn} />
            Already registered?
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
            <a style={{ display: "flex", justifyContent: "center", marginTop: "1em" }} href="/terms_and_conditions">Terms and Conditions</a>
          </div>
        </div>
      )
    }
  }
}

export default Login;