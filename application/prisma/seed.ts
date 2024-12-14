const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const subjects = [
  { id: 1, subjectName: "Accounting" },
  { id: 2, subjectName: "Africana Studies" },
  { id: 3, subjectName: "All University" },
  { id: 4, subjectName: "American Indian Studies" },
  { id: 5, subjectName: "American Studies" },
  { id: 6, subjectName: "Anthropology" },
  { id: 7, subjectName: "Apparel Design & Merchandising" },
  { id: 8, subjectName: "Arabic" },
  { id: 9, subjectName: "Art" },
  { id: 10, subjectName: "Art History" },
  { id: 11, subjectName: "Asian American Studies" },
  { id: 12, subjectName: "Astronomy" },
  { id: 13, subjectName: "Athletics" },
  { id: 14, subjectName: "Biology" },
  { id: 15, subjectName: "Broadcast and Electronic Communication Arts" },
  { id: 16, subjectName: "Business" },
  { id: 17, subjectName: "Chemistry" },
  { id: 18, subjectName: "Child & Adolescent Development" },
  { id: 19, subjectName: "Chinese" },
  { id: 20, subjectName: "Cinema" },
  { id: 21, subjectName: "Classical Archaeology" },
  { id: 22, subjectName: "Classics" },
  { id: 23, subjectName: "Clinical Laboratory Science" },
  { id: 24, subjectName: "Comic Studies" },
  { id: 25, subjectName: "Communication Studies" },
  { id: 26, subjectName: "Comparative World Literature" },
  { id: 27, subjectName: "Computer Science" },
  { id: 28, subjectName: "Counseling" },
  { id: 29, subjectName: "Creative Writing" },
  { id: 30, subjectName: "Credit for Prior Experiential Learning" },
  { id: 31, subjectName: "Criminal Justice Studies" },
  { id: 32, subjectName: "Critical Social Thought" },
  { id: 33, subjectName: "Dance" },
  { id: 34, subjectName: "Decision Sciences" },
  { id: 35, subjectName: "Design" },
  { id: 36, subjectName: "Early Start English" },
  { id: 37, subjectName: "Early Start Math" },
  { id: 38, subjectName: "Earth Sciences" },
  { id: 39, subjectName: "Economics" },
  { id: 40, subjectName: "Educational Administration" },
  { id: 41, subjectName: "Educational Leadership" },
  { id: 42, subjectName: "Education" },
  { id: 43, subjectName: "Elementary Education" },
  { id: 44, subjectName: "Engineering" },
  { id: 45, subjectName: "English" },
  { id: 46, subjectName: "Environmental Studies" },
  { id: 47, subjectName: "Ethnic Studies" },
  { id: 48, subjectName: "Experimental College" },
  { id: 49, subjectName: "Family & Consumer Sciences" },
  { id: 50, subjectName: "Finance" },
  { id: 51, subjectName: "French" },
  { id: 52, subjectName: "Geography and Environment" },
  { id: 53, subjectName: "German" },
  { id: 54, subjectName: "Gerontology" },
  { id: 55, subjectName: "Global Peace Studies" },
  { id: 56, subjectName: "Greek" },
  { id: 57, subjectName: "Health and Social Sciences" },
  { id: 58, subjectName: "Hebrew" },
  { id: 59, subjectName: "History" },
  { id: 60, subjectName: "Holistic Health" },
  { id: 61, subjectName: "Hospitality & Tourism Management" },
  { id: 62, subjectName: "Humanities" },
  { id: 63, subjectName: "Information Systems" },
  { id: 64, subjectName: "Instructional Technologies" },
  { id: 65, subjectName: "Interdisciplinary Studies Education" },
  { id: 66, subjectName: "Interior Design" },
  { id: 67, subjectName: "International Business" },
  { id: 68, subjectName: "International Relations" },
  { id: 69, subjectName: "Italian" },
  { id: 70, subjectName: "Japanese" },
  { id: 71, subjectName: "Jewish Studies" },
  { id: 72, subjectName: "Journalism" },
  { id: 73, subjectName: "Kinesiology" },
  { id: 74, subjectName: "Korean" },
  { id: 75, subjectName: "Labor Studies" },
  { id: 76, subjectName: "Latina/o Studies" },
  { id: 77, subjectName: "Latin" },
  { id: 78, subjectName: "Liberal & Creative Arts" },
  { id: 79, subjectName: "Liberal Studies" },
  { id: 80, subjectName: "Library Education" },
  { id: 81, subjectName: "Management" },
  { id: 82, subjectName: "Marine Science" },
  { id: 83, subjectName: "Marketing" },
  { id: 84, subjectName: "Mathematics" },
  { id: 85, subjectName: "Middle East & Islamic Studies" },
  { id: 86, subjectName: "Modern Greek Studies" },
  { id: 87, subjectName: "Modern Languages and Literatures" },
  { id: 88, subjectName: "Museum Studies" },
  { id: 89, subjectName: "Music" },
  { id: 90, subjectName: "Nursing" },
  { id: 91, subjectName: "Nutrition & Dietetics" },
  { id: 92, subjectName: "Persian" },
  { id: 93, subjectName: "Philosophy" },
  { id: 94, subjectName: "Physical Therapy" },
  { id: 95, subjectName: "Physics" },
  { id: 96, subjectName: "Political Science" },
  { id: 97, subjectName: "Project Rebound" },
  { id: 98, subjectName: "Psychology" },
  { id: 99, subjectName: "Public Administration" },
  { id: 100, subjectName: "Public Health" },
  { id: 101, subjectName: "Race and Resistance Studies" },
  { id: 102, subjectName: "Recreation, Parks, and Tourism" },
  { id: 103, subjectName: "Religious Studies" },
  { id: 104, subjectName: "Russian" },
  { id: 105, subjectName: "Science" },
  { id: 106, subjectName: "Secondary Education" },
  { id: 107, subjectName: "Sexuality Studies" },
  { id: 108, subjectName: "Social Work" },
  { id: 109, subjectName: "Sociology" },
  { id: 110, subjectName: "Spanish" },
  { id: 111, subjectName: "Special Education" },
  { id: 112, subjectName: "Speech, Language & Hearing Sciences" },
  { id: 113, subjectName: "Theatre Arts" },
  { id: 114, subjectName: "Urban Studies and Planning" },
  { id: 115, subjectName: "Women and Gender Studies" },
];

