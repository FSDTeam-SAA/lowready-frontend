import React from "react";

export default function TermsConditions() {
  return (
    <section className="bg-[#F8F9FA] py-8 md:py-16">
      <div className="container mx-auto px-6 ">
        {/* Heading */}
        <h1 className="text-[#191D23] text-2xl md:text-3xl font-semibold mb-6">
          What is Assisted Living?
        </h1>

        {/* Paragraphs */}
        <p className="text-[#68706A] text-base md:text-lg mb-4 leading-relaxed">
          This is  ipsum dolor sit amet, consectetur adipiscing elit. Aenean at
          libero ultrices, viverra velit rutrum, egestas erat. Fusce nec lacus
          nec enim ornare volutpat. Phasellus vitae ullamcorper felis. Proin
          venenatis, velit a maximus suscipit, justo nulla blandit tellus, ut
          vestibulum massa diam vitae tellus. Aliquam lobortis arcu odio, vel
          sodales elit iaculis eu.
        </p>
        <p className="text-[#68706A] text-base md:text-lg mb-8 leading-relaxed">
          Aenean efficitur mi ipsum, vitae efficitur metus bibendum venenatis.
          Sed bibendum, nulla nec ultrices dignissim, ante ipsum molestie
          ligula, in sodales sem metus eu libero. Sed interdum interdum massa
          vel porta. Integer luctus malesuada ante at hendrerit. Nullam rhoncus
          malesuada aliquam. Phasellus sit amet nulla odio.
        </p>

        {/* Key Considerations */}
        <h2 className="text-[#191D23] text-xl md:text-2xl font-semibold mb-4">
          Key Considerations When Choosing a Facility
        </h2>
        <ol className="list-decimal list-inside text-[#68706A] mb-8 space-y-3 md:space-y-4">
          <li>
            <strong>Location and Accessibility:</strong> Is the community close
            to family and friends? Is it easily accessible for visits and
            medical care?
          </li>
          <li>
            <strong>Level of Care Provided:</strong> Does the facility offer
            help with personal care, memory support, or advanced medical needs?
            Are care plans personalized to each resident?
          </li>
          <li>
            <strong>Community Environment:</strong> Is the atmosphere warm and
            welcoming? Are residents engaged in activities, events, and social
            programs?
          </li>
          <li>
            <strong>Staff and Caregivers:</strong> What is the staff-to-resident
            ratio? Are caregivers trained, friendly, and available 24/7?
          </li>
          <li>
            <strong>Amenities and Services:</strong> Dining options,
            housekeeping and laundry services, wellness and fitness programs,
            transportation services.
          </li>
          <li>
            <strong>Costs and Contracts:</strong> What is included in the
            monthly fee? Are there additional costs for specialized care? Is the
            contract flexible if needs change?
          </li>
        </ol>

        {/* Questions to Ask */}
        <h2 className="text-[#191D23] text-xl md:text-2xl font-semibold mb-4">
          Questions to Ask During a Visit
        </h2>
        <ul className="list-disc list-inside text-[#68706A] space-y-2 md:space-y-3 mb-8">
          <li>What is your approach to resident care?</li>
          <li>What activities are available daily/weekly?</li>
          <li>How do you handle emergencies?</li>
          <li>Can families be involved in care planning?</li>
        </ul>

        {/* Additional Paragraphs */}
        <p className="text-[#68706A] text-base md:text-lg mb-4 leading-relaxed">
          This is  ipsum dolor sit amet, consectetur adipiscing elit. Aenean at
          libero ultrices, viverra velit rutrum, egestas erat. Fusce nec lacus
          nec enim ornare volutpat. Phasellus vitae ullamcorper felis. Proin
          venenatis, velit a maximus suscipit, justo nulla blandit tellus, ut
          vestibulum massa diam vitae tellus.
        </p>
        <p className="text-[#68706A] text-base md:text-lg leading-relaxed">
          Aenean efficitur mi ipsum, vitae efficitur metus bibendum venenatis.
          Sed bibendum, nulla nec ultrices dignissim, ante ipsum molestie
          ligula, in sodales sem metus eu libero. Sed interdum interdum massa
          vel porta. Integer luctus malesuada ante at hendrerit. Nullam rhoncus
          malesuada aliquam. Phasellus sit amet nulla odio.
        </p>
      </div>
    </section>
  );
}
