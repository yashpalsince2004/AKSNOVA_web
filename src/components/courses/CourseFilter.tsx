import { useState } from "react";

const IT_COURSES = [
  { name: "Artificial Intelligence", slug: "data-science-ai" },
  { name: "Machine Learning", slug: "data-science-ai" },
  { name: "Data Science", slug: "data-science-ai" },
  { name: "Data Analytics", slug: "data-science-ai" },
  { name: "Full Stack Development", slug: "full-stack-development" },
  { name: "Web Development", slug: "full-stack-development" },
  { name: "Cloud Computing", slug: "cloud-devops" },
  { name: "DevOps", slug: "cloud-devops" },
  { name: "Cyber Security", slug: "cyber-security" },
  { name: "Ethical Hacking", slug: "cyber-security" },
  { name: "Networking", slug: "cyber-security" },
  { name: "Python", slug: "full-stack-development" },
  { name: "Java", slug: "full-stack-development" },
  { name: "Generative AI", slug: "data-science-ai" },
  { name: "Software Testing", slug: "full-stack-development" },
  { name: "Digital Marketing", slug: "full-stack-development" },
  { name: "UI/UX", slug: "graphic-design" },
  { name: "Database & SQL", slug: "full-stack-development" },
];

const NON_IT_COURSES = [
  { name: "Accounting & Finance", slug: "accounting-tally-gst" },
  { name: "Tally Prime", slug: "accounting-tally-gst" },
  { name: "GST Compliance", slug: "accounting-tally-gst" },
  { name: "Advanced Excel", slug: "accounting-tally-gst" },
  { name: "Graphic Design", slug: "graphic-design" },
  { name: "Adobe Photoshop", slug: "graphic-design" },
  { name: "Adobe Illustrator", slug: "graphic-design" },
  { name: "Figma UI Graphics", slug: "graphic-design" },
  { name: "Business Communication", slug: "accounting-tally-gst" },
  { name: "Office Productivity", slug: "accounting-tally-gst" },
];

export default function CourseFilter() {
  const [activeTab, setActiveTab] = useState<"IT" | "NON_IT">("IT");
  const currentList = activeTab === "IT" ? IT_COURSES : NON_IT_COURSES;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Programs</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            Choose your career path
          </h2>
          <p className="mt-2 text-muted-foreground">
            Build practical, job-ready skills through mentor-led training.
          </p>
        </div>

        <div className="flex items-center rounded-2xl bg-secondary p-1">
          <button
            type="button"
            onClick={() => setActiveTab("IT")}
            className={`rounded-xl px-5 py-2 text-sm font-bold transition-colors ${
              activeTab === "IT"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            IT & Technology
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("NON_IT")}
            className={`rounded-xl px-5 py-2 text-sm font-bold transition-colors ${
              activeTab === "NON_IT"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Non-IT & Professional
          </button>
        </div>
      </div>

      {/* Animated program chips */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        {currentList.map((c, i) => (
          <a
            key={c.name}
            href={`/courses/${c.slug}`}
            style={{ animationDelay: `${i * 20}ms` }}
            className="rise flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-brand hover:bg-brand/10 hover:text-brand"
          >
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}
