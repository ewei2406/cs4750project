import re
from typing import Any


def match_mini(attempt: str, solution: str) -> tuple[bool, int, Any]:
    max_score = 25
    score = 0
    message = {"type": "mini"}
    if len(attempt) != len(solution):
        raise ValueError("Invalid attempt length.")
    wrong = 0
    for i in range(len(attempt)):
        if solution[i] == " ":
            score += 1
        elif attempt[i] == solution[i]:
            score += 1
        else:
            wrong += 1
    message["wrong"] = wrong
    solved = wrong == 0
    score = int(100 * score / max_score)

    return solved, score, message


def match_connections(
    attempt: str, solution: str, categories: list[str]
) -> tuple[bool, int, Any]:
    max_score = 4
    message = {"type": "connections"}
    score = 0

    solution = solution[:-1].split(";")
    solution = [sorted(s.split(",")) + [categories[i]] for i, s in enumerate(solution)]
    solution.sort(key=lambda x: x[0])

    print(attempt)
    if re.fullmatch(r"^(?:([^;,]+,){3}[^;,]+;){1,4}$", attempt) is None:
        raise ValueError("Invalid attempt format.")

    attempt = attempt[:-1].split(";")
    attempt = [sorted(a.split(",")) for a in attempt]
    attempt.sort(key=lambda x: x[0])
    message["categories"] = {}

    correct = 0
    for attempt_group in attempt:
        for solution_group in solution:
            if solution_group[:-1] == attempt_group:
                score += 1
                correct += 1
                message["categories"][solution_group[-1]] = attempt_group
                break

    score = int(100 * score / max_score)
    solved = correct == 4

    return solved, score, message
