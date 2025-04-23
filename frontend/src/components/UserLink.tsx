import { Link } from "react-router";
import { FaUser } from "react-icons/fa";

const UserLink = ({
	username,
	userId,
}: {
	username: string;
	userId: number;
}) => {
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
				{username}
			</Link>
		</div>
	);
};

export default UserLink;
