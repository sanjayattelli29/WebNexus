"use client";
import React, { useState } from "react";
import { uploadToCloudinary } from "@/utils/cloudinary";

interface SocialMediaFormProps {
  socialMedia?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const SocialMediaForm = ({
  socialMedia,
  onSave,
  onCancel,
}: SocialMediaFormProps) => {
  const [formData, setFormData] = useState(
    socialMedia || {
      img: "",
      link: "",
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
          setFormData({ ...formData, img: imageUrl });
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
      <div>
        <label className="block text-white mb-2">Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 rounded-lg bg-gray-700 text-white"
        />
        {formData.img && (
          <img
            src={formData.img}
            alt="Preview"
            className="mt-2 h-20 object-cover rounded"
          />
        )}
      </div>
      <input
        type="text"
        placeholder="Social Media Link"
        value={formData.link}
        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isUploading ? "Uploading..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SocialMediaForm;
