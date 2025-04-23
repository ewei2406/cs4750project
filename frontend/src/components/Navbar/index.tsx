import { useAuth } from "@/hooks/useAuth";
import AuthWidget from "./AuthWidget";
import { NavLink } from "react-router";

const Navbar = () => {
	const user = useAuth();

	return (
		<div
			style={{
				display: "flex",
				gap: "5px",
				flexDirection: "row",
				borderBottom: "1px solid black",
				padding: "10px",
			}}
		>
			<div style={{ fontWeight: 800 }}>Puzzle Party!</div>
			<NavLink to="/">Home</NavLink>
			<NavLink to="/leaderboard">Leaderboard</NavLink>
			{user.type === "user" && (
				<NavLink to={`/users/${user.userId}`}>My Page</NavLink>
			)}
			<div style={{ marginLeft: "auto" }}></div>
			<AuthWidget />
		</div>
	);
};

export default Navbar;
