import { PuzzleData } from "@/util/types";
import EditableMini from "./EditableMini";
import EditableConnections from "./EditableConnections";

const EditablePuzzle = (props: {
	puzzleName: string;
	puzzleData: PuzzleData;
	puzzleId: number;
}) => {
	const { puzzleData } = props;

	switch (puzzleData.type) {
		case "mini":
			return <EditableMini {...props} puzzleData={puzzleData} />;
		case "connections":
			return <EditableConnections {...props} puzzleData={puzzleData} />;
		default:
			return <div>Unknown puzzle type!</div>;
	}
};

export default EditablePuzzle;
