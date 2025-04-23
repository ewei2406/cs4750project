import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import WithNavbar from "./components/Layout/WithNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import UserPage from "./pages/UserPage";

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
					</Route>
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
