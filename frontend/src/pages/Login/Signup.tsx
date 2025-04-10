import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(await response.json())
      if (!response.ok) throw new Error("Signup failed");

      // auto-login after signup
      const encoded = btoa(`${username}:${password}`);
      localStorage.setItem("authToken", encoded);
      navigate("/");
    } catch {
      setError("Signup failed. Try a different username.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Signup;
