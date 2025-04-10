import { Puzzle } from "@/util/types";
import Button from "../Button";
import { PUZZLE_TYPE_COLORS } from "@/util/constants";
import PuzzleIcon from "../PuzzleIcon";
import { formatDateAsYYYYMMDD } from "@/util/date";

const PuzzleRow = ({ puzzle }: { puzzle: Puzzle }) => {
    return <div style={{
        background: "white",
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "1fr 3fr 1fr 1fr"
    }}>
        <PuzzleIcon puzzleType={puzzle.puzzleType} />
        <div>
            <span style={{ fontWeight: 800 }}>{puzzle.puzzleName}</span>
            <span style={{ color: 'gray', fontSize: "0.9em" }}> by {puzzle.createdUsername}</span>
            <br />
            <span style={{ color: 'gray', fontSize: '0.85em' }}>Updated {formatDateAsYYYYMMDD(puzzle.updatedAt)}</span>
        </div>
        <div style={{ fontSize: "0.9em" }}>
            <span style={{ color: 'gray' }}>
                {puzzle.ratingCt > 0
                    ? `⭐ ${puzzle.ratingAvg?.toFixed(1)} (${puzzle.ratingCt})`
                    : `No ratings`}
            </span>
            <br />
            <span style={{ color: 'gray' }}>
                {puzzle.solvedCt === 0 ? "No solves" : puzzle.solvedCt === 1 ? "1 solve" : `${puzzle.solvedCt} solves`}
            </span>
        </div>
        <Button backgroundColor={PUZZLE_TYPE_COLORS[puzzle.puzzleType]} text="Play" onClick={() => { }} />
    </div>
}

const PuzzleTable = ({ puzzles }: { puzzles: Puzzle[] }) => {
    return <div style={{
        display: 'flex',
        flexDirection: "column",
        gap: 15,
        width: 700,
        margin: "0 auto"
    }}>
        {puzzles.map((puzzle) => (
            <PuzzleRow key={puzzle.puzzleId} puzzle={puzzle} />
        ))}
    </div>
}

export default PuzzleTable