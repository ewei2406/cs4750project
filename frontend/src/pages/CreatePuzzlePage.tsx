import Header from "@/components/Header";
import Paragraph from "@/components/Paragraph";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { PiSquaresFourFill } from "react-icons/pi";
import { createPuzzle } from "@/hooks/usePuzzle";
import { useNavigate } from "react-router";

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

const miniBoxStyle = {
	...boxStyle,
	backgroundColor: "#f0f8ff", // light blue
};

const connectionsBoxStyle = {
	...boxStyle,
	backgroundColor: "#f5fff0", // light green
};

const CreatePuzzlePage = () => {
	const navigate = useNavigate();

	const handleCreate = (type: string) => async () => {
		const res = await createPuzzle(type);
		if (res.variant === "ok") navigate(`/puzzles/${res.value}/edit`);
	};

	return (
		<div style={{ padding: "20px" }}>
			<Header text="Create a Puzzle" />
			<Paragraph text="Select a puzzle type to create" />
			<div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
				{/* Mini Puzzle Box */}
				<div style={miniBoxStyle} onClick={handleCreate("mini")}>
					<MdOutlineGrid4X4 size={100} style={{ marginBottom: "10px" }} />
					<div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px", color: "#007bff", fontFamily: "'Libre Franklin', serif" }}>
						Mini
					</div>
					<Paragraph text="The mini is a quick 5x5 crossword where each clue fits into a row or column. It's a fun, fast-paced word puzzle that tests your logic and vocabulary." />
				</div>

				{/* Connections Puzzle Box */}
				<div style={connectionsBoxStyle} onClick={handleCreate("connections")}>
					<PiSquaresFourFill size={100} style={{ marginBottom: "10px" }} />
					<div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px", color: "#28a745", fontFamily: "'Libre Franklin', serif" }}>
						Connections
					</div>
					<Paragraph text="Connections is a word game where you group related words by theme—like finding 'apple,' 'banana,' and 'carrot' all belong to 'food.' It’s quick, clever, and great for testing word associations." />
				</div>
			</div>
		</div>
	);
};

export default CreatePuzzlePage;
