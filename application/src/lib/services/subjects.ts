import { prisma } from "@/lib/prisma";
import type { Subject, ActiveSubject } from "@/lib/types/subject";

//Gets all subject from database
export async function getAllSubjects(): Promise<Subject[]> {
  return await prisma.subject.findMany({
    select: {
      id: true,
      subjectName: true,
    },
    orderBy: {
      subjectName: "asc", //Alphabetically sorted
    },
  });
}

//Get all actively taught subjects
export async function getActiveSubjects(): Promise<ActiveSubject[]> {
  const activeSubjects = await prisma.subject.findMany({
    select: {
      id: true,
      subjectName: true,
      tutorSubjects: {
        select: {
          tutorId: true, //Counting how many tutors
        },
      },
    },
    where: {
      tutorSubjects: {
        some: {}, //Filter to only subjects that have tutors
      },
    },
    orderBy: {
      subjectName: "asc",
    },
  });

  //Include tutor count
  return activeSubjects.map((subject) => ({
    id: subject.id,
    subjectName: subject.subjectName,
    tutorCount: subject.tutorSubjects.length,
  }));
}
