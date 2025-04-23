import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import WithNavbar from "./components/Layout/WithNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import UserPage from "./pages/UserPage";
import CreatePuzzlePage from "./pages/create-puzzle/CreatePuzzlePage";
import PuzzlePage from "./pages/PuzzlePage";

export const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<WithNavbar />}>
						<Route index element={<HomePage />} />
						<Route path="leaderboard" element={<LeaderboardPage />} />
						<Route path="users/:userId" element={<UserPage />} />
						<Route path="create-puzzle/">
							<Route index element={<CreatePuzzlePage />} />
						</Route>
						<Route path="puzzles/:puzzleId" element={<PuzzlePage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
