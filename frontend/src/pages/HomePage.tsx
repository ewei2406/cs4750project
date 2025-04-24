import Header from "@/components/Header";
import PuzzleTable from "../components/Tables/PuzzleTable";
import { FcRating } from "react-icons/fc";  
import { GrTrophy } from "react-icons/gr";
import { IoIosTimer } from "react-icons/io";

const HomePage = () => {

	document.title = "Puzzle Party";

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
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Header text="Recent Puzzles" />
					<IoIosTimer style={{ fontSize: "2rem", color: "#7393B3" }} />
				</div>
				
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
				{/* Header with the FcRating icon */}
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Header text="Highest Rated Puzzles" />
					<GrTrophy style={{ fontSize: "2rem", color: "#FFBF00" }} />
				</div>
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
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Header text="Most Played Puzzles" />
					<FcRating style={{ fontSize: "2rem", color: "#4caf50" }} />
				</div>
				<PuzzleTable endpoint="puzzles/most-played" queryKey={["puzzles", "most-played"]} />
			</div>
		</div>
	);
};

export default HomePage;
