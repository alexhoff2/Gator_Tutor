"use client";

import { useEffect, useState, useCallback } from "react";
import type { TutorPost, TutorPostsResponse } from "@/lib/types/tutorPost";
import { useURLState } from "@/lib/context/url-state-context";

/**
 * Tutor Posts Hook 👩‍🏫
 *
 * Why two fetches?
 * --------------
 * 1. ALL posts: Needed to calculate price ranges for filters
 * 2. FILTERED posts: What the user actually sees based on their search
 *
 * The flow:
 * 1. Component mounts -> Fetch everything to set up filters
 * 2. User searches -> Fetch only matching posts
 * 3. Keep track of loading states and pages for smooth UX
 */
export function useTutorPosts() {
  // Core post data
  const [posts, setPosts] = useState<TutorPost[]>([]); // Filtered posts
  const [allPosts, setAllPosts] = useState<TutorPost[]>([]); // All posts (for filters)

  // Pagination tracking
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Price range for filters
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });

  const { getParam } = useURLState();
  
  const searchTerm = getParam("q");
  const subject = getParam("subject");
  const minRate = getParam("minRate");
  const maxRate = getParam("maxRate");
  const page = getParam("page") ?? "1";

  // First fetch: Get ALL posts to set up our filters
  useEffect(() => {
    async function fetchAllPosts() {
      try {
        const res = await fetch("/api/tutors");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: TutorPostsResponse = await res.json();
        setAllPosts(data.posts);

        if (data.posts.length > 0) {
          const rates = data.posts.map((post) => Number(post.hourlyRate));
          setPriceRange({
            min: Math.min(...rates),
            max: Math.max(...rates),
          });
        }
      } catch (err) {
        console.error("Error fetching all posts:", err);
      }
    }

    fetchAllPosts();
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!initialLoad) setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        ...(searchTerm && { q: searchTerm }),
        ...(subject && { subject }),
        ...(minRate && { minRate }),
        ...(maxRate && { maxRate }),
        page,
      });

      const res = await fetch(`/api/tutors?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data: TutorPostsResponse = await res.json();
      setPosts(data.posts);
      setTotalCount(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [searchTerm, subject, minRate, maxRate, page, initialLoad]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    allPosts,
    total: totalCount,
    pages: totalPages,
    loading,
    error,
    priceRange,
    initialLoad,
  };
}
