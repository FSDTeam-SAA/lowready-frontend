import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function ContactInformation() {
  return (
    <div className="py-5 md:py-16 mx-auto container">
      <div className="relative py-4 md:py-16">
        {/* Image as background */}
        <div className="absolute inset-0">
          <Image
            src="/contact/contactImage1.jpg"
            alt="Contact Background"
            fill
            className="object-cover rounded-2xl"
          />
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto container p-2 flex flex-col items-center text-center gap-1">
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-extrabold font-playfair text-white mb-4 leading-tight">
            Contact <span className="text-green-600">Information</span>
          </h1>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg max-w-xl leading-relaxed">
            Find all the ways to reach us, including email, phone, and our
            office address. Get the support and answers you need quickly and
            easily.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row md:gap-16 gap-6 pt-8 items-center justify-center">
            <div className="flex items-center gap-3">
              <Mail className="text-green-500 w-6 h-6" />
              <span className="text-white text-base md:text-lg font-medium">
                support@alhhub.com
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-500 w-6 h-6" />
              <span className="text-white text-base md:text-lg font-medium">
                +1 (602) 247-7559
              </span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-green-500 w-6 h-6 mt-0.5" />
              <span className="text-white text-base md:text-lg font-medium">
                11263 E Unger Ave Mesa, AZ 85212
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
