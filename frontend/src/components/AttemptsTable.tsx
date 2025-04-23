import { useGet } from "@/hooks/useGet";
import { Attempt, UserStats } from "@/util/types";
import Header from "./Header";
import UserLink from "./UserLink";
import { Dispatch, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PuzzleLink from "./PuzzleLink";

const AttemptRow = ({ attempt }: { attempt: Attempt }) => (
	<div
		style={{
			display: "grid",
			gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr",
			gap: 5,
			padding: 5,
		}}
	>
		<UserLink {...attempt} />
		<PuzzleLink {...attempt} />
		<div>
			{attempt.attemptNum === 0
				? "No attempts"
				: attempt.attemptNum === 1
				? "1st attempt"
				: attempt.attemptNum === 2
				? "2nd attempt"
				: attempt.attemptNum === 3
				? "3rd attempt"
				: `${attempt.attemptNum}th attempt`}
		</div>
		<div>{attempt.solved ? "Solved" : "Unsolved"}</div>
		<div>{attempt.score} points</div>
		<div>{attempt.updatedAt.slice(0, 10)}</div>
	</div>
);

const AttemptsTable = ({ endpoint }: { endpoint: string }) => {
	const { dataResult } = useGet<Attempt[]>({
		path: endpoint,
		queryKey: ["attempts", endpoint],
	});

	if (dataResult.variant === "loading") {
		return <div>Loading attempts...</div>;
	}

	if (dataResult.variant === "error") {
		return (
			<div>Error: {dataResult.error.detail ?? "Unknown error occurred."}</div>
		);
	}

	return (
		<div style={{ border: "1px solid lightgray", borderRadius: 5, width: 700 }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr",
					gap: 5,
					fontWeight: 800,
					padding: 5,
					borderBottom: "1px solid lightgray",
				}}
			>
				<div>User</div>
				<div>Puzzle</div>
				<div>Attempt #</div>
				<div>Solved?</div>
				<div>Score</div>
				<div>Updated</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 5,
				}}
			>
				{dataResult.value.map((attempt) => (
					<AttemptRow
						key={`${attempt.puzzleId}-${attempt.userId}`}
						attempt={attempt}
					/>
				))}
			</div>
		</div>
	);
};

export default AttemptsTable;
