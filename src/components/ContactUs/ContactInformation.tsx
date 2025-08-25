import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactInformation() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto container ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map Section */}
          <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7516.115462168595!2d90.40641010188482!3d23.78041211786741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1756081914462!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4"  style={{ fontFamily: "var(--font-playfair)" }}>Contact Information</h1>
              <p className="text-[#68706A] text-base">
                Find all the ways to reach us, including email, phone, and our office address, so you can get the
                support and answers you need quickly and easily.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Mail className="text-green-600 w-5 h-5" />
                </div>
                <span className="text-[#343A40] text-base">support@alhhub.com</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Phone className="text-green-600 w-5 h-5" />
                </div>
                <span className="text-[#343A40] text-base">+1 (555) 123-4567FGHJ</span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <MapPin className="text-green-600 w-5 h-5" />
                </div>
                <div className="text-[#343A40] text-base">
                  <div>123 Care Street, City, State, ZIP</div>
                  <div className="text-base text-[#343A40]">Address: 123 Care Street, City, State, ZIP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
