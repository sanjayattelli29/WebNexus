"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHomeData } from "@/app/hooks/useHomeData";

const LoadingTestimonial = () => (
  <div className="max-w-3xl mx-auto">
    <div className="h-32 bg-[#1e2227] rounded-lg animate-pulse mb-4"></div>
    <div className="h-8 w-48 bg-[#1e2227] rounded-lg animate-pulse mx-auto mb-2"></div>
    <div className="h-6 w-32 bg-[#1e2227] rounded-lg animate-pulse mx-auto"></div>
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

const Testimonials = () => {
  const { data, loading, error } = useHomeData();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data?.testimonials?.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % data.testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [data?.testimonials]);

  if (loading) {
    return (
      <div className="py-20">
        <h1 className="heading">
          What <span className="text-purple">clients say</span> about my work
        </h1>
        <div className="mt-10">
          <LoadingTestimonial />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <h1 className="heading">
          What <span className="text-purple">clients say</span> about my work
        </h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data?.testimonials?.length) {
    return (
      <div className="py-20">
        <h1 className="heading">
          What <span className="text-purple">clients say</span> about my work
        </h1>
        <p className="text-center text-gray-400 mt-10">
          No testimonials available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="py-20">
      <h1 className="heading">
        What <span className="text-purple">clients say</span> about my work
      </h1>

      <div className="mt-10 relative h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              className="absolute w-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: currentIndex === index ? 1 : 0,
                x: currentIndex === index ? 0 : -100,
              }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              style={{
                pointerEvents: currentIndex === index ? "auto" : "none",
              }}
            >
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-gray-300 text-lg md:text-xl italic mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <h3 className="text-white text-xl font-medium mb-2">
                  {testimonial.name}
                </h3>
                <p className="text-purple">{testimonial.title}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {data.testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === index ? "bg-purple" : "bg-gray-600"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
