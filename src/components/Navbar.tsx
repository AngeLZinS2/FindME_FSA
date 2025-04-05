
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b py-4 sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? "active-nav-link" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" className="flex items-center gap-2">
              <User size={16} />
              Sign in
            </Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t">
          <div className="space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 px-3 rounded-md ${
                  isActive(item.path) ? "bg-accent font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <User size={16} />
                  Sign in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
