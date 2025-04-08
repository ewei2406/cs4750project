import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Connections from "./pages/Connections/connections"
import ConnectionPage from "./pages/Connections/browseConnections"
import CrosswordPage from "./pages/Crosswords/browseCrosswords"

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/connections" element={<Connections />} />
			<Route path="/browseConnections" element={<ConnectionPage />} />
			<Route path="/browseCrosswords" element={<CrosswordPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
