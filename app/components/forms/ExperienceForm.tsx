"use client";
import React, { useState } from "react";
import { uploadToCloudinary } from "@/utils/cloudinary";

interface ExperienceFormProps {
  experience?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ExperienceForm = ({
  experience,
  onSave,
  onCancel,
}: ExperienceFormProps) => {
  const [formData, setFormData] = useState(
    experience || {
      title: "",
      desc: "",
      className: "",
      thumbnail: "",
    }
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
          setFormData({ ...formData, thumbnail: imageUrl });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Experience Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
      />
      <textarea
        placeholder="Experience Description"
        value={formData.desc}
        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
        className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white h-32"
      />
      <input
        type="text"
        placeholder="Class Name"
        value={formData.className}
        onChange={(e) =>
          setFormData({ ...formData, className: e.target.value })
        }
        className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
      />
      <div>
        <label className="block text-white mb-2">Thumbnail Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
        />
        {formData.thumbnail && (
          <img
            src={formData.thumbnail}
            alt="Preview"
            className="mt-2 h-32 object-cover rounded"
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 bg-purple hover:bg-purple/80 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Save"}
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

export default ExperienceForm;
