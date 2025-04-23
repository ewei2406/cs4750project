import { authStore, useAuth } from "@/hooks/useAuth";
import Button from "../Button";
import UserLink from "../UserLink";

const AuthWidget = () => {
	const user = useAuth();

	if (user.type === "guest") {
		return (
			<div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
				{/* <div>Playing as Guest</div> */}
				<Button text="LOG IN" onClick={authStore.login} />
				<Button text="SIGN UP" onClick={authStore.signup} />
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
