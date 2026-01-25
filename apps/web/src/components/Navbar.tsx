import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "About Us", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  currentPath: string;
  navIconSrc: string;
}

export default function Navbar({ currentPath, navIconSrc }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setIsOpen(false);
    if (currentPath === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 z-50 bg-background w-full border-b-3 border-primary flex flex-col">
      <div className="flex w-full justify-between items-center p-2">
        <a
          className="flex flex-row items-center text-2xl font-black mr-2"
          href="/"
          onClick={(e) => handleLinkClick(e, "/")}
        >
          SSA at UC San Diego
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex ml-auto mr-4 items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              className="text-lg font-bold hover:text-primary transition-colors"
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="text-lg bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 h-10 px-4 py-2 ml-1"
            href="https://members.ssaucsd.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Member Login
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 mr-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 py-4 border-t border-dashed border-primary/20">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-lg font-bold hover:text-primary transition-colors"
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://members.ssaucsd.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 px-4 py-2 mt-2"
            onClick={() => setIsOpen(false)}
          >
            Member Login
          </a>
        </div>
      </div>
    </div>
  );
}
