
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Discover and join local events or create your own with FindMe – connecting people through experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary text-sm">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary text-sm">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary text-sm">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-4">For Organizers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/create-event" className="text-muted-foreground hover:text-primary text-sm">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary text-sm">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FindMe. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-xs text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
