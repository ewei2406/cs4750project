import Button from "@/components/Button";
import Header from "@/components/Header";
import { createPuzzle } from "@/hooks/usePuzzle";
import { Link, useNavigate } from "react-router";

const CreatePuzzlePage = () => {
	const navigate = useNavigate();

	const handleCreate = (type: string) => async () => {
		const res = await createPuzzle(type);
		if (res.variant === "ok") navigate(`/puzzles/${res.value}/edit`);
	};

	return (
		<div>
			<Header text="Create a Puzzle" />
			Select a puzzle type to create:
			<br />
			<br />
			<Button onClick={handleCreate("mini")} text="Create Mini" />
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
			<Button onClick={handleCreate("connections")} text="Create Connections" />
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
