import { useEffect, useState } from "react";
import { Subject, ActiveSubject } from "@/lib/types/subject";

//Manages the different views of our subjects and active subjects
export function useSubjects() {
  //Track both lists plus errors that might occur and default to empty array state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjects, setActiveSubjects] = useState<ActiveSubject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        //Fetch both subjects and active subjects
        const [subjectsRes, activeSubjectsRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/subjects/active"),
        ]);

        if (!subjectsRes.ok || !activeSubjectsRes.ok) {
          //Check if any failed
          throw new Error("Failed to fetch data");
        }

        //Transform responses to usable data
        const subjectsData: Subject[] = await subjectsRes.json();
        const activeSubjectsData: ActiveSubject[] =
          await activeSubjectsRes.json();

        //Update states
        setSubjects(subjectsData);
        setActiveSubjects(activeSubjectsData);
      } catch (error) {
        setError((error as Error).message);
      }
    }

    //Starts fetch
    fetchData();
  }, []);
  return { subjects, activeSubjects, error };
}
