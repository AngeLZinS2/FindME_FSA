
import React from "react";
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { SocialMediaLink } from "./SocialMediaInputs";
import { Button } from "./ui/button";

interface SocialMediaLinksProps {
  links: SocialMediaLink[];
  className?: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ links, className = "" }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      default:
        return <Instagram className="h-5 w-5" />;
    }
  };

  if (!links || links.length === 0) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {links.filter(link => link.url).map((link) => (
        <Button
          key={link.id}
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full"
        >
          <a 
            href={link.url.includes("://") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noreferrer"
            aria-label={link.platform}
          >
            {getPlatformIcon(link.platform)}
          </a>
        </Button>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
