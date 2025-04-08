import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Connections from "./pages/Connections/connections"
import ConnectionPage from "./pages/Connections/browseConnections"
import CrosswordPage from "./pages/Crosswords/browseCrosswords"
import CreateConnections from "./pages/Connections/createConnections"

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/connections" element={<Connections />} />
			<Route path="/browseConnections" element={<ConnectionPage />} />
			<Route path="/browseCrosswords" element={<CrosswordPage />} />
			<Route path="/createConnections" element={<CreateConnections />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
