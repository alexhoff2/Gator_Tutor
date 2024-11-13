//Unique id for each subject and name of subject
export interface Subject {
  id: number;
  subjectName: string;
}

//Currently taught subjects and the amount of tutors teaching it
export interface ActiveSubject extends Subject {
  tutorCount: number;
}
