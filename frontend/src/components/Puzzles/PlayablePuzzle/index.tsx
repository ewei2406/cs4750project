import { PuzzleData } from "@/util/types";
import PlayableMini from "./PlayableMini";
import PlayableConnections from "./PlayableConnections";

const PlayablePuzzle = ({
	puzzleData,
	puzzleId,
}: {
	puzzleData: PuzzleData;
	puzzleId: number;
}) => {
	switch (puzzleData.type) {
		case "mini":
			return <PlayableMini puzzleData={puzzleData} puzzleId={puzzleId} />;
		case "connections":
			return (
				<PlayableConnections puzzleData={puzzleData} puzzleId={puzzleId} />
			);
		default:
			return <div>Unknown puzzle type!</div>;
	}
};

export default PlayablePuzzle;
