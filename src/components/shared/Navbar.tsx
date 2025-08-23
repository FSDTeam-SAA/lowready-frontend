// import Image from "next/image";
// import { Button } from "../ui/button";


// const Navbar = () => {
//     return(
//         <header className="sticky top-0 h-20 bg-white">
//             <div className="container mx-auto">
//             <nav className="flex flex-row justify-between items-center  py-[26px]">
//                 <div className="logo">
//                     <Image src="/images/Logo.png" alt="logo"  width={150} height={48} />
//                 </div>
//                 <div className="">
//                     <ul className="flex flex-row gap-10 font-poppins">
//                         <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"><a href={"/"}>Home</a></li>
//                         <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"><a href={"/facilities"}>Facilities</a></li>
//                         <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"><a href={"/search"}>Search</a></li>
//                         <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"><a href={"/aboutus"}>About Us</a></li>
//                         <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"><a href={"/blogs"}>Blogs</a></li>
//                         <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition"><a href={"/contactus"}>Contact Us</a></li>
//                     </ul>
//                 </div>
//                 <div className="">
//                     <Button className="bg-primary"> Sing in</Button>   
//                 </div>
//             </nav>
//         </div>
//         </header>
//     );
// };


// export default Navbar;
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 h-20 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex flex-row justify-between items-center py-[26px]">
          <div className="logo">
            <Image src="/images/Logo.png" alt="logo" width={150} height={48} />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex flex-row gap-10 font-poppins">
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition">
                <a href={"/"}>Home</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition">
                <a href={"/facilities"}>Facilities</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition">
                <a href={"/search"}>Search</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition">
                <a href={"/aboutus"}>About Us</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition">
                <a href={"/blogs"}>Blogs</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition">
                <a href={"/contactus"}>Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div className="hidden md:block">
            <Button className="bg-primary">
              <Link href={'/login'} >Sign in</Link> 
              
            </Button>
          </div>
          
          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
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
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2">
                <a href={"/"} onClick={() => setIsOpen(false)}>Home</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2">
                <a href={"/facilities"} onClick={() => setIsOpen(false)}>Facilities</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2">
                <a href={"/search"} onClick={() => setIsOpen(false)}>Search</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2">
                <a href={"/aboutus"} onClick={() => setIsOpen(false)}>About Us</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2">
                <a href={"/blogs"} onClick={() => setIsOpen(false)}>Blogs</a>
              </li>
              <li className="text-gray-700 hover:text-green-500 border-b-2 border-transparent hover:border-green-500 transition py-2">
                <a href={"/contactus"} onClick={() => setIsOpen(false)}>Contact Us</a>
              </li>
            </ul>
            
            <div className="mt-8">
              <Button className="bg-primary w-full">Sign in</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;