"use client";
import React, { useState } from "react";
import { uploadToCloudinary } from "@/utils/cloudinary";

interface CompanyFormProps {
  company?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CompanyForm = ({ company, onSave, onCancel }: CompanyFormProps) => {
  const [formData, setFormData] = useState(
    company || {
      name: "",
      img: "",
      nameImg: "",
    }
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
          setFormData({ ...formData, [field]: imageUrl });
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
        placeholder="Company Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <div>
        <label className="block text-white mb-2">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "img")}
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
      <div>
        <label className="block text-white mb-2">Name Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "nameImg")}
          className="w-full p-3 rounded-lg bg-gray-700 text-white"
        />
        {formData.nameImg && (
          <img
            src={formData.nameImg}
            alt="Preview"
            className="mt-2 h-20 object-cover rounded"
          />
        )}
      </div>
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

export default CompanyForm;
