import { authStore, useAuth } from "@/hooks/useAuth";
import Button from "../Button";

const AuthWidget = () => {
	const user = useAuth();

	if (user.type === "guest") {
		return (
			<div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
				<div>Playing as Guest</div>
				<Button text="Log in" onClick={authStore.login} size="sm" />
				<Button text="Sign up" onClick={authStore.signup} size="sm" />
			</div>
		);
	}

	// Signed in
	return (
		<div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
			<div>{user.username}</div>
			{user.isAdmin && <div style={{ color: "red" }}>(Admin)</div>}
			<Button size="sm" text="Log out" onClick={authStore.logout} />
		</div>
	);
};

export default AuthWidget;
