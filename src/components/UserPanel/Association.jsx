import "./Home.css";
import img1 from "@/assets/cl1.webp";
import img2 from "@/assets/cl2.webp";
import img3 from "@/assets/cl3.webp";
import img4 from "@/assets/cl4.webp";
import img5 from "@/assets/cl5.webp";
import img6 from "@/assets/cl6.webp";
import img7 from "@/assets/cl7.webp";
import img8 from "@/assets/cl8.webp";
import img9 from "@/assets/cl9.webp";
import img10 from "@/assets/cl10.webp";
import img11 from "@/assets/cl11.webp";
import img12 from "@/assets/cl12.webp";

const images = [
  img1, img2, img3, img4, img5, img6,
  img7, img8, img9, img10, img11, img12,
];

export default function Association() {
  return (
    <div className="it-data">
      <h2 className="it-title">
        Trusted by <span> 200+ Leading Companies and Universities</span>
      </h2>
      <div className="it-logos container">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="it-logos-slide">
            {images.map((img, index) => (
              // Plain <img>, not next/image — matches production's own
              // markup exactly (a bare <img height="50" width="auto">).
              // next/image renders a fixed HTML width attribute from the
              // static import's intrinsic size (287px for cl1, etc.) that
              // wins over the CSS height:30px-only rule's implicit
              // proportional auto-width, so logos rendered at full native
              // width instead of scaling down with the height — squished/
              // oversized compared to production.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={img.src}
                alt={`image${index + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
