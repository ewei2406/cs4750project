import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const WithNavbar = () => {
	return (
		<div>
			<Navbar />
			<div style={{ width: 800, margin: "0 auto", padding: 20 }}>
				<Outlet />
			</div>
		</div>
	);
};

export default WithNavbar;
