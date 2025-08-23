import { Button } from "../ui/button";


const FindCare = () => {
  return (
    <section className=" p-20   bg-gray-200 bg-cover ">
      <div
        className="container mx-auto h-[calc(50vh)]    rounded-md bg-cover bg-center bg-black/60 bg-blend-overlay"
        style={{ backgroundImage: "url('/images/findcare.jpg')" }}
      >
        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl mb-6 md:mb-8 font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to find the perfect care {" "}
            <span className="text-green-500">for your loved one?</span>
          </h1>
          <p className="mt-6 md:mt-1 text-sm sm:text-lg md:text-xl  leading-relaxed ">
            Easily search, compare, and connect with trusted assisted living facilities, helping your loved ones find a safe, comfortable, and supportive environment while giving you peace of mind every step of the way.
          </p>
          <div className="mt-8">

            <Button size="lg" className="w-[200px]"> Book a Tour Now </Button>
          </div>
         
        </div>
      </div>
    </section>
  );
};

export default FindCare;