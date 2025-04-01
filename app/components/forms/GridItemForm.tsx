"use client";
import React, { useState } from "react";
import { uploadToCloudinary } from "@/utils/cloudinary";

interface GridItemFormProps {
  gridItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const GridItemForm = ({ gridItem, onSave, onCancel }: GridItemFormProps) => {
  const [formData, setFormData] = useState(
    gridItem || {
      title: "",
      description: "",
      className: "",
      imgClassName: "",
      titleClassName: "",
      video: "",
      img: "",
      spareImg: "",
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
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full p-3 rounded-lg bg-gray-700 text-white h-24"
      />
      <input
        type="text"
        placeholder="Class Name"
        value={formData.className}
        onChange={(e) =>
          setFormData({ ...formData, className: e.target.value })
        }
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Image Class Name"
        value={formData.imgClassName}
        onChange={(e) =>
          setFormData({ ...formData, imgClassName: e.target.value })
        }
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Title Class Name"
        value={formData.titleClassName}
        onChange={(e) =>
          setFormData({ ...formData, titleClassName: e.target.value })
        }
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Video URL"
        value={formData.video}
        onChange={(e) => setFormData({ ...formData, video: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <div>
        <label className="block text-white mb-2">Image</label>
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
        <label className="block text-white mb-2">Spare Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "spareImg")}
          className="w-full p-3 rounded-lg bg-gray-700 text-white"
        />
        {formData.spareImg && (
          <img
            src={formData.spareImg}
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

export default GridItemForm;
