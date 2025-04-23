import { authStore, useAuth } from "@/hooks/useAuth";
import Button from "../Button";
import UserLink from "../UserLink";

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
			<UserLink {...user} />
			{user.isAdmin && <div style={{ color: "red" }}>(Admin)</div>}
			
		</div>
	);
};

export default AuthWidget;
