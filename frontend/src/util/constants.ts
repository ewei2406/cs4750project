import { Puzzle } from "./types"

const PROTOCOL = window.location.protocol

export const API_ENDPOINT_BASE = window.location.hostname === "localhost" ? PROTOCOL + "//localhost:8000/" : "/"

export const PUZZLE_TYPE_COLORS: Record<Puzzle['puzzleType'], string> = {
    connections: "var(--connections-color)",
    mini: "var(--mini-color)"
}