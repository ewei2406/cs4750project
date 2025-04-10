import { BrowserRouter, Route, Routes } from "react-router-dom";
import Connections from "./pages/Connections/connections"
import CrosswordPage from "./pages/Crosswords/browseCrosswords"
import CreateConnections from "./pages/Connections/createConnections"
import BrowseConnections from "./pages/Browse";
import Login from "./pages/Login/"
import Signup from "./pages/Login/Signup"
import Browse from "./pages/Browse"
import "./App.css"
import WithNavbar from "./components/Layout/WithNavbar";
import Home from "./pages/Home";
// import BrowseCrosswords from "./pages/BrowseCrosswords";

// /browse?filter=crosswords

// /create/crosswords

// /crosswords/browse
// /crosswords/create
// /crosswords/123

// /connections/browse

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<WithNavbar />}>
					<Route path="home" element={<Home />} />
					<Route path="browse" element={<Browse />} />
					<Route path="login" element={<Login />} />
					<Route path="signup" element={<Signup />} />
					<Route path="/createConnections" element={<CreateConnections />} />
				</Route>

				{/* <Route path="/test">
				<Route path="abc" element={<div>Hello abc</div>}/>
				<Route path="def" element={<div>Hello def</div>}/>
			</Route> */}

				{/* <Route path="/connections" element={<Connections />} /> */}
				{/* <Route path="/browseConnections" element={<BrowseConnections />} /> */}
				{/* <Route path="/browseCrosswords" element={<CrosswordPage />} /> */}
				
			</Routes>
		</BrowserRouter>
	);
};

export default App;
