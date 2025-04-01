"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaDatabase,
  FaNewspaper,
  FaImages,
  FaSignOutAlt,
  FaDownload,
  FaLink,
  FaBriefcase,
  FaBuilding,
  FaHome,
  FaEnvelope,
} from "react-icons/fa";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {
  ProjectForm,
  TestimonialForm,
  ExperienceForm,
  NavItemForm,
  GridItemForm,
  CompanyForm,
  SocialMediaForm,
  GridForm,
} from "@/app/components/forms";

interface NavItem {
  name: string;
  link: string;
}

interface GridItem {
  id: number;
  title?: string;
  description?: string;
  className: string;
  imgClassName: string;
  titleClassName: string;
  video?: string;
  img?: string;
  spareImg: string;
}

interface MongoDocument {
  _id: string;
}

interface Project extends Partial<MongoDocument> {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  isVideo?: boolean;
}

interface Testimonial extends Partial<MongoDocument> {
  quote: string;
  name: string;
  title: string;
}

interface Company {
  id: number;
  name: string;
  img: string;
  nameImg: string;
}

interface WorkExperience extends Partial<MongoDocument> {
  id: number;
  title: string;
  desc: string;
  className: string;
  thumbnail: string;
}

interface SocialMedia extends Partial<MongoDocument> {
  id: number;
  img: string;
  link: string;
}

