"use client";

export function FacilityAbout() {
  return (
    <section className="my-6">
      <h2 className="text-xl  font-semibold">
        About{" "}
        <span className="text-[#28A745]">Sunny Hills Assisted Living</span>
      </h2>
      <p className="mt-2  text-[16px] text-[#68706A]">
        Sunny Hills offers a vibrant community, dedicated caregivers, and a wide
        range of amenities designed to provide comfort and security. Residents
        enjoy social activities, wellness programs, and delicious meals while
        living in a welcoming environment.
      </p>

      <h2 className="text-[20px] pt-[32px]">
        Why Choose Sunny Hills Assisted Living?
      </h2>
      <ul className="list-disc pl-6 mt-4 space-y-1">
        <li>
          🏡 Comfortable Living Spaces – Modern rooms and cozy common areas
          designed for relaxation.
        </li>
        <li>
          👩‍⚕️ Personalized Care Plans – Tailored assistance to meet individual
          health and lifestyle needs.
        </li>
        <li>🍲 Nutritious Dining – Fresh, chef-prepared meals served daily.</li>
      </ul>
    </section>
  );
}
