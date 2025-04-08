import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [view, setView] = useState("login");
	const navigate = useNavigate();

	return (
		<div className="home-container">
			<h1 className="title">Puzzle Party</h1>
			<p className="subtitle">Play. Compete. Climb the leaderboard.</p>

			<div className="button-group">
				<button className="play-button crossword" onClick={() => navigate("/browseCrosswords")}>Play Crossword</button>
				<button className="play-button connections" onClick={() => navigate("/browseConnections")}>Play Connections</button>
			</div>

			<div className="toggle-view">
				{view === "login" ? (
					<button onClick={() => setView("signup")} className="toggle-button">
						Don&apos;t have an account? <span>Sign up!</span>
					</button>
				) : (
					<button onClick={() => setView("login")} className="toggle-button">
						Back to <span>login</span>.
					</button>
				)}
			</div>
		</div>
	);
};

export default Login;
