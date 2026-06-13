import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  const urlRedirectMap = {

    "/coursedetails": "/courses",
    "/coursedetails/accounting-&-finance": "/courses/accounting-and-finance",
"/coursedetails/act": "/courses/act",
"/coursedetails/artificial-intelligence": "/courses/artificial-intelligence",
"/coursedetails/big-data-&-streaming-technologies": "/courses/big-data-and-streaming-technologies",
"/coursedetails/business-analyst": "/courses/business-analyst",
"/coursedetails/business-intelligence": "/courses/business-intelligence",
"/coursedetails/career-development-&-professional-skills": "/courses/career-development-and-professional-skills",
"/coursedetails/cloud-courses": "/courses/cloud-courses",
"/coursedetails/crm-courses": "/courses/crm-courses",
"/coursedetails/cyber-security": "/courses/cyber-security",
"/coursedetails/data-science-&-business-analytics": "/courses/data-science-and-business-analytics",
"/coursedetails/linux-&-system-administration": "/courses/linux-and-system-administration",
"/coursedetails/management-courses": "/courses/management-courses",
"/coursedetails/marketing-&-business": "/courses/marketing-and-business",
"/coursedetails/microsoft": "/courses/microsoft",
"/coursedetails/mobile-app-development": "/courses/mobile-app-development",
"/coursedetails/networking-courses": "/courses/networking-courses",
"/coursedetails/programming": "/courses/programming",
"/coursedetails/qa-testing": "/courses/qa-testing",
"/coursedetails/sap": "/courses/sap",
"/coursedetails/sat": "/courses/sat",
"/coursedetails/summer-training": "/courses/summer-training",
"/coursedetails/web-development": "/courses/web-development",
"/coursedetails/workday": "/courses/workday",

  // Artificial Intelligence
  "/coursedetails/artificial-intelligence-(-ai-)": "/courses/artificial-intelligence/artificial-intelligence-training",
  "/coursedetails/machine-learning-with-ai": "/courses/artificial-intelligence/machine-learning-training",
  "/coursedetails/ai-in-healthcare": "/courses/artificial-intelligence/ai-in-healthcare",
  "/coursedetails/chatgpt": "/courses/artificial-intelligence/chatgpt-training",
  "/coursedetails/machine-learning-operations-(mlops)": "/courses/artificial-intelligence/machine-learning-operations-training",
  "/coursedetails/natural-language-processing-(nlp)": "/courses/artificial-intelligence/natural-language-processing-training",
  "/coursedetails/agentic-ai": "/courses/artificial-intelligence/agentic-ai-training",
  "/coursedetails/generative-ai": "/courses/artificial-intelligence/generative-ai-training",
  "/coursedetails/genai-with-python": "/courses/artificial-intelligence/genai-with-python",
  "/coursedetails/large-language-models-(-llm-)": "/courses/artificial-intelligence/large-language-models-training",
  "/coursedetails/gen-ai-with-agentic-ai": "/courses/artificial-intelligence/gen-ai-agentic-ai-training",

  // Business Analyst
  "/coursedetails/it-business-analyst": "/courses/business-analyst/it-business-analyst",
  "/coursedetails/business-analyst-healthcare": "/courses/business-analyst/business-analyst-healthcare",
  "/coursedetails/business-analyst-–-banking-domain": "/courses/business-analyst/business-analyst-banking-domain",
  "/coursedetails/business-analyst-%e2%80%93-banking-domain": "/courses/business-analyst/business-analyst-banking-domain",

  // Business Intelligence
  "/coursedetails/tableau-desktop": "/courses/business-intelligence/tableau-desktop",
  "/coursedetails/big-data": "/courses/business-intelligence/big-data-training",
  "/coursedetails/spss": "/courses/business-intelligence/spss-training",

  // Career Development
  "/coursedetails/soft-skills": "/courses/career-development-and-professional-skills/soft-skills",

  // Cloud Courses
  "/coursedetails/snowflake": "/courses/cloud-courses/snowflake-training",
  "/coursedetails/mulesoft": "/courses/cloud-courses/mulesoft-training",
  "/coursedetails/aws-with-devops": "/courses/cloud-courses/aws-devops-training",
  "/coursedetails/aws-solutions-architect-associate": "/courses/cloud-courses/aws-solutions-architect-certification",
  "/coursedetails/microsoft-azure-administrator-(az-104)": "/courses/cloud-courses/microsoft-azure-administrator-certification",
  "/coursedetails/az-400-designing-and-implementing-microsoft-devops-solutions": "/courses/cloud-courses/azure-devops-engineer-certification",
  "/coursedetails/aws-cloud-practitioner": "/courses/cloud-courses/aws-cloud-practitioner-certification",
  "/coursedetails/devops": "/courses/cloud-courses/devops-training",
  "/coursedetails/docker-and-kubernetes-certification-training": "/courses/cloud-courses/docker-kubernetes-certification-training",
  "/coursedetails/oracle-cloud-scm": "/courses/cloud-courses/oracle-cloud-scm-training",
  "/coursedetails/datadog": "/courses/cloud-courses/datadog-training",
  "/coursedetails/oracle-ebs": "/courses/cloud-courses/oracle-ebs-training",
  "/coursedetails/docker-and-kubernetes-(7-hands-on-projects)": "/courses/cloud-courses/docker-kubernetes-projects",
  "/coursedetails/databricks": "/courses/cloud-courses/databricks-training",
  "/coursedetails/aws-data-engineer": "/courses/cloud-courses/aws-data-engineer-training",

  // CRM Courses
  "/coursedetails/salesforce-admin": "/courses/crm-courses/salesforce-admin",
  "/coursedetails/salesforce-development": "/courses/crm-courses/salesforce-development",
  "/coursedetails/servicenow-admin": "/courses/crm-courses/servicenow-admin",
  "/coursedetails/salesforce-admin+development-(combo-course)": "/courses/crm-courses/salesforce-admin-development",
  "/coursedetails/salesforce-advanced-admin": "/courses/crm-courses/salesforce-advanced-admin",
  "/coursedetails/salesforce-business-analyst": "/courses/crm-courses/salesforce-business-analyst",
// CRM Courses
"/coursedetails/salesforce-cpq": "/courses/crm-courses/salesforce-cpq",
"/coursedetails/salesforce-ai": "/courses/crm-courses/salesforce-ai",
"/coursedetails/workflow-automation": "/courses/crm-courses/workflow-automation",
"/coursedetails/servicenow-development": "/courses/crm-courses/servicenow-development",
"/coursedetails/servicenow-combo": "/courses/crm-courses/servicenow-combo",

// Accounting and Finance
"/coursedetails/quickbooks": "/courses/accounting-and-finance/quickbooks",
"/coursedetails/payroll-management": "/courses/accounting-and-finance/payroll-management",

// ACT
"/coursedetails/act(english)": "/courses/act/act-english",
"/coursedetails/act(math)": "/courses/act/act-math",

// Big Data and Streaming Technologies
"/coursedetails/apache-kafka": "/courses/big-data-and-streaming-technologies/apache-kafka",

// Cyber Security
"/coursedetails/certified-ethical-hacker-(ceh)": "/courses/cyber-security/certified-ethical-hacker-certification",
"/coursedetails/computer-hacking-forensic-investigator-(chfi)": "/courses/cyber-security/computer-hacking-forensic-investigator-certification",
"/coursedetails/security-operations-center-(soc)-analyst": "/courses/cyber-security/security-operations-center-analyst-training",
"/coursedetails/identity-and-access-management-(iam)": "/courses/cyber-security/identity-access-management-training",
"/coursedetails/accessibility-&-penetration-testing": "/courses/cyber-security/accessibility-penetration-testing",

// Data Science and Business Analytics
"/coursedetails/data-science-with-python": "/courses/data-science-and-business-analytics/data-science-with-python",
"/coursedetails/data-analytics": "/courses/data-science-and-business-analytics/data-analytics",
"/coursedetails/power-bi": "/courses/data-science-and-business-analytics/power-bi-training",
"/coursedetails/sql": "/courses/data-science-and-business-analytics/sql-training",
"/coursedetails/business-analytics": "/courses/data-science-and-business-analytics/business-analytics",
"/coursedetails/data-science-with-python-&-ml": "/courses/data-science-and-business-analytics/data-science-machine-learning-training",
"/coursedetails/data-analytics-capstone-project": "/courses/data-science-and-business-analytics/data-analytics-capstone-project",
"/coursedetails/data-analytics-with-advance-python": "/courses/data-science-and-business-analytics/data-analytics-advance-python",
"/coursedetails/pyspark-certification-training-course": "/courses/data-science-and-business-analytics/pyspark-certification-training",
"/coursedetails/sql-with-python": "/courses/data-science-and-business-analytics/sql-training-with-python",
"/coursedetails/teradata": "/courses/data-science-and-business-analytics/teradata",
"/coursedetails/pl-sql": "/courses/data-science-and-business-analytics/pl-sql",

// Linux and System Administration
"/coursedetails/red-hat-administration-d0280": "/courses/linux-and-system-administration/red-hat-administration-d0280",
"/coursedetails/red-hat-administration-d0188": "/courses/linux-and-system-administration/red-hat-administration-d0188",

// Management Courses
"/coursedetails/project-management-certification-(pmp-with-35-pdus)": "/courses/management-courses/pmp-certification-training",
"/coursedetails/certified-scrum-master-(-csm-)": "/courses/management-courses/certified-scrum-master-certification",
"/coursedetails/certified-scrum-product-owner-(cspo)": "/courses/management-courses/certified-scrum-product-owner-certification",
"/coursedetails/program-management-professional": "/courses/management-courses/program-management-professional",
"/coursedetails/professional-scrum-master-(psm)": "/courses/management-courses/professional-scrum-master-certification",
"/coursedetails/advanced-certified-scrum-master-acsm": "/courses/management-courses/advanced-certified-scrum-master-certification",

// Marketing and Business
"/coursedetails/digital-marketing": "/courses/marketing-and-business/digital-marketing",

// Microsoft
"/coursedetails/azure-data-engineer": "/courses/microsoft/azure-data-engineer-training",
"/coursedetails/azure-devops": "/courses/microsoft/azure-devops-training",
"/coursedetails/microsoft-dynamics-365": "/courses/microsoft/microsoft-dynamics-365",

// Mobile App Development
"/coursedetails/ios-app-development": "/courses/mobile-app-development/ios-app-development",
"/coursedetails/android-app-development": "/courses/mobile-app-development/android-app-development",
"/coursedetails/react-native": "/courses/mobile-app-development/react-native-training",

// Networking Courses
"/coursedetails/python-automation-network-engineer": "/courses/networking-courses/python-automation-network-engineer-training",
"/coursedetails/ccna-(cisco-certified-network-associate)": "/courses/networking-courses/ccna-certification-training",
"/coursedetails/ccnp-(cisco-certified-network-professional)": "/courses/networking-courses/ccnp-certification-training",

// Programming
"/coursedetails/java-full-stack": "/courses/programming/java-full-stack-development-training",
"/coursedetails/dotnet": "/courses/programming/dotnet-development-training",
"/coursedetails/python": "/courses/programming/python-programming-training",
"/coursedetails/python-capstone-project": "/courses/programming/python-capstone-project",
"/coursedetails/java-with-python": "/courses/programming/java-with-python",

// QA Testing
"/coursedetails/qa-automation-(selenium-with-java)": "/courses/qa-testing/selenium-java-automation-training",
"/coursedetails/qa-manual-testing": "/courses/qa-testing/qa-manual-testing",
"/coursedetails/performance-testing": "/courses/qa-testing/performance-testing",
"/coursedetails/qa-combo-course-(manual-&-automation)": "/courses/qa-testing/qa-combo-manual-automation",
"/coursedetails/cucumber-automation": "/courses/qa-testing/cucumber-automation",
"/coursedetails/tosca-automation": "/courses/qa-testing/tosca-automation",
"/coursedetails/playwright-with-python": "/courses/qa-testing/playwright-python-automation-training",
"/coursedetails/qa-automation-(python)": "/courses/qa-testing/python-automation-testing-training",

// SAP
"/coursedetails/sap-hana": "/courses/sap/sap-hana",
"/coursedetails/sap-tosca-automation": "/courses/sap/sap-tosca-automation",

// SAT
"/coursedetails/sat-(math)": "/courses/sat/sat-math",
"/coursedetails/sat-(english)": "/courses/sat/sat-english",

// Summer Training
"/coursedetails/python-programming-for-kids": "/courses/summer-training/python-programming-for-kids",

// Web Development
"/coursedetails/ruby-on-rails(ror)": "/courses/web-development/ruby-on-rails-ror",
"/coursedetails/full-stack-web-development": "/courses/web-development/full-stack-web-development-training",
"/coursedetails/angular-frontend-development": "/courses/web-development/angular-frontend-development-training",
"/coursedetails/streamlit": "/courses/web-development/streamlit-training",
"/coursedetails/graphql-with-mern": "/courses/web-development/graphql-mern-training",

// Workday
"/coursedetails/workday-hcm": "/courses/workday/workday-hcm-training",
"/coursedetails/workday-finance": "/courses/workday/workday-finance-training",
};
  // ❌ Invalid / Deleted URLs (from your sheet)
  const invalidUrls = [
    "/blogs/machine-learning-with-ai/how-netflix-uses-machine-learning-behind-the-technology-that-keeps-you-watching-50%23:~:text%3dnearly%2520four%2520out%2520of%2520every%2520five%2520shows%2520or%2520movies%2520watched%2520on%2520netflix%2520are%2520driven%2520by%2520personalized%2520recommendations",
    "/coursedetails/aws-saa-(solutions-architect-associate)?trk=article-ssr-frontend-pulse_little-text-block",
    "/?product=344739",
    "/category/machine-learning",
    "/assets/allcourseimages/post5df3a02cc9a42.pdf",
    "/blogs/artificial-intelligence/what-is-generative-search-and-how-its-changing-seo-in-2025-94",
    "/blogs/data-science-&-business-analytics/hachion.co",
    "/blogs/machine-learning-with-ai/hachion.co",
    "/blogs/business-analyst/hachion.co",
    "/rk",
    "/enquiryform/rashi?fbclid=IwZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAEe-5cYKsYp2SqmysSlNh3OKF-eWd6xiBkyS_3UqKERSZj5_vI9mR7HpL1NG1E_aem_P1rOPIBTt6gPQwVBzVO9Ig",
    "/course/mulesoft",
    "/coursedetails/advanced-business-analyst",
    "/coursedetails/advanced-business-analyst",
    "/candle:_lighten_up_your_life_abstract_original_oil_painting_reprint/_a7qdgr7dx.html",
    "/candle:_lighten_up_your_life_abstract_original_oil_painting_reprint/_a7qdgr7dx.html",
    "/candle:_lighten_up_your_life_abstract_original_oil_painting_reprint/_a7qdgr7dx.html",
    "/runner_rug,2.8x11.7ft_rug,_reasonable_price_,free_shipping_turkish_runner_rug,_bohemian_rug,_vintage_rug,great_quality_rug,oushak_runner_rug/_awkdkrwdy.html",
    "/course/salesforce-business-analyst",
    "/macrame_dress%2c_crochet_dress%2c_festival_outfit%2c_handmade_crochet_dress%2c_burning_man_clothing_woman%2cmacrame_clothing%2c_festival_crop_top%2ctribal/_7hgdgxwdq.html",
    "/macrame_dress%2c_crochet_dress%2c_festival_outfit%2c_handmade_crochet_dress%2c_burning_man_clothing_woman%2cmacrame_clothing%2c_festival_crop_top%2ctribal/_7hgdgxwdq.html",
    "/coursedetails/azure-solutions-architect",
    "/coursedetails/azure-solutions-architect",
    "/coursedetails/pega",
    "/very_%2a%2arare_vintage_angel_meiselman_imports_italian_polychrome_ceramic_angel_wall_sculpture_made_in_italy/_awadkradk.html",
    "/blogs/machine-learning-with-ai/how-netflix-uses-machine-learning-behind-the-technology-that-keeps-you-watching-50%23:~:text=nearly%20four%20out%20of%20every%20five%20shows%20or%20movies%20watched%20on%20netflix%20are%20driven%20by%20personalized%20recommendations",
    "/zivart_%22ellie%22_mixed_media_painting,the_original_painting,gift_for_her,_gift_for_him,_gift_ideas,_christmas,_birthday,_art,home_decor/_awadhh7dg.html",
    "/coursedetails/servicenow",
    "/coursedetails/servicenow",
    "/coursedetails/react-js-training",
    "/course/machine-learning-operations-(mlops)",
    "/course/machine-learning-operations-%28mlops%29",
    "/leather_belt_clip_phone_case_for_6.1%22_or_6.9%22_phones%2c_belt_clip_phone_case_for_iphone%2fsamsung%2c_magnetic_closure_personalized_belt_clip_case/_7x7dhwrdk.html",
    "/course/pyspark-certification-training-course",
    "/course/tosca-automation",
    "/mto_loretta_dress_%22love_birds_in_toile%22/_7xydhgwdr.html",
    "/organic_cotton_%22blueberry_woods_toile%22_one_curtain_panel_blue_on_white._delft._bears%2c_berries%2c_fish%2c_flowers%2c_blue_heron._fun_family_decor/_a7kd7ygdg.html",
    "/course/certified-scrum-product-owner-(cspo)",
    "/the_israeli_egyptian_war_of_attrition,_1969_1970_by_yaacov_bar_siman_tov/_a7yd7aadg.html",
    "/course/identity-and-access-management-(iam)",
    "/course/identity-and-access-management-%28iam%29",
    "/coursedetails/data-science-with-r",
    "/lilu_summer_kimono%2c_spriped_flowy_beach_kimono%2c_relaxed_fit_robe_dress%2c_loose_spriped_robe%2c_dark_blue_white_beachwear%2c_patchwork_caftan%2c_boh/_7khdgdw.html",
    "/course/programming-with-c%2b%2b",
    "/basket_charm_%22adorable%22_filled_with_tiny_natural_pearls_on_a_4mm_bead_aquamarine_necklace_with_5_inches_ss_link_chain%2c_length_18%22/_aqhdywqdx.html",
    "/peignoir_%22tulip%22/_7xrdg7xda.html",
    "/zuru_x_shot_excel_recoil_%28lot_of_12%29_new_in_box_price_is_for_all_12/_ydhrydg.html",
    "/plus_%22queen_of_neptune%22_handmade_vintage_gown/_arwdhwwdg.html",
    "/course/sql",
    "/zuru_x_shot_excel_recoil_%28lot_of_12%29_new_in_box_price_is_for_all_12/_ydhrydg.html",
    "/plus_%22queen_of_neptune%22_handmade_vintage_gown/_arwdhwwdg.html",
    "/course/sql",
    "/internship/service-now",
    "/blogs/business-analyst/hachion.co",
    "/blogs/business-analyst/",
    "/scarce_burleigh_ware_large_%22calico%22_pattern_cheese_dome_c1970s/_aqrdw7kdq.html",
    "/assets/allcourseimages/post5ecd6fbd6af0b.pdf",
    "/blogs/machine-learning-with-ai/how-netflix-uses-machine-learning-behind-the-technology-that-keeps-you-watching-50%23:~:text=nearly%20four%20out%20of%20every%20five%20shows%20or%20movies%20watched%20on%20netflix%20are%20driven%20by%20personalized%20recommendations",
    "/course/act(english)",
  ];
