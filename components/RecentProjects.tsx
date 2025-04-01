"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { PinContainer } from "./ui/Pin";
import { useHomeData } from "@/app/hooks/useHomeData";
import { motion } from "framer-motion";

const LoadingProject = () => (
  <div className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw] bg-[#1e2227] rounded-lg animate-pulse">
    <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="w-full text-center py-10">
    <p className="text-red-500 mb-4">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="bg-purple hover:bg-purple/80 text-white px-6 py-2 rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

const RecentProjects = () => {
  const { data, loading, error } = useHomeData();

  if (loading) {
    return (
      <div className="py-20">
        <h1 className="heading">
          A small selection of{" "}
          <span className="text-purple">recent projects</span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-16 mt-10">
          {[1, 2, 3].map((i) => (
            <LoadingProject key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <h1 className="heading">
          A small selection of{" "}
          <span className="text-purple">recent projects</span>
        </h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const projects = data?.projects ?? [];
  if (projects.length === 0) {
    return (
      <div className="py-20">
        <h1 className="heading">
          A small selection of{" "}
          <span className="text-purple">recent projects</span>
        </h1>
        <p className="text-center text-gray-400 mt-10">
          No projects available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="py-20">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-16 mt-10">
        {projects.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
          >
            <PinContainer title="/ui.aceternity.com" href={item.link}>
              <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <img
                    src="/bg.png"
                    alt="bgimg"
                    className="w-full h-full object-cover opacity-50"
                  />
                  {item.img.includes("vimeo.com") ||
                  item.img.includes("youtube.com") ? (
                    <iframe
                      src={`${item.img}?autoplay=1&loop=1&background=1&muted=1`}
                      title={item.title}
                      className="absolute inset-0 w-full h-full z-10"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: "none" }}
                    />
                  ) : (
                    <img
                      src={item.img}
                      alt="cover"
                      className="z-10 absolute bottom-0"
                    />
                  )}
                </div>
              </div>

              <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <img src={icon} alt="icon5" className="p-2" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex lg:text-xl md:text-xs text-sm text-purple hover:opacity-80 transition-opacity"
                  >
                    Check Live Site
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </a>
                </div>
              </div>
            </PinContainer>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
