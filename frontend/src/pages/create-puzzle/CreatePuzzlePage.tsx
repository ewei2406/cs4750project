import Header from "@/components/Header";
import { Link } from "react-router";

const CreatePuzzlePage = () => {
	return (
		<div>
			<Header text="Create a Puzzle" />
			Select a puzzle type to create:
			<br />
			<br />
			<Link to="/create-puzzle/mini">Mini</Link>
			<div>
				The "mini" is a small, 5x5 square word puzzle where you fill in words
				based on given clues. Each clue corresponds to a row ("across") or
				column ("down"), and the answer fits into the grid. The goal is to fill
				in all the correct words, using logic, vocabulary, and wordplay. Because
				it's small, it usually takes just a few minutes to finish, making it a
				quick and fun mental exercise. Some people even try to solve it as fast
				as possible for an extra challenge.
			</div>
			<br />
			<Link to="/create-puzzle/connections">Connections</Link>
			<div>
				The "connections" puzzle is a fun and challenging word game where you
				are given a grid of words, and your task is to find the connections
				between them. The goal is to identify groups of words that share a
				common theme or category. For example, you might have a grid with words
				like "apple," "banana," "carrot," and "broccoli," and the connection
				would be "food." It's a great way to test your vocabulary and lateral
				thinking skills!
			</div>
		</div>
	);
};

export default CreatePuzzlePage;
