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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface UserAvatar {
  url: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    avatar?: UserAvatar;
    firstName?: string;
    lastName?: string;
    role?: string;
    _id: string;
    email?: string;
  };
}

const Navbar = () => {
  const { data: session, status } = useSession();
  const [currentSession, setCurrentSession] = useState(session);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update session locally
  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  // Fetch user avatar
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`${baseUrl}/user/${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: UserResponse = await res.json();
        if (data.success && data.data.avatar?.url) {
          setAvatarUrl(data.data.avatar.url);
        } else {
          setAvatarUrl(null);
        }
        setUserName(data.data.firstName + " " + data.data.lastName);
        setUserEmail(data.data.email || null);
      } catch (error) {
        console.error("Error fetching user avatar:", error);
        setAvatarUrl(null);
      }
    };

    fetchUser();
  }, [session?.user?.id, session?.user?.email]);

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

  // Prevent scrolling when mobile menu is open
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
  const displayAvatar = avatarUrl || undefined;

  console.log("user name from navbar:", userName);
  return (
    <header className="sticky top-0 h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-[15px]">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center">
            <Link href="/">
              <Image
                src="/images/Logo.png"
                alt="logo"
                width={150}
                height={48}
              />
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
          <div className="flex-shrink-0 flex items-center gap-4">
            {status === "loading" ? (
              <LoadingPlaceholder />
            ) : isLoggedIn ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center hover:bg-destructive/0"
                    >
                      <Avatar className="h-10 w-10 cursor-pointer">
                        <AvatarImage src={displayAvatar} alt={userName || ""} />
                        <AvatarFallback>
                          {getInitials(userName || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <div className="font-medium cursor-pointer">
                          {userName}
                        </div>
                        <div className="text-sm text-muted-foreground cursor-pointer">
                          {userEmail}
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <Link href="/account" passHref>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setLogoutModalOpen(true)}
                      className="text-red-500"
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
                  <AvatarImage src={displayAvatar} alt={userName || ""} />
                  <AvatarFallback>{getInitials(userName || "")}</AvatarFallback>
                </Avatar>
              )}
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="relative z-50"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-white z-40 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="flex flex-col gap-6 font-poppins text-lg">
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

            <div className="mt-8">
              {status === "loading" ? (
                <LoadingPlaceholder />
              ) : isLoggedIn ? (
                <Button
                  className="w-full text-primary flex items-center justify-center gap-2"
                  variant="ghost"
                  onClick={() => setLogoutModalOpen(true)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={displayAvatar} alt={userName || ""} />
                    <AvatarFallback>
                      {getInitials(userName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <div className="font-medium">{userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {userEmail}
                    </div>
                  </div>
                </Button>
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

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              You are about to log out of your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                signOut();
                setLogoutModalOpen(false);
              }}
            >
              Yes, Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
