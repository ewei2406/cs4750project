export type Puzzle = {
	puzzleId: number;
	puzzleName: string;
	puzzleType: "mini" | "connections";
	createdUsername: string;
	createdUserId: number;
	ratingCt: number;
	ratingAvg: number | null;
	updatedAt: string;
	solvedCt: number;
};

export type PuzzleData =
	| {
			type: "mini";
			data: {
				solution: string;
				across1: string;
				across2: string;
				across3: string;
				across4: string;
				across5: string;
				down1: string;
				down2: string;
				down3: string;
				down4: string;
				down5: string;
			};
	  }
	| {
			type: "connections";
			data: {
				solution: string;
				category1: string;
				category2: string;
				category3: string;
				category4: string;
			};
	  };

export type PuzzleWithData = Puzzle & {
	puzzleData: PuzzleData;
};

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
	duration: number;
	updatedAt: string;
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
