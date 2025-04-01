"use client";
import React, { useState } from "react";

interface TestimonialFormProps {
  testimonial?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TestimonialForm = ({
  testimonial,
  onSave,
  onCancel,
}: TestimonialFormProps) => {
  const [formData, setFormData] = useState(
    testimonial || {
      quote: "",
      name: "",
      title: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        placeholder="Testimonial Quote"
        value={formData.quote}
        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
        className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white h-32"
      />
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
      />
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-purple hover:bg-purple/80 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;
