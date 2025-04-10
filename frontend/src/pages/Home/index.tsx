import Button from "../../components/Button";
import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const [view, setView] = useState("login");
	const navigate = useNavigate();

	return (
		<div className="home-container">
			
			<h1 className="title">Puzzle Party</h1>
			<p className="subtitle">Compete. Create. Climb.</p>

			<div className="button-group">
				<Button
					backgroundColor="#008000"
					text="Browse Games"
					onClick={() => navigate("/Browse")}
				/>
				<Button
					backgroundColor="#008000"
					text="View Leaderboard"
					onClick={() => navigate("/Browse")}
				/>
				<Button
					backgroundColor="#008000"
					text="My Puzzles"
					onClick={() => navigate("/Browse")}
				/>
			</div>

			
		</div>
	);
};

export default Home;
