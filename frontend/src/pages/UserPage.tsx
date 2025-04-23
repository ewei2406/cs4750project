import AttemptsTable from "@/components/AttemptsTable";
import Header from "@/components/Header";
import PuzzleTable from "@/components/PuzzleTable";
import RatingsTable from "@/components/RatingsTable";
import { UserStatsRow } from "@/components/UserTable";
import { useGet } from "@/hooks/useGet";
import { UserStats } from "@/util/types";
import { useQuery } from "@tanstack/react-query";
import { data, useParams } from "react-router-dom";

const UserPage = () => {
	const { userId } = useParams();

	const { dataResult } = useGet<UserStats>({
		path: `users/${userId}/stats`,
		queryKey: ["user", userId ?? ""],
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

	console.log(dataResult.value);

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
			<div
				style={{ width: 600, border: "1px solid lightgray", borderRadius: 5 }}
			>
				<UserStatsRow userStats={dataResult.value} />
			</div>
			<Header text="Created Puzzles" />
			<PuzzleTable endpoint={`users/${dataResult.value.userId}/puzzles`} />
			<Header text="Ratings" />
			<RatingsTable endpoint={`users/${dataResult.value.userId}/ratings`} />
			<Header text="Attempts" />
			<AttemptsTable endpoint={`users/${dataResult.value.userId}/attempts`} />
		</div>
	);
};

export default UserPage;
