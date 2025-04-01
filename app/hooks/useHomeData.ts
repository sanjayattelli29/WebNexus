import { useState, useEffect } from "react";

export interface Project {
  _id: string;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
}

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  title: string;
}

export interface HomeData {
  projects: Project[];
  testimonials: Testimonial[];
  companies: any[];
  workExperience: any[];
  socialMedia: any[];
}

export interface UseHomeDataReturn {
  data: HomeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHomeData(): UseHomeDataReturn {
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
        setData({
          projects: result.data.projects || [],
          testimonials: result.data.testimonials || [],
          companies: result.data.companies || [],
          workExperience: result.data.workExperience || [],
          socialMedia: result.data.socialMedia || [],
        });
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

  return { data, loading, error, refetch: fetchData };
}
