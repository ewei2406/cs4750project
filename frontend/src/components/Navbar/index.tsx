import { useNavigate } from "react-router-dom";
import { useGet } from "@/hooks/useGet"; // adjust path if needed
import "./index.css";

type User = {
  userId: number;
  username: string;
  isAdmin: boolean;
};

const Navbar = () => {
  const navigate = useNavigate();

  const { result } = useGet<User>({ path: "/puzzle/me" });

  return (
    <div className="navbar-container">
      

      <div className="navbar-right">
        {result.status === "loading" && <span>Loading...</span>}

        {result.status === "error" && (
          <button
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

        {result.status === "success" && (
          <span className="username">Hi, {result.data.username}</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
