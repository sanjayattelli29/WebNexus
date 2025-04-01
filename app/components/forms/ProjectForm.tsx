"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ProjectFormProps {
  project?: {
    _id?: string;
    title: string;
    des: string;
    img: string;
    iconLists: string[];
    link: string;
    isVideo?: boolean;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

// Available icons from public folder
const availableIcons = [
  "/re.svg",
  "/tail.svg",
  "/ts.svg",
  "/three.svg",
  "/fm.svg",
  "/next.svg",
  "/stream.svg",
  "/c.svg",
  "/gsap.svg",
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    des: project?.des || "",
    img: project?.img || "",
    iconLists: project?.iconLists || [],
    link: project?.link || "",
    isVideo: true,
  });

  const [selectedIcon, setSelectedIcon] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const icon = e.target.value;
    if (icon && !formData.iconLists.includes(icon)) {
      setFormData((prev) => ({
        ...prev,
        iconLists: [...prev.iconLists, icon],
      }));
    }
    setSelectedIcon("");
  };

  const removeIcon = (iconToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      iconLists: prev.iconLists.filter((icon) => icon !== iconToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract video ID from Vimeo embed URL if provided
    let videoUrl = formData.img;
    if (videoUrl.includes("player.vimeo.com/video/")) {
      const videoId = videoUrl.split("/video/")[1].split("?")[0];
      videoUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&background=1&muted=1`;
    }
    onSave({ ...formData, img: videoUrl });
  };

  return (
    <div className="relative bg-[#1e2227] p-6 rounded-lg">
      <button
        onClick={onCancel}
        className="absolute right-4 top-4 text-gray-400 hover:text-white p-2"
      >
        <FaTimes size={20} />
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">
        {project ? "Edit Project" : "Add New Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple focus:ring-1 focus:ring-purple"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="des"
                value={formData.des}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple focus:ring-1 focus:ring-purple"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vimeo Video URL
              </label>
              <input
                type="text"
                name="img"
                value={formData.img}
                onChange={handleInputChange}
                placeholder="https://player.vimeo.com/video/YOUR_VIDEO_ID"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple focus:ring-1 focus:ring-purple"
                required
              />
              {formData.img && (
                <div className="mt-4 aspect-video">
                  <iframe
                    src={`${formData.img}?autoplay=1&loop=1&background=1&muted=1`}
                    className="w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.iconLists.map((icon, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-lg"
                  >
                    <img src={icon} alt="" className="w-6 h-6" />
                    <button
                      type="button"
                      onClick={() => removeIcon(icon)}
                      className="text-red-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <select
                value={selectedIcon}
                onChange={handleIconSelect}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple focus:ring-1 focus:ring-purple"
              >
                <option value="">Select technology icon</option>
                {availableIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon.replace("/", "").replace(".svg", "")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-purple focus:ring-1 focus:ring-purple"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors"
          >
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
