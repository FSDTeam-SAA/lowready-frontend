
import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import searchimage from '../../../public/images/search-icon.png'
import puzzelimge from '../../../public/images/puzzle-icon.png'
import calenderimg from '../../../public/images/calender-icon.png'

const HowWorks = () => {
  return (
    <div className="container mx-auto my-20"> 
        {/* Header */}
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-green-600">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A simple, step-by-step process to help families find, connect with, and book trusted assisted living facilities with ease.
            </p>
      </div>
      <div className='flex flex-col md:flex-row lg:flex-row gap-4 px-2' >
        
        <Card className="w-full overflow-hidden text-center  p-5 items-center flex flex-col justify-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Search Icon: Centered and Larger */}

            <Image src={searchimage} alt="search-icon" width={80} height={80}/>

            {/* Heading */}
            <h2 className="text-xl text-primary sm:text-3xl font-semibold md:text-3xl mb-6 md:mb-8 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Search & Compare Facilities
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 mx-auto">
                Find the best options tailored to your needs with filters for location, price, amenities, and services.
            </p>
        </Card>
            <Card className="w-full overflow-hidden text-center items-center p-5 flex flex-col justify-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Search Icon: Centered and Larger */}
                <Image src={puzzelimge} alt="search-icon" width={80} height={80}/>

            {/* Heading */}
            <h2 className="text-xl text-primary sm:text-3xl font-semibold md:text-3xl mb-6 md:mb-8 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Connect Directly
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 mx-auto">
                Reach out to facilities without middlemen for faster, clearer communication.
            </p>
        </Card>
        <Card className="w-full overflow-hidden text-center items-center p-5 flex flex-col justify-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Search Icon: Centered and Larger */}
            <Image src={calenderimg} alt="search-icon" width={80} height={80} />

            {/* Heading */}
            <h2 className="text-xl text-primary sm:text-3xl font-semibold md:text-3xl mb-6 md:mb-8 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Book Tours & Services
            </h2>

            {/* Paragraph */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 mx-auto">
                Schedule visits and confirm services easily through our platform.
            </p>
        </Card>


      </div>
    </div>
  )
}

export default HowWorks