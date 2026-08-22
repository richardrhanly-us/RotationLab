import { NavLink } from "react-router-dom";

function AppNav() {
  return (
    <header className="app-nav">
      <div className="app-nav-inner">
        <NavLink to="/" className="app-brand">
          RotationLab
        </NavLink>

        <nav className="app-nav-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "app-nav-link active" : "app-nav-link"
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              isActive ? "app-nav-link active" : "app-nav-link"
            }
          >
            Compare
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive ? "app-nav-link active" : "app-nav-link"
            }
          >
            Leaderboard
          </NavLink>

          <NavLink
            to="/replacements"
            className={({ isActive }) =>
              isActive ? "app-nav-link active" : "app-nav-link"
            }
          >
            Replacements
          </NavLink>

          <NavLink
            to="/core"
            className={({ isActive }) =>
              isActive ? "app-nav-link active" : "app-nav-link"
            }
          >
            Four-Player Core
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AppNav;