import Button from "@/components/Button";
import Timer from "@/components/Timer";
import { useMini } from "@/hooks/puzzles/useMini";
import { PuzzleData } from "@/util/types";
import { useState } from "react";

const MiniHint = ({ selected, hint }: { selected: boolean; hint: string }) => (
	<div style={{ textDecoration: selected ? "underline" : "none" }}>{hint}</div>
);

const PlayableMini = ({
	puzzleData,
	puzzleId,
}: {
	puzzleData: PuzzleData & { type: "mini" };
	puzzleId: number;
}) => {
	const [focusedIdx, setFocusedIdx] = useState<number>(-1);

	const { grid, setCharacter, hint, solved, hintLetter, getHint } = useMini(
		puzzleData,
		puzzleId
	);

	const handleChange =
		(idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
			console.log("e", e);
			const letter = e.target.value.toUpperCase().slice(-1);
			console.log("letter", letter);
			if (letter.match(/^[A-Z]$/)) {
				setCharacter(idx, letter);
			} else {
				setCharacter(idx, " ");
			}
		};

	console.log("hintLetter", hintLetter);

	return (
		<div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 5,
					alignItems: "center",
				}}
			>
				<Timer disabled={solved} />
				<div style={{ position: "relative" }}>
					<div
						style={{
							position: "relative",
							display: "grid",
							border: "1px solid black",
							gridTemplateColumns: "repeat(5, 1fr)",
							width: "max-content",
						}}
					>
						{grid.split("").map((l, i) =>
							l === "_" ? (
								<div
									key={i}
									style={{ width: 50, height: 50, backgroundColor: "black" }}
								></div>
							) : (
								<input
									type="text"
									key={`${i}`}
									value={l === " " ? "" : l}
									style={{
										textAlign: "center",
										width: 50,
										fontSize: 30,
										height: 50,
										boxSizing: "border-box",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										border: "1px solid black",
									}}
									onChange={handleChange(i)}
									onFocus={() => setFocusedIdx(i)}
								/>
							)
						)}
						{hintLetter && (
							<div
								style={{
									pointerEvents: "none",
									color: "darkgoldenrod",
									fontStyle: "italic",
									fontSize: 13,
									width: 50,
									height: 50,
									display: "flex",
									justifyContent: "center",
									alignItems: "end",
									position: "absolute",
									left: (hintLetter.idx % 5) * 50,
									top: Math.floor(hintLetter.idx / 5) * 50,
								}}
							>
								Hint: {hintLetter.letter}
							</div>
						)}
					</div>
					<div
						style={{
							pointerEvents: "none",
							display: "grid",
							gridTemplateColumns: "repeat(5, 1fr)",
							position: "absolute",
							top: 0,
							left: 4,
							width: "100%",
							color: "gray",
						}}
					>
						<div>1</div>
						<div>2</div>
						<div>3</div>
						<div>4</div>
						<div>5</div>
					</div>
					<div
						style={{
							pointerEvents: "none",
							display: "flex",
							position: "absolute",
							top: 52,
							left: 4,
							color: "gray",
							flexDirection: "column",
						}}
					>
						<div style={{ height: 50 }}>2</div>
						<div style={{ height: 50 }}>3</div>
						<div style={{ height: 50 }}>4</div>
						<div style={{ height: 50 }}>5</div>
					</div>
				</div>
				<Button text="Get Hint" onClick={getHint} disabled={solved} />
				<div>{hint}</div>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
				<div style={{ fontWeight: 800 }}>Across</div>
				<MiniHint
					hint={"1. " + puzzleData.data.across1}
					selected={[0, 1, 2, 3, 4].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"2. " + puzzleData.data.across2}
					selected={[5, 6, 7, 8, 9].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"3. " + puzzleData.data.across3}
					selected={[10, 11, 12, 13, 14].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"4. " + puzzleData.data.across4}
					selected={[15, 16, 17, 18, 19].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"5. " + puzzleData.data.across5}
					selected={[20, 21, 22, 23, 24].includes(focusedIdx)}
				/>

				<div style={{ fontWeight: 800, marginTop: 10 }}>Down</div>
				<MiniHint
					hint={"1. " + puzzleData.data.down1}
					selected={[0, 5, 10, 15, 20].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"2. " + puzzleData.data.down2}
					selected={[1, 6, 11, 16, 21].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"3. " + puzzleData.data.down3}
					selected={[2, 7, 12, 17, 22].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"4. " + puzzleData.data.down4}
					selected={[3, 8, 13, 18, 23].includes(focusedIdx)}
				/>
				<MiniHint
					hint={"5. " + puzzleData.data.down5}
					selected={[4, 9, 14, 19, 24].includes(focusedIdx)}
				/>
			</div>
		</div>
	);
};

export default PlayableMini;
