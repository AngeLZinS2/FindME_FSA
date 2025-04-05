
import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  return (
    <Link to="/" className="flex items-center gap-1">
      <div className="relative">
        <MapPin className={`${sizeClasses[size]} animate-pulse-gentle`} />
      </div>
      <span className={`font-bold tracking-wider ${sizeClasses[size]} text-primary uppercase`}>
        FIND ME
      </span>
    </Link>
  );
};

export default Logo;
