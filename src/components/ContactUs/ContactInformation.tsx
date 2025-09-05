"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"

export default function ContactInformation() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")

  const base_url = process.env.NEXT_PUBLIC_API_URL

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage("")

    try {
      const res = await fetch(`${base_url}/contactUs/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        setResponseMessage("✅ " + data.message)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        })
      } else {
        setResponseMessage("❌ Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      setResponseMessage("❌ Server error. Please try later.")
    } finally {
      setLoading(false)
    }
  }

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

          {/* Contact Information + Form Section */}
          <div className="space-y-6 p-4 md:p-0">
             
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold font-playfair text-primary mb-4" >Contact Information</h1>
              <p className="text-[#68706A]  text-base">
                Find all the ways to reach us, including email, phone, and our office address, so you can get the
                support and answers you need quickly and easily.
              </p>
            </div>

 

            {/* Static Contact Info */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Mail className="text-green-600 w-5 h-5" />
                <span className="text-[#343A40] text-base">
                  support@alhhub.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-green-600 w-5 h-5" />
                <span className="text-[#343A40] text-base">
                  +1 (555) 123-4567
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-green-600 w-5 h-5 mt-0.5" />
                <div className="text-[#343A40] text-base">
                  <div>123 Care Street, City, State, ZIP</div>
                  <div className="text-base text-[#343A40]">
                    Address: 123 Care Street, City, State, ZIP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
