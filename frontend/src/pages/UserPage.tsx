import AttemptsTable from "@/components/Tables/AttemptsTable";
import Subheading from "@/components/Subheading";
import PuzzleTable from "@/components/Tables/PuzzleTable";
import RatingsTable from "@/components/Tables/RatingsTable";
import { UserStatsRow } from "@/components/Tables/UserTable";
import { useGet } from "@/hooks/useGet";
import { UserStats } from "@/util/types";
import { useParams } from "react-router-dom";
import { authStore, useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";

import { FaUserCircle } from "react-icons/fa";
import { MdLeaderboard, MdAssignment, MdRateReview } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

const UserPage = () => {
	const { userId } = useParams();
	const user = useAuth();

	const { dataResult } = useGet<UserStats>({
		path: `users/${userId}/stats`,
		queryKey: ["users", userId ?? ""],
		disabled: !userId,
	});

	if (dataResult.variant === "loading") {
		return <div>Loading user...</div>;
	}

	if (dataResult.variant === "error") {
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error occurred."}</div>
		);
	}

	const isOwnPage = user.type === "user" && user.userId === dataResult.value.userId;

	return (
		<div style={{ padding: 20 }}>
			{/* User Info Header */}
			<div
				style={{
					backgroundColor: "#f0f8ff",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Subheading
						text={
							`User: ${dataResult.value.username}` +
							(dataResult.value.isAdmin ? " (Admin)" : "")
						}
					/>
					<FaUserCircle style={{ fontSize: "1.5rem", color: "#4682B4" }} />
				</div>
				<div style={{ marginTop: 8 }}>User ID: {dataResult.value.userId}</div>
			</div>

			{/* User Stats */}
			<div
				style={{
					backgroundColor: "#f5fff0",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Subheading text="User Stats" />
					<MdLeaderboard style={{ fontSize: "1.5rem", color: "#4caf50" }} />
				</div>
				<UserStatsRow userStats={dataResult.value} />
			</div>

			{/* Created Puzzles */}
			<div
				style={{
					backgroundColor: "#fff0f5",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Subheading text="Created Puzzles" />
					<MdAssignment style={{ fontSize: "1.5rem", color: "#ff69b4" }} />
				</div>
				<PuzzleTable
					endpoint={`users/${dataResult.value.userId}/puzzles`}
					queryKey={["users", dataResult.value.userId.toString(), "puzzles"]}
				/>
			</div>

			{/* Ratings */}
			<div
				style={{
					backgroundColor: "#f0fff5",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Subheading text="Ratings" />
					<MdRateReview style={{ fontSize: "1.5rem", color: "#228B22" }} />
				</div>
				<RatingsTable
					endpoint={`users/${dataResult.value.userId}/ratings`}
					queryKey={["users", dataResult.value.userId.toString(), "ratings"]}
				/>
			</div>

			{/* Attempts */}
			<div
				style={{
					backgroundColor: "#fffaf0",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Subheading text="Attempts" />
					<FaPencilAlt style={{ fontSize: "1.5rem", color: "#E49B0F" }} />
				</div>
				<AttemptsTable
					endpoint={`users/${dataResult.value.userId}/attempts`}
					queryKey={["users", dataResult.value.userId.toString(), "attempts"]}
				/>
			</div>

			{/* Logout Button */}
			{isOwnPage && (
				<div style={{ marginTop: 30 }}>
					<Button text="LOG OUT" onClick={authStore.logout} />
				</div>
			)}
		</div>
	);
};

export default UserPage;
