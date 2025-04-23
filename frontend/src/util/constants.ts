import { Puzzle } from "./types";

const PROTOCOL = window.location.protocol;

export const API_ENDPOINT_BASE =
	window.location.hostname === "localhost"
		? PROTOCOL + "//localhost:8000/"
		: "/";

export const PUZZLE_TYPE_COLORS: Record<Puzzle["puzzleType"], string> = {
	connections: "var(--connections-color)",
	mini: "var(--mini-color)",
};

export const COLOR_MAP = [
	"#F2C4DE", // Cotton candy pink
	"#AED8F2", // Baby blue
	"#F2DEA2", // Cornflower yellow
	"#D1EBD8", // Pastel green
	"#D9BCF2", // Lavender
	"#FFB6A3", // Light salmon
];
