export interface Puzzle {
	puzzleId: number;
	puzzleName: string;
	puzzleType: "mini" | "connections";
	createdUsername: string;
	createdUserId: number;
	ratingCt: number;
	ratingAvg: number | null;
	updatedAt: string;
	solvedCt: number;
}

export type Rating = {
	userId: number;
	username: string;
	puzzleId: number;
	puzzleName: string;
	puzzleType: Puzzle["puzzleType"];
	rating: number;
	updatedAt: string;
};

export type Attempt = {
	userId: number;
	username: string;
	puzzleId: number;
	puzzleName: string;
	puzzleType: Puzzle["puzzleType"];
	attempt: string;
	attemptNum: number;
	score: number;
	updatedAt: string;
	solved: boolean;
	message: string;
};

export type UserStats = {
	userId: number;
	username: string;
	isAdmin: boolean;
	puzzleCt: number;
	solvedCt: number;
	ratingCt: number;
};

export type Result<V, E> =
	| {
			variant: "ok";
			value: V;
	  }
	| {
			variant: "error";
			error: E;
	  };

export type AResult<V, E> = Promise<Result<V, E>>;
