import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const encoded = btoa(`${username}:${password}`);
        try {
            const response = await fetch("http://localhost:8000/users/me", {
                method: "GET",
                headers: {
                    Authorization: `Basic ${encoded}`,
                },
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const data = await response.json();
            localStorage.setItem("authToken", encoded); // save credentials for reuse
            navigate("/"); // redirect to home
        } catch {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
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
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default Login;