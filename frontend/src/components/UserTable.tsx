import { useGet } from "@/hooks/useGet";
import { UserStats } from "@/util/types";
import UserLink from "./UserLink";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const UserStatsRow = ({ userStats }: { userStats: UserStats }) => (
	<div
		style={{
			display: "grid",
			gridTemplateColumns: "3fr 2fr 2fr 2fr",
			gap: 5,
			padding: 5,
		}}
	>
		<UserLink userId={userStats.userId} username={userStats.username} />
		<div>
			{userStats.solvedCt}{" "}
			{userStats.solvedCt === 1 ? "puzzle solved" : "puzzles solved"}
		</div>
		<div>
			{userStats.puzzleCt}{" "}
			{userStats.puzzleCt === 1 ? "puzzle created" : "puzzles created"}
		</div>
		<div>
			{userStats.ratingCt}{" "}
			{userStats.ratingCt === 1 ? "puzzle rated" : "puzzles rated"}
		</div>
	</div>
);

const UserTable = () => {
	const user = useAuth();

	const [sortColumn, setSortColumn] = useState<
		"solved_ct" | "puzzle_ct" | "rating_ct"
	>("solved_ct");

	const { dataResult } = useGet<UserStats[]>({
		path: `users/stats?order_by=${sortColumn}`,
		queryKey: ["users", sortColumn],
	});

	if (dataResult.variant === "loading") {
		return <div>Loading users...</div>;
	}

	if (dataResult.variant === "error") {
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error occurred."}</div>
		);
	}

	const myPosition =
		user.type !== "guest"
			? dataResult.value.findIndex((u) => u.userId === user.userId) + 1
			: -1;

	return (
		<div>
			<div>
				{user.type !== "guest" && (
					<>My Rank: {myPosition > 0 ? myPosition : "Unranked"}</>
				)}
				{user.type === "guest" && "My Rank: Log in to see your rank!"}
			</div>
			<div style={{ border: "1px solid lightgray", borderRadius: 5 }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "3fr 2fr 2fr 2fr",
						gap: 5,
						fontWeight: 800,
						padding: 5,
						borderBottom: "1px solid lightgray",
					}}
				>
					<div></div>
					<div
						onClick={() => {
							setSortColumn("solved_ct");
						}}
						style={{
							cursor: "pointer",
							textDecoration: sortColumn === "solved_ct" ? "underline" : "none",
						}}
					>
						Puzzles Solved
					</div>
					<div
						onClick={() => {
							setSortColumn("puzzle_ct");
						}}
						style={{
							cursor: "pointer",
							textDecoration: sortColumn === "puzzle_ct" ? "underline" : "none",
						}}
					>
						Puzzles Created
					</div>
					<div
						onClick={() => {
							setSortColumn("rating_ct");
						}}
						style={{
							cursor: "pointer",
							textDecoration: sortColumn === "rating_ct" ? "underline" : "none",
						}}
					>
						Puzzles Rated
					</div>
				</div>
				<div>
					{dataResult.value.map((user) => (
						<UserStatsRow key={user.userId} userStats={user} />
					))}
				</div>
			</div>
		</div>
	);
};

export default UserTable;
