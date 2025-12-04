import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchBox = ({ query = "", onChange }) => {
  return (
    <form className="d-flex flex-grow-1" role="search" onSubmit={(e) => e.preventDefault()}>
      <div
        className="input-group rounded-pill custom-search w-100"
        style={{ overflow: "hidden", height: 48, maxWidth: 400 }}
      >
        <input
          type="search"
          className="form-control border-0"
          placeholder="What would you like to learn?"
          value={query}
          onChange={onChange}
          aria-label="Search courses and blogs"
        />
        <button
          className="btn btn-info d-flex align-items-center justify-content-center search-btn"
          type="submit"
          aria-label="Search"
          onClick={(e) => e.preventDefault()}
        >
          <IoSearch size={20} className="text-white" />
        </button>
      </div>
    </form>
  );
};

export default React.memo(SearchBox);