import PopupBanner from "./PopupBanner";
import Banner from "./HomePage/HomeBannerSection/Banner";
import HomeHashScroll from "./HomeHashScroll";
import Association from "./Association";
import Corporate from "./HomePage/CorporateSection/Corporate";
import WhyChoose from "./WhyChoose";
import LimitedDeals from "./HomePage/LimitedSection/LimitedDeals";
import MeetInstructorBanner from "./MeetInstructorBanner";
import ShareKnowledgeBanner from "./ShareKnowledgeBanner";
import HomeFaq from "./HomeFaq";
import LazyOnVisible from "./HomePage/LazyOnVisible";
import {
  LazyTrending as Trending,
  LazyTeensEvents as TeensEvents,
  LazyTrainingEvents as TrainingEvents,
  LazyRecentEntries as RecentEntries,
  LazyLearners as Learners,
} from "./HomePage/LazyHomeSections";

// Home page orchestrator — Server Component. Metadata + JSON-LD live in
// app/(public)/page.js (Next.js Metadata API), so this only owns section
// layout/order. The #upcoming-events scroll-on-load behavior is the one
// piece of real interactivity, isolated into <HomeHashScroll />.
//
// Trending/TeensEvents/TrainingEvents/RecentEntries/Learners are imported
// via LazyHomeSections (next/dynamic, ssr:false) to keep their JS out of
// the initial bundle — safe specifically because they're "use client"
// components whose real content only ever appears after a client-side
// data fetch anyway (SSR would only produce their own loading skeleton) —
// and each is further wrapped in <LazyOnVisible> so it doesn't even mount
// (and therefore doesn't fire its data fetch or commit a render) until
// it's scrolled near, instead of all five firing at once right after
// hydration regardless of scroll position.
// The remaining sections (Association, Corporate, WhyChoose, LimitedDeals,
// MeetInstructorBanner, ShareKnowledgeBanner, HomeFaq) stay plain imports:
// wrapping a Server Component in next/dynamic() with SSR enabled broke
// hydration on this static-prerendered page once before — the client's
// first paint briefly rendered the dynamic import's (empty) loading
// fallback against server HTML that already had real content, producing
// a text-mismatch error (confirmed by isolating it to exactly the Footer
// dynamic() call in app/(public)/layout.js, across repeated production
// builds) — and ssr:false isn't a valid option for a Server Component.
export default function Home() {
  return (
    <div className="home-background">
      {/* Keep Banner eager — same "keep it off the lazy path for LCP"
          reasoning as the CRA original. */}
      <PopupBanner />
      <HomeHashScroll />

      {/* Not a <main> tag — the root layout already provides the page's
          one <main> landmark (see app/(public)/layout.js); this preserves
          the original id="main-content" as a div instead of nesting a
          second <main>. */}
      <div id="main-content">
        <Banner />

        <Association />
        <LazyOnVisible minHeight={480}>
          <Trending />
        </LazyOnVisible>
        <LazyOnVisible minHeight={480}>
          <TeensEvents />
        </LazyOnVisible>

        <div id="upcoming-events">
          <LazyOnVisible minHeight={540}>
            <TrainingEvents />
          </LazyOnVisible>
        </div>

        <Corporate />
        <WhyChoose />
        <LimitedDeals />
        <MeetInstructorBanner />
        <ShareKnowledgeBanner />
        <LazyOnVisible minHeight={560}>
          <RecentEntries />
        </LazyOnVisible>
        <LazyOnVisible minHeight={420}>
          <Learners page="home" />
        </LazyOnVisible>
        <HomeFaq />
      </div>
    </div>
  );
}
