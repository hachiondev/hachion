"use client";

import { useRouter } from "next/navigation";
import "./Blogs.css";
import WorkshopEntriesCard from "./WorkshopEntriesCard";
import { useWorkshops } from "@/Api/hooks/WorkshopApi/useWorkshops";
import { slugifyWorkshopTitle } from "@/lib/workshopSlug";

const EMPTY_ARRAY = [];

const WorkshopEntries = () => {
  const router = useRouter();
  const { data: workshop = EMPTY_ARRAY } = useWorkshops();

  return (
    <div className="workshop-entries">
      {workshop.length > 0 ? (
        [...workshop].reverse().map((entry) => (
          <WorkshopEntriesCard
            key={entry.id}
            banner_image={`https://api.hachion.co/${entry.banner_image}`}
            title={entry.title}
            date={(() => {
              if (!entry?.date) return "Loading...";
              const d = new Date(entry.date);
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              const yyyy = d.getFullYear();
              return `${mm}-${dd}-${yyyy}`;
            })()}
            time={entry.time}
            timeZone={entry.time_zone}
            onClick={() => {
              window.scrollTo(0, 0);
              router.push(`/workshop/${slugifyWorkshopTitle(entry.title)}`);
            }}
          />
        ))
      ) : (
        <p>Loading Workshop entries...</p>
      )}
    </div>
  );
};

export default WorkshopEntries;
