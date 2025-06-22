import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const WorkExperience = () => {
  const workExperience = [
  {
      id: 1,
      role: "Full Stack Software Developer Intern",
      link: "https://mentorpal.ai",
      company: "MentorPal",
      time: "March 2024 - Present",
      description:
        "Developed and maintained Hiring-ATS, Assessment system using React.js, Node.js, and Tailwind CSS, enabling streamlined candidate management and evaluation. Assisted in deploying applications to production environments using AWS services (AWS EC2, AWS S3, ELASTIC IP).",
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-16 max-w-screen-2xl w-full mx-auto"
    >
      <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--text-black-700)] mb-6 flex items-center gap-2">
        <Briefcase className="w-6 h-6" /> Work Experience
      </h3>
      <div className="relative pl-8">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--text-black-700)]"></div>
        {workExperience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="mb-8 flex items-start gap-4"
          >
            {/* dot, will animate later */}
            {/* <div className="absolute w-4 h-4 bg-[var(--text-black-700)] rounded-full left-0 translate-x-1/2 mt-2" /> */}
            <div className="flex-1">
              <h4 className="text-2xl font-medium text-[var(--text-black-900)] mb-2">
                {exp.role} @{" "}
                <Link className="hover:underline text-blue-500" to={exp.link} target="_blank" rel="noopener noreferrer">
                  {exp.company}
                </Link>
              </h4>
              <p className="text-sm text-[var(--text-black-700)] mb-4">
                {exp.time}
              </p>
              <ul className="list-disc pl-5 text-[var(--text-black-700)]">
                {exp.description.split('. ').filter(line => line.trim()).map((line, i) => (
                  <li key={i} className="mb-1">{line}{!line.endsWith('.') ? '.' : ''}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default WorkExperience;