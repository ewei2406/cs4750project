import Header from "@/components/Header";
import Paragraph from "@/components/Paragraph";
import { Link } from "react-router";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { PiSquaresFourFill } from "react-icons/pi";

const boxStyle = {
	flex: 1,
	textAlign: "center" as const,
	border: "1px solid #ccc",
	borderRadius: "16px",
	padding: "20px",
	boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
	cursor: "pointer",
	textDecoration: "none",
	color: "inherit",
};

const CreatePuzzlePage = () => {
	return (
		<div style={{ padding: "20px" }}>
			<Header text="Create a Puzzle" />
			<Paragraph text="Select a puzzle type to create" />
			<div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
				{/* Column 1: Mini */}
				<Link to="/create-puzzle/mini" style={boxStyle}>
					<MdOutlineGrid4X4 size={100} style={{ marginBottom: "10px" }} />
					<div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px", color: "#007bff" }}>
						Mini
					</div>
					<Paragraph text="The 'mini' is a small, 5x5 square word puzzle where you fill in words
						based on given clues. Each clue corresponds to a row ('across') or
						column ('down'), and the answer fits into the grid. The goal is to fill
						in all the correct words, using logic, vocabulary, and wordplay. Because
						it's small, it usually takes just a few minutes to finish, making it a
						quick and fun mental exercise. Some people even try to solve it as fast
						as possible for an extra challenge." />
				</Link>

				{/* Column 2: Connections */}
				<Link to="/create-puzzle/connections" style={boxStyle}>
					<PiSquaresFourFill size={100} style={{ marginBottom: "10px" }} />
					<div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px", color: "#28a745" }}>
						Connections
					</div>
					<Paragraph text="The 'connections' puzzle is a fun and challenging word game where you
						are given a grid of words, and your task is to find the connections
						between them. The goal is to identify groups of words that share a
						common theme or category. For example, you might have a grid with words
						like 'apple,' 'banana,' 'carrot,' and 'broccoli,' and the connection
						would be 'food.' It's a great way to test your vocabulary and lateral
						thinking skills!" />
				</Link>
			</div>
		</div>
	);
};

export default CreatePuzzlePage;
