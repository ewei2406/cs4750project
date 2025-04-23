import { AResult, PuzzleData, Rating } from "@/util/types";
import { authStore } from "./useAuth";
import { fetchWithResult } from "./useGet";
import { queryClient } from "@/App";

export const deletePuzzle = async (puzzleId: number) => {
	if (!confirm("Are you sure you want to delete this puzzle?")) {
		return;
	}

	const result = await fetchWithResult<void>(`puzzles/${puzzleId}`, {
		method: "DELETE",
	});
	queryClient.invalidateQueries({
		queryKey: ["puzzles"],
		exact: false,
	});
	if (result.variant === "error") {
		alert(result.error.detail ?? "Unexpected error occurred.");
	} else {
		alert("Puzzle deleted successfully.");
	}
};

export const ratePuzzle = async (puzzleId: number) => {
	const user = authStore.getUser();
	if (user.type === "guest") {
		alert("Please log in to rate puzzles.");
		return;
	}

	const prevRatingResult = await fetchWithResult<Rating>(
		`ratings/?puzzle_id=${puzzleId}`
	);

	const rateNum = prompt(
		prevRatingResult.variant === "ok"
			? `My previous rating: ${prevRatingResult.value.rating}\nEnter a new rating (1-5) for the puzzle, or type "remove" to remove my rating:`
			: "Enter a rating for the puzzle (1-5):"
	);
	if (rateNum === null) return;

	const remove = rateNum.toLowerCase() === "remove";
	if (remove) {
		await fetchWithResult<Rating>(`ratings/?puzzle_id=${puzzleId}`, {
			method: "DELETE",
		});
		queryClient.invalidateQueries();
		alert("Rating removed.");
		return;
	}

	const ratingNum = parseInt(rateNum);
	if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
		alert("Please enter a valid rating between 1 and 5.");
		return;
	}

	const result = await fetchWithResult<Rating>(
		`ratings/?puzzle_id=${puzzleId}&rating=${rateNum}`,
		{
			method: "POST",
		}
	);

	if (result.variant === "error") {
		alert(result.error.detail ?? "Unexpected error occurred.");
		return;
	}
	queryClient.invalidateQueries();

	alert("Rating submitted successfully.");
};

export const solvePuzzle = async (puzzleId: number, duration: number) => {
	const user = authStore.getUser();
	if (user.type === "guest") {
		alert("Log in to save your results to the leaderboard!");
		return;
	}

	const result = await fetchWithResult<void>(`puzzles/${puzzleId}/attempt`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			duration,
		}),
	});

	queryClient.invalidateQueries();

	if (result.variant === "error") {
		alert(result.error.detail ?? "Unexpected error occurred.");
	}
};

export const updatePuzzle = async (
	puzzleId: number,
	puzzleName: string,
	puzzleData: PuzzleData
) => {
	const user = authStore.getUser();
	if (user.type === "guest") {
		alert("Log in to update puzzles!");
		return;
	}

	const result = await fetchWithResult<void>(`puzzles/${puzzleId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			puzzleName,
			puzzleData,
		}),
	});

	queryClient.invalidateQueries({
		queryKey: ["puzzles"],
		exact: false,
	});

	if (result.variant === "error") {
		alert(result.error.detail ?? "Unexpected error occurred.");
	} else {
		alert("Puzzle updated successfully.");
	}
};

export const createPuzzle = async (
	puzzleType: string
): AResult<number, void> => {
	const user = authStore.getUser();
	if (user.type === "guest") {
		alert("Log in to create puzzles!");
		return { variant: "error", error: undefined };
	}

	const puzzleName = prompt("Enter a name for the new puzzle:");
	if (puzzleName === null) return { variant: "error", error: undefined };

	const result = await fetchWithResult<number>(`puzzles/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			puzzleName,
			puzzleType,
		}),
	});

	if (result.variant === "error") {
		alert(result.error.detail ?? "Unexpected error occurred.");
		return { variant: "error", error: undefined };
	} else {
		alert("Puzzle created successfully.");
	}

	queryClient.invalidateQueries();

	return {
		variant: "ok",
		value: result.value,
	};
};
