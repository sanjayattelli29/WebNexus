"use client";
import React, { useState } from "react";

interface NavItemFormProps {
  navItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const NavItemForm = ({ navItem, onSave, onCancel }: NavItemFormProps) => {
  const [formData, setFormData] = useState(navItem || { name: "", link: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <input
        type="text"
        placeholder="Link"
        value={formData.link}
        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        className="w-full p-3 rounded-lg bg-gray-700 text-white"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
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

export default NavItemForm;
