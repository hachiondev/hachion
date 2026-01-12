import React, { useEffect, useState, useMemo } from "react";
import styles from "./LearnSection.module.css";
import checkMark from "../../../../Assets/icons/Checkmark.png";
import person from "../../../../Assets/icons/Person-2.png";
import job from "../../../../Assets/icons/job.png";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";
import { useParams } from "react-router-dom";
import { useToolsByCourse } from "../../../../Api/hooks/CourseApi/useToolsByCourse";
import CardsPagination from "../../../UserPanel/Common/CardsPagination";

const CheckCircle = () => (
    <img src={checkMark} alt="check" className={styles.lsicon} />
);
const UserGroup = () => (
    <img src={person} alt="person" className={styles.lsicon} />
);
const Briefcase = () => (
    <img src={job} alt="job" className={styles.lsicon} />
);

export default function LearnSection() {
    const { courseName: courseNameSlug } = useParams();
    const [currentStartIndex, setCurrentStartIndex] = useState(1); // Starting card index (1-based)
    const [cardsPerPage, setCardsPerPage] = useState(6);
    const [showAll, setShowAll] = useState({
        prereq: false,
        learn: false,
        who: false,
        career: false,
    });
    const courseName = courseNameSlug
        ? decodeURIComponent(courseNameSlug)
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase()
        : "";

    const { data: course } = useCourseByName(courseName);
    const { data: allTools = [], isLoading } = useToolsByCourse(courseName);


    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w <= 768) setCardsPerPage(2);
            else if (w <= 1024) setCardsPerPage(3);
            else setCardsPerPage(6);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);



    // Calculate paginated tools - use currentStartIndex (1-based)
    const paginatedTools = useMemo(() => {
        const startIndex = currentStartIndex - 1; // Convert to 0-based
        const endIndex = startIndex + cardsPerPage;
        return allTools.slice(startIndex, endIndex);
    }, [allTools, currentStartIndex, cardsPerPage]);

    const toggleShowAll = (key) => {
        setShowAll((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };


    const prerequisites =
        course?.prerequisities?.trim()
            ? course.prerequisities
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            : [
                "Basic computer skills and internet navigation",
                "No programming experience required - we start from scratch",
                "Access to a computer with internet connection",
            ];

    const whoThisCourseIsForItems = (course?.whoIsThisCourseFor || "")
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

        const careerItems =
  course?.careerOpportunities
    ?.split("\n")
    .map((item) => item.trim())
    .filter(Boolean) || [];


    // Reset to first card when tools change or cards per page changes
    useEffect(() => {
        setCurrentStartIndex(1);
    }, [allTools, cardsPerPage]);

    const defaultWhatYouWillLearn = [
        "Build responsive websites using HTML5, CSS3, and JavaScript",
        "Master React.js for creating dynamic user interfaces",
        "Develop full-stack applications with Node.js and Express",
        "Work with databases using MongoDB and SQL"
    ];

    const apiWhatYouWillLearn = course?.whatYouWillLearn
        ?.split("\n")
        .map((item) => item.replace("🔹", "").trim())
        .filter((item) => item !== "");

    const whatYouWillLearnItems =
        apiWhatYouWillLearn && apiWhatYouWillLearn.length > 0
            ? apiWhatYouWillLearn
            : defaultWhatYouWillLearn;

    return (
        <section className={styles.lswrap}>
            <div className="container">
                <div className={styles.lsgrid}>
                    {/* LEFT: What you'll learn + prerequisites */}
                    <div>
                        <h2 className={styles.lsh2}>What You'll Learn</h2>

                        <ul className={styles.lslist}>
                            {(showAll.learn ? whatYouWillLearnItems : whatYouWillLearnItems.slice(0, 4)).map((item,index) => (
                                <li key={item} className={styles.lslistitem} style={{ "--i": index }}>
                                    <CheckCircle />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        {whatYouWillLearnItems.length > 4 && (
                            <button
                                type="button"
                                className={styles.readMoreBtn}
                                onClick={() => toggleShowAll("learn")}
                            >
                                {showAll.learn ? "Read Less ↑" : "Read More ↓"}
                            </button>
                        )}

                        <div className={styles.lspre}>
                            <h3>Prerequisites</h3>

                            <ul className={styles.lsbullets}>
                                {(showAll.prereq ? prerequisites : prerequisites.slice(0, 4)).map(
                                    (p, idx) => (
                                        <li key={idx}>{p}</li>
                                    )
                                )}
                            </ul>

                            {prerequisites.length > 4 && (
                                <button
                                    type="button"
                                    className={styles.readMoreBtn}
                                    onClick={() => toggleShowAll("prereq")}
                                >
                                    {showAll.prereq ? "Read less ↑" : "Read more ↓"}
                                </button>
                            )}

                        </div>

                    </div>

                    {/* RIGHT: two cards */}
                    <div className={styles.lsright}>
                        <div className={styles.lscard}>
                            <div className={styles.lscardhead}>
                                <span className={styles.lscardico}>
                                    <UserGroup />
                                </span>
                                <h3>Who this course is for</h3>
                            </div>
                            <ul className={styles.lscardbullets}>
  {Array.isArray(whoThisCourseIsForItems) && whoThisCourseIsForItems.length > 0 ? (
    (showAll.who
      ? whoThisCourseIsForItems
      : whoThisCourseIsForItems.slice(0, 4)
    ).map((item, index) => (
      <li key={index} >{item}</li>
    ))
  ) : (
    <li className={styles.noData}>No data available</li>
  )}
</ul>

                            {whoThisCourseIsForItems.length > 4 && (
                                <button
                                    type="button"
                                    className={styles.readMoreBtn2}
                                    onClick={() => toggleShowAll("who")}
                                >
                                    {showAll.who ? "Read Less ↑" : "Read More ↓"}
                                </button>
                            )}

                        </div>


                        <div className={styles.lscard2}>
                            <div className={styles.lscardhead}>
                                <span className={styles.lscardico}>
                                    <Briefcase />
                                </span>
                                <h3>Career Opportunities</h3>
                            </div>

                            <p className={styles.lsmuted}>Job Roles After Completion:</p>

<div className={styles.lspills}>
  {careerItems.length > 0 ? (
    <>
      {(showAll.career ? careerItems : careerItems.slice(0, 4)).map(
        (p, index) => (
          <span key={index} className={styles.lspill} style={{ "--i": index }}>
            {p}
          </span>
        )
      )}

      {careerItems.length > 4 && (
        <div className={styles.readMoreWrapper}>
          <button
            type="button"
            className={`${styles.readMoreBtn2} ${styles.careerReadMoreBtn}`}
            onClick={() => toggleShowAll("career")}
          >
            {showAll.career ? "Read Less ↑" : "Read More ↓"}
          </button>
        </div>
      )}
    </>
  ) : (
    <p className="text-dark">No data available</p>
  )}
</div>





                            {/* <div className={styles.lssalary}>
                                <div className={styles.lssalarytitle}>Average Salary Range</div>
                                <div className={styles.lssalaryval}>  {course?.avarageSalaryRange?.trim() || "INR 65K - INR 95K"}</div>
                            </div> */}


                        </div>
                    </div>
                </div>

                {/* Tools Cover */}
                <div className={styles.lstools}>
                    <div className={styles.pagiGroup}>
                        <h3 className={styles.lstoolstitle}>Tools Cover</h3>
                        {allTools.length > cardsPerPage && (
                            <div className={styles.cardPaginationContainer}>
                                <CardsPagination
                                    currentPage={currentStartIndex}
                                    totalCards={allTools.length}
                                    cardsPerPage={cardsPerPage}
                                    onPageChange={(newStartIndex) => setCurrentStartIndex(newStartIndex)}
                                />
                            </div>
                        )}
                    </div>
                    {isLoading ? (
                        <p>Loading tools...</p>
                    ) : allTools.length === 0 ? (
                        <p>No tools available for this course.</p>
                    ) : (
                        <>
                            <div className={styles.lstoolsgrid}>
                                {paginatedTools.map((tool) => (
                                    <div key={tool.toolsName} className={styles.lstoolcard}>
                                        <div className={styles.lstoolicon}>
                                            <img
                                                src={`https://api.test.hachion.co/uploads/test/tools_images/${tool.imageUrl}`}
                                                alt={tool.toolsName}
                                                className={styles.lstooliconimg}
                                            />
                                        </div>

                                        <div className={styles.lstoolname}>
                                            {tool.toolsName}
                                        </div>

                                        <a
                                            className={styles.lstoollink}
                                            href={tool.toolsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Download link
                                        </a>
                                    </div>
                                ))}
                            </div>

                        </>
                    )}
                </div>

            </div>
        </section>
    );
}