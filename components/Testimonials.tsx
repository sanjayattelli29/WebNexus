"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  title: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/home");
        const data = await response.json();
        if (data.success) {
          setTestimonials(data.data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  if (!testimonials.length) return null;

  return (
    <div className="py-20">
      <h1 className="heading">
        What <span className="text-purple">clients say</span> about my work
      </h1>

      <div className="mt-10 relative h-[300px] overflow-hidden">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            className="absolute w-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: currentIndex === index ? 1 : 0,
              x: currentIndex === index ? 0 : -100,
            }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: currentIndex === index ? "auto" : "none" }}
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
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
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
