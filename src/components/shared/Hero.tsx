import CheckboxHorizontalGroupDemo from "../customized/checkbox/checkbox-04";
import { SearchBar } from "../customized/searchbar/searchbar";

const Hero = () => {
  return (
    <section className="min-h-svh mt-8">
      <div className="container px-8 mx-auto h-[calc(100vh-150px)] md:h-[calc(100svh-120px)] sm:h-[calc(100svh-100px)] rounded-md bg-cover bg-no-repeat bg-center bg-black/60 bg-blend-overlay bg-[url('/images/hero.jpg')]">
        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full text-white text-center px-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl mb-0 md:mb-6 font-bold max-w-4xl font-playfair leading-tight">
            Every Senior Deserves a Place That{" "}
            <span className="text-green-500">Feels Like Home</span>
          </h1>
          <p className="mt-6 md:mt-10 text-sm sm:text-lg md:text-base max-w-5xl leading-relaxed ">
            At ALH Hub, we believe every senior deserves a place where care
            meets comfort. Our platform helps families connect directly with
            trusted assisted living facilities, making it easier to find a safe
            and welcoming environment that truly feels like home.
          </p>

          {/* Checkbox + SearchBar Container */}
          <div className="my-6 md:my-10 w-full bg-transparent p-4 sm:p-6 rounded-md">
            <div className="max-w-3xl mx-auto space-y-4">
              <CheckboxHorizontalGroupDemo />
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
