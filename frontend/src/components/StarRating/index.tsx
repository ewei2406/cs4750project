import { ratePuzzle } from "@/hooks/usePuzzle";

const StarRating = ({
	puzzleId,
	ratingCt,
	ratingAvg,
}: {
	puzzleId: number;
	ratingCt?: number;
	ratingAvg: number | null;
}) => {
	if (ratingAvg !== null)
		return (
			<div
				onClick={() => ratePuzzle(puzzleId)}
				style={{
					display: "flex",
					cursor: "pointer",
					gap: "5px",
					alignItems: "center",
					fontSize: 12,
				}}
			>
				<div style={{ position: "relative" }}>
					<div style={{ opacity: 0.4, filter: "grayscale(100%)" }}>
						⭐⭐⭐⭐⭐
					</div>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: `${Math.round(((ratingAvg ?? 0) / 5) * 100)}%`,
							overflow: "hidden",
						}}
					>
						⭐⭐⭐⭐⭐
					</div>
				</div>
				{ratingCt && <div>({ratingCt})</div>}
			</div>
		);

	return (
		<div
			onClick={() => ratePuzzle(puzzleId)}
			style={{
				color: "gray",
				cursor: "pointer",
				fontSize: 12,
			}}
		>
			No Ratings
		</div>
	);
};

export default StarRating;
