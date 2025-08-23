import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import logo from '../../../public/images/Logo.png'

const Footer = () => {
  return (
    <footer className='bg-[#E6F9EB] py-12 lg:py-16'>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Image src={logo} alt='Albin Hub logo' width={150} height={50} className="mb-4" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting families with trusted assisted living facilities nationwide.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/facilities" className="text-sm text-muted-foreground hover:text-primary transition-colors">Facilities</Link></li>
              <li><Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blogs</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          {/* Contactus */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@albinhub.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Core Street, City, State, 2P</li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div className="space-y-6">
            
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Newsletter</h3>
              <p className="text-sm text-muted-foreground">Subscribe for updates & news</p>
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
            </div>
          </div>
        </div>
        
        {/* Divider and Copyright */}
        <div className="mt-12 pt-8 border-t border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Albin Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer