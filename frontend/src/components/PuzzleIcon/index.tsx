import { Puzzle } from "@/util/types"
import { MdOutlineGrid4X4 } from "react-icons/md";
import { PiSquaresFourFill } from "react-icons/pi";
import type { ElementType } from "react";

const MdIcon = MdOutlineGrid4X4 as ElementType;
const PiIcon = PiSquaresFourFill as ElementType;

const PuzzleIcon = ({ puzzleType }: { puzzleType: Puzzle['puzzleType'] }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: "gray",
            fontSize: '0.8em'
        }}>
            {puzzleType === "mini" && <MdIcon size={20} />}
            {puzzleType === "connections" && <PiIcon size={20} />}
            {puzzleType}
        </div>
    );
};

export default PuzzleIcon;
