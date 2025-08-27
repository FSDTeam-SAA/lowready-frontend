import React from "react";
import DetailsCard from "./DetailsCard";
import CustomersRight from "./CustomersRight";

interface CustomersDetailsProps {
  id: string;
}

const CustomersDetails: React.FC<CustomersDetailsProps> = ({ id }) => {
  // TODO: Fetch actual customer data using `id` and React Query
  const profileData = {
    name: "John Doe",
    email: "john@example.com",
    bio: "Loves coding",
    phone: "+123456789",
    location: "New York",
    joinDate: "2022-01-01",
    avatar: "/images/john.jpg",
  };

  console.log(id);

  return (
    <section className="p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <DetailsCard profileData={profileData} />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <CustomersRight />
        </div>
      </div>
    </section>
  );
};

export default CustomersDetails;
