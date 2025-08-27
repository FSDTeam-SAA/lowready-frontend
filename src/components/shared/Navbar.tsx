"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsOpen(false);
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      )
        setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const navItems = [
    "Home",
    "Facilities",
    "Search",
    "About Us",
    "Blogs",
    "Contact Us",
  ];

  return (
    <header className="sticky top-0 h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-[26px]">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Image src="/images/Logo.png" alt="logo" width={150} height={48} />
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex gap-10 font-poppins">
              {navItems.map((item) => (
                <li
                  key={item}
                  className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"
                >
                  <Link
                    href={`/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "-")
                    }`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Sign In / Profile */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <User size={32} />
                </Button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <span className="block px-4 py-2 text-gray-500">
                      {session.user?.role}
                    </span>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <Button className="bg-primary">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`mobile-menu md:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-white z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="flex flex-col gap-6 font-poppins text-lg">
              {navItems.map((item) => (
                <li
                  key={item}
                  className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2"
                >
                  <Link
                    href={`/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "-")
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <Button
                    className="w-full text-primary flex items-center justify-center gap-2"
                    variant="ghost"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <User size={32} />
                    <span>Profile</span>
                  </Button>

                  {profileMenuOpen && (
                    <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-lg py-2 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <span className="block px-4 py-2 text-gray-500">
                        {session?.user?.role}
                      </span>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button className="bg-primary w-full">
                  <Link href="/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
