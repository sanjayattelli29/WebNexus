import { useState, useEffect } from "react";

interface Project {
  _id: string;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
}

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  title: string;
}

interface HomeData {
  projects: Project[];
  testimonials: Testimonial[];
  companies: any[];
  workExperience: any[];
  socialMedia: any[];
}

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/home");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching home data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}
