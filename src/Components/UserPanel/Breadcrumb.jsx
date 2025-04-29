import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const Breadcrumb = ({ current }) => (
  <nav aria-label="breadcrumb">
    <ol className="breadcrumb">
      <li className="breadcrumb-item">
        <a href="/">Home</a> <MdKeyboardArrowRight />
      </li>
      <li className="breadcrumb-item active" aria-current="page">
        {current}
      </li>
    </ol>
  </nav>
);

export default Breadcrumb;
