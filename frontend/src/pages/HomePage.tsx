import Header from "@/components/Header";
import PuzzleTable from "../components/Tables/PuzzleTable";

const HomePage = () => {
	return (
		<div style={{ padding: 20 }}>
			{/* Recent Puzzles Section */}
			<div
				style={{
					backgroundColor: "#f0f8ff",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<Header text="Recent Puzzles" />
				<PuzzleTable endpoint="puzzles/recent" queryKey={["puzzles", "recent"]} />
			</div>

			{/* Highest Rated Section */}
			<div
				style={{
					backgroundColor: "#fff0f5",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<Header text="Highest Rated Puzzles" />
				<PuzzleTable endpoint="puzzles/popular" queryKey={["puzzles", "popular"]} />
			</div>

			{/* Most Played Section */}
			<div
				style={{
					backgroundColor: "#f5fff0",
					padding: 16,
					borderRadius: 12,
					marginBottom: 20,
					border: "1px solid lightgray",
				}}
			>
				<Header text="Most Played Puzzles" />
				<PuzzleTable endpoint="puzzles/most-played" queryKey={["puzzles", "most-played"]} />
			</div>
		</div>
	);
};

export default HomePage;
