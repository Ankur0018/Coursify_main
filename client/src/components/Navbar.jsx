import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, LayoutDashboard, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-xl text-gray-900 tracking-tight">
              Coursify
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={user.role === "instructor" ? "/instructor" : "/dashboard"}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {user.role === "instructor" ? (
                    <><LayoutDashboard size={15} /> Dashboard</>
                  ) : (
                    <><GraduationCap size={15} /> My Learning</>
                  )}
                </Link>

                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="ml-1 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
