import Header from "@/components/Header";
import PuzzleTable from "../components/PuzzleTable";

const HomePage = () => {
	return (
		<div>
			<Header text="Recent Puzzles" />
			<PuzzleTable endpoint="puzzles/recent" />

			<Header text="Highest Rated Puzzles" />
			<PuzzleTable endpoint="puzzles/popular" />

			<Header text="Most Played Puzzles" />
			<PuzzleTable endpoint="puzzles/most-played" />
		</div>
	);
};

export default HomePage;
