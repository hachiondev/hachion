import React, { useEffect, useState, useMemo } from "react";
import styles from "./LearnSection.module.css";
import checkMark from "../../../../Assets/icons/Checkmark.png";
import person from "../../../../Assets/icons/Person-2.png";
import job from "../../../../Assets/icons/job.png";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";
import { useParams } from "react-router-dom";
import { useToolsByCourse } from "../../../../Api/hooks/CourseApi/useToolsByCourse";
import CardsPagination from "../../../UserPanel/Common/CardsPagination";
import EnquiryForm from "./EnquiryForm";

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
    const [currentStartIndex, setCurrentStartIndex] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(6);
    const [activeTab, setActiveTab] = useState("learn"); // New state for active tab
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

    const paginatedTools = useMemo(() => {
        const startIndex = currentStartIndex - 1;
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
                {/* New Tabbed Navigation */}
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === "learn" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("learn")}
                    >
                        What You’ll Learn
                        {/* {course?.courseName || "this course"} */}
                    </button>

                    <button
                        className={`${styles.tab} ${activeTab === "prereq" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("prereq")}
                    >
                        Prerequisites
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "who" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("who")}
                    >
                        Who This Course Is For
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "career" ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab("career")}
                    >

                        {/* {course?.courseName || "This Course"} */}
                        Career Opportunities

                    </button>

                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {/* What You'll Learn Tab */}
                    {activeTab === "learn" && (
                        <div className={styles.tabPane}>
                            <ul className={styles.lsbullets}>
                                {(showAll.learn ? whatYouWillLearnItems : whatYouWillLearnItems.slice(0, 8)).map((item, index) => (
                                    <li key={item}  style={{ "--i": index }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            {whatYouWillLearnItems.length > 8 && (
                                <button
                                    type="button"
                                    className={styles.readMoreBtn}
                                    onClick={() => toggleShowAll("learn")}
                                >
                                    {showAll.learn ? "Read Less ↑" : "Read More ↓"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Prerequisites Tab */}
                    {activeTab === "prereq" && (
                        <div className={styles.tabPane}>
                            <ul className={styles.lsbullets}>
                                {(showAll.prereq ? prerequisites : prerequisites.slice(0, 8)).map(
                                    (p, idx) => (
                                        <li key={idx}>{p}</li>
                                    )
                                )}
                            </ul>
                            {prerequisites.length > 8 && (
                                <button
                                    type="button"
                                    className={styles.readMoreBtn}
                                    onClick={() => toggleShowAll("prereq")}
                                >
                                    {showAll.prereq ? "Read Less ↑" : "Read More ↓"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Who This Course Is For Tab */}
                    {activeTab === "who" && (
                        <div className={styles.tabPane}>
                            <ul className={styles.lsbullets}>
                                {Array.isArray(whoThisCourseIsForItems) && whoThisCourseIsForItems.length > 0 ? (
                                    (showAll.who
                                        ? whoThisCourseIsForItems
                                        : whoThisCourseIsForItems.slice(0, 8)
                                    ).map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))
                                ) : (
                                    <li className={styles.noData}>No data available</li>
                                )}
                            </ul>
                            {whoThisCourseIsForItems.length > 8 && (
                                <button
                                    type="button"
                                    className={styles.readMoreBtn}
                                    onClick={() => toggleShowAll("who")}
                                >
                                    {showAll.who ? "Read Less ↑" : "Read More ↓"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Career Opportunities Tab */}
                    {activeTab === "career" && (
                        <div className={styles.tabPane}>
                            <div className={styles.lspills}>
                                {careerItems.length > 0 ? (
                                    <>
                                        {(showAll.career ? careerItems : careerItems.slice(0, 8)).map(
                                            (p, index) => (
                                                <span key={index} className={styles.lspill} style={{ "--i": index }}>
                                                    {p}
                                                </span>
                                            )
                                        )}
                                        {careerItems.length > 8 && (
                                            <div className={styles.readMoreWrapper}>
                                                <button
                                                    type="button"
                                                    className={styles.readMoreBtn}
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
                        </div>
                    )}
                </div>

                {/* Tools Cover Section - Remains Below Tabs */}
                <div className={styles.lstools}>
                    <div className={styles.pagiGroup}>
                        <h3 className={styles.lstoolstitle}>
                            Tools Cover in {course?.courseName || "this course"}
                        </h3>

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
                    )}
                </div>
            </div>
        </section>
    );
}