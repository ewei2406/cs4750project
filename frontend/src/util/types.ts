export interface Puzzle {
    puzzleId: number;
    puzzleName: string;
    puzzleType: "mini" | "connections";
    createdUsername: string;
    ratingCt: number;
    ratingAvg: number | null;
    updatedAt: string;
    solvedCt: number;
  }