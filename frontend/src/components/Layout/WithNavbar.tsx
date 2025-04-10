import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"

const WithNavbar = () => {
    return <div>
        <Navbar />
        <Outlet />
    </div>
}

export default WithNavbar