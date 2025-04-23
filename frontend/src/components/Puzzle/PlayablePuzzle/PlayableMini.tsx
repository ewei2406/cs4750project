import { PuzzleData } from "@/util/types";

const PlayableMini = ({
	puzzleData,
	puzzleId,
}: {
	puzzleData: PuzzleData & { type: "mini" };
	puzzleId: number;
}) => <div>{puzzleData.data.across1}</div>;

export default PlayableMini;
