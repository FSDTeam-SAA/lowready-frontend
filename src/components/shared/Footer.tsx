import Image from "next/image";
import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import logo from "../../../public/images/Logo.png";
// import { FaFacebookSquare } from "react-icons/fa";
// import { FaInstagramSquare } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa6";
// import { FaTwitter } from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#E6F9EB] py-4 lg:py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Image
              src={logo}
              alt="Albin Hub logo"
              width={150}
              height={50}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting families with trusted assisted living facilities
              nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/facilities"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Facilities
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          {/* Contactus */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2 items-center">
                <Mail size={15} /> support@alhhub.com
              </li>
              <li className="flex gap-2 items-center">
                <Phone size={15} /> +1 (602) 247-7559
              </li>
              <li className="flex gap-2 items-center">
                <MapPin size={15} /> 11263 E Unger Ave Mesa, AZ 85212
              </li>
            </ul>
          </div>

          {/*  Newsletter */}
          {/* <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe for updates & news
              </p>
              <div className="flex w-full gap-2 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1  border-primary border-2 rounded-sm  py-2 px-4"
                />
                <Button className="bg-primary hover:bg-primary/90 cursor-pointer text-white rounded-md px-6 py-2">
                  Subscribe
                </Button>
              </div>
              <div className="socails flex gap-2">
                <FaFacebookSquare className="text-3xl  text-gray-500 duration-700 hover:text-blue-600" />
                <div className="relative group">
                  <FaInstagramSquare className="text-3xl duration-700  text-gray-500" />
                  <div className="absolute hidden  group-hover:block h-[90%] w-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition text-gray-500 duration-700 bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#4f5bd5] rounded-xs mix-blend-overlay" />
                </div>
                <FaLinkedin className="text-3xl  text-gray-500 duration-700 hover:text-[#0077B5]" />
                <FaTwitter className="text-3xl  text-gray-500 duration-700 hover:text-blue-400" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Divider and Copyright */}
        <div className="mt-5 pt-5 border-t border-primary/20">
          <p className="text-center text-sm pb-0 text-muted-foreground">
            © 2025 ALH Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