useEffect(() => {

  const meta = document.createElement("meta");
  meta.name = "robots";
  meta.content = "noindex,follow";
  document.head.appendChild(meta);

  // let cleanPath = pathname.split("?")[0].replace(/\/$/, "");
  let cleanPath = decodeURIComponent(
  pathname.split("?")[0].replace(/\/$/, "")
).toLowerCase();

  // ✅ Case 1: Redirect immediately (NO UI)
  if (urlRedirectMap[cleanPath]) {
    navigate(urlRedirectMap[cleanPath], { replace: true });
    return;
  }

  // ✅ Case 2: Not redirect → show UI
  setShouldRender(true);

  const timer = setTimeout(() => {
    navigate("/", { replace: true });
  }, 5000);

  return () => {
    clearTimeout(timer);
    document.head.removeChild(meta);
  };

}, [navigate, pathname]);

  // ✅ Check if it's invalid/deleted URL
  const isInvalid = invalidUrls.includes(
    pathname.split("?")[0].replace(/\/$/, "")
  );
if (!shouldRender) return null;
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{ textAlign: "center", maxWidth: 560, padding: "24px" }}>
        
        {/* <h2 style={{ marginTop: 0 }}>Invalid URL</h2> */}
<h2 style={{ marginTop: 0 }}>
  {isInvalid ? (
    <>Redirect gone <code>https://www.hachion.co{pathname}</code></>
  ) : (
    <>Invalid URL</>
  )}
</h2>
        {/* ✅ Dynamic Message */}
   <p>
  {!isInvalid && (
    <>
      The page <code>{pathname}</code> is no longer available.
      Please check the correct URL.
    </>
  )}
</p>

        {/* ✅ Optional Support Link
        {isInvalid && (
          <p style={{ marginTop: "10px" }}>
            📧 Email: <a href="mailto:support@hachion.co">support@hachion.co</a>
          </p>
        )} */}

        <p>Redirecting to the home page…</p>

      </div>
    </div>
  );
}