import { Puzzle } from "@/util/types";
import { MdOutlineGrid4X4 } from "react-icons/md";
import { PiSquaresFourFill } from "react-icons/pi";
import type { ElementType } from "react";

const MdIcon = MdOutlineGrid4X4 as ElementType;
const PiIcon = PiSquaresFourFill as ElementType;

const PuzzleIcon = ({
	puzzleType,
	size,
	iconOnly,
}: {
	puzzleType: Puzzle["puzzleType"];
	size?: number;
	iconOnly?: boolean;
}) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				color: "gray",
				fontSize: size ?? 14,
			}}
		>
			{puzzleType === "mini" && <MdIcon size={(size ?? 14) * 2} />}
			{puzzleType === "connections" && <PiIcon size={(size ?? 14) * 2} />}
			{iconOnly || puzzleType}
		</div>
	);
};

export default PuzzleIcon;
