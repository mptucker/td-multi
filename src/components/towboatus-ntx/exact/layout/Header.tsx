"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#locations", label: "Our Lakes" },
  { href: "#services", label: "Services" },
  { href: "#membership", label: "Membership" },
  { href: "#network", label: "TX/OK Network" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close nav on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-nav-container")) {
        setMobileNavOpen(false);
      }
    }

    if (mobileNavOpen) {
      document.addEventListener("click", handleClick);
    }

    return () => document.removeEventListener("click", handleClick);
  }, [mobileNavOpen]);

  const closeNav = () => setMobileNavOpen(false);

  return (
    <header className="relative z-[900] bg-[#06111a] border-b-[0.5px] border-white/[0.08]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between py-[14px] px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center no-underline shrink-0"
          aria-label="Big Water Cowboys TowBoatUS Home"
        >
          <Image
            src="/towboatus-ntx/logo-white.png"
            alt="TowBoatUS Big Water Cowboys"
            width={200}
            height={50}
            className="h-11 w-auto"
            priority
          />
        </Link>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/50 no-underline text-[12px] tracking-[0.08em] uppercase transition-colors hover:text-white"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://www.boatus.com/towing/membership?sourcecode=WT13014A"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center bg-gold text-navy-deep no-underline text-[11px] font-bold tracking-[0.06em] uppercase py-[6px] px-4 rounded transition-all hover:bg-gold-lt"
          >
            Join
          </a>
        </nav>

        {/* Hamburger menu button - mobile only */}
        <button
          className="mobile-nav-container lg:hidden flex flex-col gap-[6px] bg-transparent border-none cursor-pointer p-2"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileNavOpen}
          aria-controls="mobileNav"
        >
          <span
            className={`block w-7 h-[3px] bg-white rounded-sm transition-transform duration-200 ${
              mobileNavOpen ? "translate-y-[9px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-7 h-[3px] bg-white rounded-sm transition-opacity duration-200 ${
              mobileNavOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-[3px] bg-white rounded-sm transition-transform duration-200 ${
              mobileNavOpen ? "-translate-y-[9px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile nav drawer */}
      <nav
        id="mobileNav"
        className={`mobile-nav-container lg:hidden flex-col bg-navy-mid/98 backdrop-blur-md border-t border-white/10 ${
          mobileNavOpen ? "flex" : "hidden"
        }`}
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeNav}
            className="py-4 px-6 text-base font-medium text-white border-b border-white/10 transition-colors hover:bg-white/5"
          >
            {link.label}
          </a>
        ))}
        <a
          href="https://www.boatus.com/towing/membership?sourcecode=WT13014A"
          target="_blank"
          rel="noopener"
          onClick={closeNav}
          className="bg-red text-white font-display font-bold text-center mx-5 my-4 rounded tracking-wide uppercase py-4 transition-colors hover:bg-red-dark"
        >
          Join BoatUS — From $25/yr
        </a>
      </nav>
    </header>
  );
}
