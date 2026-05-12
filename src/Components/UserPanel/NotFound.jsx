import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  // ✅ URL Redirect Mapping (Wrong → Correct)
  const urlRedirectMap = {
    "/course/ai-in-healthcare": "/courses/ai-in-healthcare",
    "/course/salesforce-admin": "/courses/salesforce-admin",
    "/courses/ai": "/courses/artificial-intelligence-(-ai-)",
    "/hachion%20admin/cyber-security": "/courses/cyber-security",
  };

  // ❌ Invalid / Deleted URLs (from your sheet)
  const invalidUrls = [
    "/blogs/machine-learning-with-ai/how-netflix-uses-machine-learning-behind-the-technology-that-keeps-you-watching-50%23:~:text%3dnearly%2520four%2520out%2520of%2520every%2520five%2520shows%2520or%2520movies%2520watched%2520on%2520netflix%2520are%2520driven%2520by%2520personalized%2520recommendations",
    "/courses/aws-saa-(solutions-architect-associate)?trk=article-ssr-frontend-pulse_little-text-block",
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
    "/courses/advanced-business-analyst",
    "/courses/advanced-business-analyst",
    "/candle:_lighten_up_your_life_abstract_original_oil_painting_reprint/_a7qdgr7dx.html",
    "/candle:_lighten_up_your_life_abstract_original_oil_painting_reprint/_a7qdgr7dx.html",
    "/candle:_lighten_up_your_life_abstract_original_oil_painting_reprint/_a7qdgr7dx.html",
    "/runner_rug,2.8x11.7ft_rug,_reasonable_price_,free_shipping_turkish_runner_rug,_bohemian_rug,_vintage_rug,great_quality_rug,oushak_runner_rug/_awkdkrwdy.html",
    "/course/salesforce-business-analyst",
    "/macrame_dress%2c_crochet_dress%2c_festival_outfit%2c_handmade_crochet_dress%2c_burning_man_clothing_woman%2cmacrame_clothing%2c_festival_crop_top%2ctribal/_7hgdgxwdq.html",
    "/macrame_dress%2c_crochet_dress%2c_festival_outfit%2c_handmade_crochet_dress%2c_burning_man_clothing_woman%2cmacrame_clothing%2c_festival_crop_top%2ctribal/_7hgdgxwdq.html",
    "/courses/azure-solutions-architect",
    "/courses/azure-solutions-architect",
    "/courses/pega",
    "/very_%2a%2arare_vintage_angel_meiselman_imports_italian_polychrome_ceramic_angel_wall_sculpture_made_in_italy/_awadkradk.html",
    "/blogs/machine-learning-with-ai/how-netflix-uses-machine-learning-behind-the-technology-that-keeps-you-watching-50%23:~:text=nearly%20four%20out%20of%20every%20five%20shows%20or%20movies%20watched%20on%20netflix%20are%20driven%20by%20personalized%20recommendations",
    "/zivart_%22ellie%22_mixed_media_painting,the_original_painting,gift_for_her,_gift_for_him,_gift_ideas,_christmas,_birthday,_art,home_decor/_awadhh7dg.html",
    "/courses/servicenow",
    "/courses/servicenow",
    "/courses/react-js-training",
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
    "/courses/data-science-with-r",
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

  let cleanPath = pathname.split("?")[0].replace(/\/$/, "");


  // ✅ Redirect old coursedetails URL to new courses URL
if (cleanPath.startsWith("/courses/")) {
  const newPath = cleanPath.replace(
    "/courses/",
    "/courses/"
  );

  navigate(newPath, { replace: true });
  return;
}
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