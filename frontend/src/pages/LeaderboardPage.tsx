import Header from "@/components/Header";
import UserTable from "@/components/Tables/UserTable";
import { GrTrophy } from "react-icons/gr";

const LeaderboardPage = () => {
	return (
		<div style={{ padding: 20 }}>
			{/* Leaderboard Section */}
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
					<Header text="Leaderboard" />
					<GrTrophy style={{ fontSize: "2rem", color: "#DAA520" }} />
				</div>
				<UserTable />
			</div>
		</div>
	);
};

export default LeaderboardPage;