const users = [
  {
    email: "mei.zhang@sfsu.edu",
    password: bcrypt.hashSync("password123", 10),
    tutorPost: {
      create: {
        displayName: "Mei Zhang",
        bio: "Mathematics and Statistics expert. I help students understand complex mathematical concepts through real-world applications.",
        availability: {
          mon: false,
          tue: true,
          wed: true,
          thu: true,
          fri: false,
          sat: true,
          sun: false,
        },
        hourlyRate: 32.0,
        contactInfo: "415-555-0105",
        profilePhoto: "/uploads/images/tutor6.jpg",
        profileVideo: "/uploads/videos/profileIntro.mp4",
        resumePdf: "/uploads/pdfs/cvExample.pdf",
        experience: "5 years of mathematics tutoring",
      },
    },
  },
  {
    email: "sofia.martinez@sfsu.edu",
    password: bcrypt.hashSync("password123", 10),
    tutorPost: {
      create: {
        displayName: "Sofia Martinez",
        bio: "Chemistry and Biology tutor with pre-med background. I specialize in helping students prepare for their MCAT and science courses.",
        availability: {
          mon: true,
          tue: false,
          wed: true,
          thu: false,
          fri: true,
          sat: true,
          sun: false,
        },
        hourlyRate: 35.0,
        contactInfo: "415-555-0104",
        profilePhoto: "/uploads/images/tutor5.jpg",
        profileVideo: "/uploads/videos/profileIntro.mp4",
        resumePdf: "/uploads/pdfs/cvExample.pdf",
        experience: "3 years of science tutoring",
      },
    },
  },
  {
    email: "alex.schmidt@sfsu.edu",
    password: bcrypt.hashSync("password123", 10),
    tutorPost: {
      create: {
        displayName: "Alex Schmidt",
        bio: "Bilingual tutor specializing in Spanish and English Literature. I make learning languages fun and engaging!",
        availability: {
          mon: true,
          tue: true,
          wed: false,
          thu: true,
          fri: true,
          sat: false,
          sun: false,
        },
        hourlyRate: 28.0,
        contactInfo: "415-555-0103",
        profilePhoto: "/uploads/images/tutor4.jpg",
        profileVideo: "/uploads/videos/profileIntro.mp4",
        resumePdf: "/uploads/pdfs/cvExample.pdf",
        experience: "4 years of language tutoring",
      },
    },
  },
  {
    email: "james.wilson@sfsu.edu",
    password: bcrypt.hashSync("password123", 10),
    tutorPost: {
      create: {
        displayName: "James Wilson",
        bio: "Computer Science graduate student with a passion for teaching programming and software development concepts.",
        availability: {
          mon: false,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: false,
          sun: false,
        },
        hourlyRate: 30.0,
        contactInfo: "415-555-0102",
        profilePhoto: "/uploads/images/tutor3.jpg",
        profileVideo: "/uploads/videos/profileIntro.mp4",
        resumePdf: "/uploads/pdfs/cvExample.pdf",
        experience: "2 years of teaching assistant experience",
      },
    },
  },
  {
    email: "raj.patel@sfsu.edu",
    password: bcrypt.hashSync("password123", 10),
    tutorPost: {
      create: {
        displayName: "Raj Patel",
        bio: "Experienced tutor specializing in Mathematics and Physics. I have helped numerous students improve their grades and understanding of complex concepts.",
        availability: {
          mon: true,
          tue: true,
          wed: true,
          thu: false,
          fri: false,
          sat: true,
          sun: false,
        },
        hourlyRate: 25.0,
        contactInfo: "415-555-0101",
        profilePhoto: "/uploads/images/tutor2.jpg",
        profileVideo: "/uploads/videos/profileIntro.mp4",
        resumePdf: "/uploads/pdfs/cvExample.pdf",
        experience: "3 years of tutoring experience",
      },
    },
  },
];

