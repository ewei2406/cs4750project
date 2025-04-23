import AttemptsTable from "@/components/AttemptsTable";
import Header from "@/components/Header";
import PuzzleTable from "@/components/PuzzleTable";
import RatingsTable from "@/components/RatingsTable";
import { UserStatsRow } from "@/components/UserTable";
import { useGet } from "@/hooks/useGet";
import { UserStats } from "@/util/types";
import { useParams } from "react-router-dom";

const UserPage = () => {
	const { userId } = useParams();

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

	return (
		<div>
			<Header
				text={
					`User: ${dataResult.value.username}` +
					(dataResult.value.isAdmin ? " (Admin)" : "")
				}
			/>
			id: {dataResult.value.userId}
			<Header text="User Stats" />
			<div style={{ border: "1px solid lightgray", borderRadius: 5 }}>
				<UserStatsRow userStats={dataResult.value} />
			</div>
			<Header text="Created Puzzles" />
			<PuzzleTable
				endpoint={`users/${dataResult.value.userId}/puzzles`}
				queryKey={["users", dataResult.value.userId.toString(), "puzzles"]}
			/>
			<Header text="Ratings" />
			<RatingsTable
				endpoint={`users/${dataResult.value.userId}/ratings`}
				queryKey={["users", dataResult.value.userId.toString(), "ratings"]}
			/>
			<Header text="Attempts" />
			<AttemptsTable
				endpoint={`users/${dataResult.value.userId}/attempts`}
				queryKey={["users", dataResult.value.userId.toString(), "attempts"]}
			/>
		</div>
	);
};

export default UserPage;
