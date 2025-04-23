import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const UserLink = ({
	username,
	userId,
}: {
	username: string;
	userId: number;
}) => {
	const user = useAuth();
	const isSelf = user.type === "user" && user.userId === userId;
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 8,
				fontSize: 16,
				padding: "4px 8px",
				borderRadius: "4px",
				cursor: "pointer",
				backgroundColor: isHovered ? "#f0f0f0" : "transparent",
				transition: "background-color 0.2s ease",
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<FaUser size={14} />
			<Link
				to={`/users/${userId}`}
				style={{
					color: "inherit",
					textDecoration: "none",
					fontWeight: 500,
				}}
			>
				{username} {isSelf && "(Me)"}
			</Link>
		</div>
	);
};

export default UserLink;
