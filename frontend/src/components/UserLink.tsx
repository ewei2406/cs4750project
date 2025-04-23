import { Link } from "react-router";
import { FaUser } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";

const UserLink = ({
	username,
	userId,
}: {
	username: string;
	userId: number;
}) => {
	const user = useAuth();
	const isSelf = user.type === "user" && user.userId === userId;

	return (
		<div
			style={{
				display: "flex",
				gap: 5,
				fontSize: 13,
				alignItems: "center",
			}}
		>
			<FaUser size={10} />
			<Link
				style={{ color: "inherit", textDecoration: "none" }}
				to={`/users/${userId}`}
			>
				{username} {isSelf && "(Me)"}
			</Link>
		</div>
	);
};

export default UserLink;
