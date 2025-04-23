import { useAuth } from "@/hooks/useAuth";
import AuthWidget from "./AuthWidget";
import { useNavigate } from "react-router-dom";
import Title from "@/components/Title";

const Navbar = () => {
	const user = useAuth();
	const navigate = useNavigate();

	const linkStyle: React.CSSProperties = {
		padding: "4px 8px",
		cursor: "pointer",
		borderRadius: "4px",
		transition: "background-color 0.2s ease",
	};

	const hoverStyle = {
		backgroundColor: "#f0f0f0",
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				borderBottom: "1px solid black",
				padding: "10px",
			}}
		>
			<div style={{ fontSize: 35, fontWeight: 500, marginRight: 20, fontFamily: "'Jacquard 24', serif" }}>
				Puzzle Party
			</div>

			{/* Push nav links to the right */}
			<div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
				<TextLink label="Home" onClick={() => navigate("/")} />
				<TextLink label="Leaderboard" onClick={() => navigate("/leaderboard")} />
				{user.type === "user" && (
					<>
						<TextLink label="My Page" onClick={() => navigate(`/users/${user.userId}`)} />
						<TextLink label="Create Puzzle" onClick={() => navigate("/create-puzzle")} />
					</>
				)}
				<AuthWidget />
			</div>
		</div>
	);
};

// A mini component for styling nav links as text
const TextLink = ({ label, onClick }: { label: string; onClick: () => void }) => {
	return (
		<div
			onClick={onClick}
			style={{
				padding: "4px 8px",
				cursor: "pointer",
				borderRadius: "4px",
				transition: "background-color 0.2s ease",
			}}
			onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
			onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
		>
			{label}
		</div>
	);
};

export default Navbar;
