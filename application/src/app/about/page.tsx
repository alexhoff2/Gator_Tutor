import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

/**
 * About Page Component
 *
 * Displays information about the GatorTutor platform, the team, and the project.
 * Uses a single card to contain all content, with a modern and clean design.
 */
export default function AboutPage() {
  return (
    <main className="container py-12 px-4 mx-auto">
      <Card className="space-y-16 p-8 md:p-12">
        {/* About GatorTutor Section */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-[#4B2E83]">
            About GatorTutor
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            GatorTutor is an innovative tutoring platform exclusively for SFSU
            students. Our mission is to connect students with expert tutors to
            enhance academic success and foster a collaborative learning
            environment.
          </p>
          <p className="text-lg text-gray-500">
            This project is part of the SFSU Software Engineering course CSC
            648-848, Fall 2024, demonstrating our team's expertise in modern web
            development and collaborative software engineering.
          </p>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-[#4B2E83]">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <TeamMember
              link="/alex-hoff"
              image="/images/Alexander-Hoff.png"
              name="Alex Hoff"
              role="Team Lead"
            />
            <TeamMember
              link="/austin-ng"
              image="/images/Austin-Ng.png"
              name="Austin Ng"
              role="Backend Lead"
            />
            <TeamMember
              link="/jack-richards"
              image="/images/Jack-Richards.png"
              name="Jack Richards"
              role="Front-End"
            />
            <TeamMember
              link="/dylan-lee"
              image="/images/Dylan-Lee.png"
              name="Dylan Lee"
              role="GitHub Master"
            />
            <TeamMember
              link="/dalan-moore"
              image="/images/Dalan-Moore.png"
              name="Dalan Moore"
              role="Front-End"
            />
          </div>
        </section>
      </Card>
    </main>
  );
}

interface TeamMemberProps {
  link: string;
  image: string;
  name: string;
  role: string;
}

/**
 * Team Member Subcomponent
 *
 * Displays a single team member's information with a link to their profile.
 */
function TeamMember({ link, image, name, role }: TeamMemberProps) {
  return (
    <Link
      href={link}
      className="group flex flex-col items-center text-center hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="relative w-48 h-64 rounded-2xl overflow-hidden mb-4 shadow-lg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-[#4B2E83]">{name}</h3>
      <p className="text-md text-gray-600">{role}</p>
    </Link>
  );
}
