import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

// Shared breadcrumb nav — the CRA source repeated this exact markup
// (Home > current page) on every legal/static page. `label` is the
// current page's display name; wrapperClassName lets each page keep its
// own outer class (e.g. "terms-header") for existing CSS to still apply.
export default function Breadcrumb({ label, wrapperClassName }) {
  return (
    <div className={wrapperClassName}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link> <MdKeyboardArrowRight className="breadcrumb-icon" />
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {label}
          </li>
        </ol>
      </nav>
    </div>
  );
}
