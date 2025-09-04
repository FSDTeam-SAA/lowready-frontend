"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [currentSession, setCurrentSession] = useState(session);
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update local session whenever NextAuth session changes
  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const getInitials = (name?: string | null) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
    { name: "Search", path: "/search" },
    { name: "About Us", path: "/about-us" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const LoadingPlaceholder = () => (
    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
  );

  const isLoggedIn = !!currentSession?.user;

  return (
    <header className="sticky top-0 h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-[15px]">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex pb-6 items-center">
            <Link href="/">
              <Image src="/images/Logo.png" alt="logo" width={150} height={48} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex gap-10 font-poppins">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li
                    key={item.name}
                    className={`${
                      isActive
                        ? "text-[#28A745] border-b-2 border-[#28A745]"
                        : "text-gray-700 border-b-2 border-transparent"
                    } hover:text-green-500 hover:border-green-500 transition pb-1`}
                  >
                    <Link href={item.path}>{item.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex-shrink-0 cursor-pointer px-6 py-2 flex items-center gap-4">
            {/* Desktop Profile / Sign In */}
            {status === "loading" ? (
              <LoadingPlaceholder />
            ) : isLoggedIn ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 cursor-pointer">
                        <AvatarImage
                          src={currentSession.user.image || ""}
                          alt={currentSession.user.name || ""}
                        />
                        <AvatarFallback>{getInitials(currentSession.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <div className="font-medium cursor-pointer">{currentSession.user.name}</div>
                        <div className="text-sm text-muted-foreground cursor-pointer">
                          {currentSession.user.role}
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <Link href="/account" passHref>
                      <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:block">
                <Button className="bg-primary">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger + Avatar */}
            <div className="md:hidden flex items-center gap-2">
              {isLoggedIn && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={currentSession.user.image || ""}
                    alt={currentSession.user.name || ""}
                  />
                  <AvatarFallback>{getInitials(currentSession.user.name)}</AvatarFallback>
                </Avatar>
              )}
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="z-60 relative"
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
            <ul className="flex flex-col justify-start gap-6 font-poppins text-lg">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li
                    key={item.name}
                    className={`${
                      isActive
                        ? "text-[#28A745] border-b-2 border-[#28A745]"
                        : "text-gray-700 border-b-2 border-transparent"
                    } hover:text-green-500 hover:border-green-500 transition py-2`}
                  >
                    <Link href={item.path} onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Dropdown / Sign In */}
            <div className="mt-8">
              {status === "loading" ? (
                <LoadingPlaceholder />
              ) : isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="w-full text-primary flex items-center justify-center gap-2"
                      variant="ghost"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={currentSession.user.image || ""}
                          alt={currentSession.user.name || ""}
                        />
                        <AvatarFallback>{getInitials(currentSession.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <div className="font-medium">{currentSession.user.name}</div>
                        <div className="text-sm text-muted-foreground">{currentSession.user.role}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full" align="end" forceMount>
                    <Link href="/account" passHref>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="bg-primary w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Sign in
                  </Link>
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