interface ContactData {
  _id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

interface FormData {
  [key: string]: any;
}

const AdminPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });

  // State for all sections
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [contactData, setContactData] = useState<ContactData[]>([]);

  const [activeTab, setActiveTab] = useState("projects");
  const [activeSection, setActiveSection] = useState("projects");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [currentItem, setCurrentItem] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  // Form schemas for different sections
  const formSchemas = {
    navItems: ["name", "link"],
    gridItems: [
      "title",
      "description",
      "className",
      "imgClassName",
      "titleClassName",
      "video",
      "img",
      "spareImg",
    ],
    projects: ["title", "des", "img", "link", "iconLists"],
    testimonials: ["quote", "name", "title"],
    companies: ["name", "img", "nameImg"],
    workExperience: ["title", "desc", "className", "thumbnail"],
    socialMedia: ["img", "link"],
  };

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadData();
      fetchContacts();
      fetchProjects();
    }
  }, []);

  const loadData = async () => {
    // Load all sections from localStorage
    const savedNavItems = localStorage.getItem("navItems");
    if (savedNavItems) setNavItems(JSON.parse(savedNavItems));

    const savedGridItems = localStorage.getItem("gridItems");
    if (savedGridItems) setGridItems(JSON.parse(savedGridItems));

    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) setProjects(JSON.parse(savedProjects));

    const savedTestimonials = localStorage.getItem("testimonials");
    if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials));

    const savedCompanies = localStorage.getItem("companies");
    if (savedCompanies) setCompanies(JSON.parse(savedCompanies));

    const savedWorkExperience = localStorage.getItem("workExperience");
    if (savedWorkExperience) setWorkExperience(JSON.parse(savedWorkExperience));

    const savedSocialMedia = localStorage.getItem("socialMedia");
    if (savedSocialMedia) setSocialMedia(JSON.parse(savedSocialMedia));

    // Load contact form data
    try {
      const response = await fetch("/api/db?collection=contacts");
      const data = await response.json();
      if (data.success) {
        setContactData(data.data);
      }
    } catch (error) {
      console.error("Error loading contact data:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (data.success) {
        setContactData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminCredentials.username === "design" &&
      adminCredentials.password === "develop"
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      loadData();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    router.push("/");
  };

  const handleAdd = (type: string) => {
    setIsEditing(true);
    setEditingItem(null);
    setActiveSection(type);
    setCurrentItem({});
  };

  const handleEdit = (item: any, type: string) => {
    setIsEditing(true);
    setEditingItem(item);
    setActiveSection(type);
    setCurrentItem(item);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    setCurrentItem({});
  };

  const handleDelete = async (id: string | number, type: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const endpoint = `${
          type === "projects"
            ? "/api/projects"
            : type === "testimonials"
            ? "/api/testimonials"
            : type === "workExperience"
            ? "/api/experience"
            : type === "socialMedia"
            ? "/api/social"
            : type === "contacts"
            ? "/api/contact"
            : ""
        }/${id}`;

        if (!endpoint) {
          console.error("Invalid type for deletion");
          return;
        }

        const response = await fetch(endpoint, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.success) {
          // Update local state
          switch (type) {
            case "projects":
              setProjects((prev) =>
                prev.filter((p) => String(p._id || p.id) !== String(id))
              );
              break;
            case "testimonials":
              setTestimonials((prev) =>
                prev.filter((t) => String(t._id) !== String(id))
              );
              break;
            case "workExperience":
              setWorkExperience((prev) =>
                prev.filter((w) => String(w._id || w.id) !== String(id))
              );
              break;
            case "socialMedia":
              setSocialMedia((prev) =>
                prev.filter((s) => String(s._id || s.id) !== String(id))
              );
              break;
            case "contacts":
              setContactData((prev) =>
                prev.filter((c) => String(c._id) !== String(id))
              );
              break;
          }
        } else {
          alert(`Failed to delete ${type}`);
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Failed to delete ${type}`);
      }
    }
  };

  const handleSave = async (type: string, data: any) => {
    try {
      if (type === "projects") {
        const url = editingItem?._id
          ? `/api/projects/${editingItem._id}`
          : "/api/projects";

        const response = await fetch(url, {
          method: editingItem?._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          // Refresh projects list
          fetchProjects();
        } else {
          alert("Failed to save project");
        }
      } else {
        const endpoint = `${
          type === "testimonials"
            ? "/api/testimonials"
            : type === "workExperience"
            ? "/api/experience"
            : type === "socialMedia"
            ? "/api/social"
            : ""
        }${editingItem?._id ? `/${editingItem._id}` : ""}`;

        if (endpoint) {
          const response = await fetch(endpoint, {
            method: editingItem?._id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          if (result.success) {
            // Refresh data based on type
            switch (type) {
              case "testimonials":
                const testimonialsResponse = await fetch("/api/testimonials");
                const testimonialsData = await testimonialsResponse.json();
                if (testimonialsData.success) {
                  setTestimonials(testimonialsData.data);
                }
                break;
              case "workExperience":
                const experienceResponse = await fetch("/api/experience");
                const experienceData = await experienceResponse.json();
                if (experienceData.success) {
                  setWorkExperience(experienceData.data);
                }
                break;
              case "socialMedia":
                const socialResponse = await fetch("/api/social");
                const socialData = await socialResponse.json();
                if (socialData.success) {
                  setSocialMedia(socialData.data);
                }
                break;
            }
          } else {
            alert(`Failed to save ${type}`);
          }
        }
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item");
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/db?collection=${activeSection}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file);
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = { ...currentItem };

      // Handle file uploads if present
      const fileFields = ["img", "thumbnail", "nameImg", "spareImg"];
      for (const field of fileFields) {
        if (formData[field] instanceof File) {
          const url = await handleFileUpload(formData[field]);
          if (url) formData[field] = url;
        }
      }

      // Handle iconLists for projects
      if (activeSection === "projects" && formData.iconLists) {
        if (typeof formData.iconLists === "string") {
          formData.iconLists = formData.iconLists
            .split(",")
            .map((icon: string) => icon.trim());
        }
      }

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/db?collection=${activeSection}&id=${currentItem._id}`
        : "/api/db";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: activeSection,
          data: formData,
          ...(isEditing && { id: currentItem._id }),
        }),
      });

      const result = await response.json();
      if (result.success) {
        fetchItems();
        setCurrentItem({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
    setIsLoading(false);
  };

  const renderForm = () => {
    const props = {
      onSave: (data: any) => handleSave(activeSection, data),
      onCancel: handleCancel,
    };

    switch (activeSection) {
      case "projects":
        return <ProjectForm project={editingItem} {...props} />;
      case "testimonials":
        return <TestimonialForm testimonial={editingItem} {...props} />;
      case "workExperience":
        return <ExperienceForm experience={editingItem} {...props} />;
      case "navItems":
        return <NavItemForm navItem={editingItem} {...props} />;
      case "gridItems":
        return <GridItemForm gridItem={editingItem} {...props} />;
      case "companies":
        return <CompanyForm company={editingItem} {...props} />;
      case "socialMedia":
        return <SocialMediaForm socialMedia={editingItem} {...props} />;
      case "contacts":
        return (
          <GridForm
            data={contactData}
            onEdit={(item) => handleEdit(item, "contacts")}
            onDelete={(id) => handleDelete(id, "contacts")}
          />
        );
      default:
        return null;
    }
  };

  const renderItems = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-gray-800 p-4 rounded-lg">
            {Object.entries(item).map(([key, value]) => {
              if (key === "_id" || key === "__v") return null;
              return (
                <div key={key} className="mb-2">
                  <span className="text-gray-400">{key}: </span>
                  {typeof value === "string" &&
                  (value.startsWith("http") || value.startsWith("/")) ? (
                    key.includes("img") || key === "thumbnail" ? (
                      <img
                        src={value as string}
                        alt={key}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <a
                        href={value as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400"
                      >
                        {value as string}
                      </a>
                    )
                  ) : (
                    <span className="text-white">{JSON.stringify(value)}</span>
                  )}
                </div>
              );
            })}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setEditingItem(item)}
                className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() =>
                  item._id
                    ? handleDelete(item._id, "projects")
                    : handleDelete(item.id, "projects")
                }
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black-200 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-purple mb-6">Admin Login</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Admin Username"
              value={adminCredentials.username}
              onChange={(e) =>
                setAdminCredentials({
                  ...adminCredentials,
                  username: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={adminCredentials.password}
              onChange={(e) =>
                setAdminCredentials({
                  ...adminCredentials,
                  password: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-black-300 border border-purple/20 focus:border-purple/50 outline-none text-white"
            />
            <button
              type="submit"
              className="w-full bg-purple hover:bg-purple/80 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#1a1d21]">
      {/* Side Navigation */}
      <div className="w-64 bg-[#1a1d21] border-r border-gray-700 p-4">
        <div className="text-2xl font-bold text-white mb-8">Admin Panel</div>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
              activeTab === "projects"
                ? "bg-purple text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaDatabase /> Projects
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
              activeTab === "testimonials"
                ? "bg-purple text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaNewspaper /> Testimonials
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
              activeTab === "companies"
                ? "bg-purple text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaBuilding /> Companies
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
              activeTab === "experience"
                ? "bg-purple text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaBriefcase /> Experience
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
              activeTab === "social"
                ? "bg-purple text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaImages /> Social Media
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors ${
              activeTab === "contacts"
                ? "bg-purple text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FaEnvelope /> Contact Messages
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 mt-auto text-red-500 hover:bg-red-500/10 rounded-lg transition-colors absolute bottom-4"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Project Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Welcome, Admin</span>
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleAdd(activeTab)}
                className="flex items-center gap-2 bg-purple hover:bg-purple/80 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus /> Add New
              </button>
              <button
                onClick={() =>
                  exportToCSV(
                    activeTab === "projects"
                      ? projects
                      : activeTab === "testimonials"
                      ? testimonials
                      : activeTab === "companies"
                      ? companies
                      : activeTab === "experience"
                      ? workExperience
                      : socialMedia,
                    `${activeTab}.csv`
                  )
                }
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>

          {/* Grid Layout for Items */}
          <div
            className={`grid ${
              activeTab === "contacts"
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            } gap-6`}
          >
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 gap-8 w-full">
                {projects.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="bg-[#1e2227] rounded-lg overflow-hidden flex flex-col w-full"
                  >
                    <div className="relative aspect-video">
                      <iframe
                        src={`${item.img}?autoplay=1&loop=1&background=1&muted=1`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-2xl font-medium text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-base mb-4">{item.des}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          {item.iconLists.map((icon, index) => (
                            <img
                              key={index}
                              src={icon}
                              alt=""
                              className="w-8 h-8"
                            />
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(item, "projects")}
                            className="text-purple hover:text-purple/80 p-2 hover:bg-purple/10 rounded flex items-center gap-2"
                          >
                            <FaEdit size={18} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              item._id
                                ? handleDelete(item._id, "projects")
                                : handleDelete(item.id, "projects")
                            }
                            className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded flex items-center gap-2"
                          >
                            <FaTrash size={18} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="grid grid-cols-1 gap-8 w-full">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial._id || index}
                    className="bg-[#1e2227] rounded-lg p-6 w-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">
                          {testimonial.name}
                        </h3>
                        <p className="text-purple text-base">
                          {testimonial.title}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleEdit(testimonial, "testimonials")
                          }
                          className="text-purple hover:text-purple/80 p-2 hover:bg-purple/10 rounded flex items-center gap-2"
                        >
                          <FaEdit size={18} /> Edit
                        </button>
                        <button
                          onClick={() =>
                            testimonial._id
                              ? handleDelete(testimonial._id, "testimonials")
                              : handleDelete(index, "testimonials")
                          }
                          className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded flex items-center gap-2"
                        >
                          <FaTrash size={18} /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#282c34] rounded-lg p-4 mb-4">
                      <p className="text-gray-300 text-lg italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "companies" &&
              companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-[#1e2227] rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <img
                          src={company.img}
                          alt={company.name}
                          className="w-12 h-12 mb-2"
                        />
                        <h3 className="text-white font-medium">
                          {company.name}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(company, "companies")}
                          className="text-purple hover:text-purple/80"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id, "companies")}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <img
                      src={company.nameImg}
                      alt={`${company.name} text`}
                      className="h-8"
                    />
                  </div>
                </div>
              ))}

            {activeTab === "contacts" && (
              <div className="space-y-6">
                {contactData.length === 0 ? (
                  <p className="text-center text-gray-400">No messages yet.</p>
                ) : (
                  contactData.map((contact) => (
                    <div
                      key={contact._id}
                      className="bg-[#1e2227] rounded-lg p-6 space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium text-lg">
                            {contact.name}
                          </h3>
                          <p className="text-purple">{contact.email}</p>
                        </div>
                        <p className="text-gray-400 text-sm">{contact.date}</p>
                      </div>
                      <p className="text-gray-300">{contact.message}</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(contact._id, "contacts")}
                          className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded flex items-center gap-2"
                        >
                          <FaTrash size={18} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={handleCancel}
            ></div>
            <div className="relative bg-[#1e2227] p-8 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {renderForm()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