async function clearDatabase() {
  console.log("Clearing database...");
  // Delete in order to respect foreign key constraints
  await prisma.tutorSubject.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.tutorPost.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.subject.deleteMany({});
  console.log("Database cleared.");
}

async function main() {
  // Check if --fresh flag is present
  const isFresh = process.argv.includes("--fresh");

  if (isFresh) {
    await clearDatabase();
  }

  console.log("Start seeding...");

  // First, check if subjects already exist
  const existingSubjects = await prisma.subject.findMany();
  if (existingSubjects.length === 0) {
    console.log("Seeding subjects...");
    await prisma.subject.createMany({
      data: subjects,
      skipDuplicates: true,
    });
  } else {
    console.log("Subjects already exist, skipping...");
  }

  // Create a map to store email -> tutorPost ID mapping
  const tutorPostIds = new Map();

  // Check and seed users
  console.log("Seeding users and tutor posts...");
  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { tutorPost: true },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password,
          tutorPost: {
            create: userData.tutorPost.create,
          },
        },
        include: { tutorPost: true },
      });
      console.log(`Created user: ${userData.email}`);
      tutorPostIds.set(userData.email, newUser.tutorPost.id);
    } else {
      console.log(`User ${userData.email} already exists, skipping...`);
      if (existingUser.tutorPost) {
        tutorPostIds.set(userData.email, existingUser.tutorPost.id);
      }
    }
  }

  // Updated tutor subjects with correct IDs
  const updatedTutorSubjects = [
    { tutorId: tutorPostIds.get("mei.zhang@sfsu.edu"), subjectId: 84 }, // Mathematics
    { tutorId: tutorPostIds.get("sofia.martinez@sfsu.edu"), subjectId: 17 }, // Chemistry
    { tutorId: tutorPostIds.get("alex.schmidt@sfsu.edu"), subjectId: 110 }, // Spanish
    { tutorId: tutorPostIds.get("james.wilson@sfsu.edu"), subjectId: 27 }, // Computer Science
    { tutorId: tutorPostIds.get("raj.patel@sfsu.edu"), subjectId: 84 }, // Mathematics
  ];

  // Check and seed tutor subjects
  console.log("Seeding tutor subjects...");
  for (const tutorSubject of updatedTutorSubjects) {
    const existingTutorSubject = await prisma.tutorSubject.findFirst({
      where: {
        tutorId: tutorSubject.tutorId,
        subjectId: tutorSubject.subjectId,
      },
    });

    if (!existingTutorSubject) {
      await prisma.tutorSubject.create({
        data: tutorSubject,
      });
      console.log(
        `Created tutor subject relation: Tutor ${tutorSubject.tutorId} - Subject ${tutorSubject.subjectId}`
      );
    } else {
      console.log(`Tutor subject relation already exists, skipping...`);
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
