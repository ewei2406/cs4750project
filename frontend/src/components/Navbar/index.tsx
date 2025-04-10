import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="hamburger-container">
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      {menuOpen && (
        <div className="dropdown-menu">
          <button onClick={() => navigate("/browseCrosswords")}>
            Browse Crosswords
          </button>
          <button onClick={() => navigate("/browseConnections")}>
            Browse Connections
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar