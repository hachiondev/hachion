import React from "react";
import styles from "./Header.module.css";
import { cn } from "../../utils";
import logo from '../Assets/images/logo.png';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1v3.5a1 1 0 01-1 1C11.07 21 3 12.93 3 2.99a1 1 0 011-1H7.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.21z"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 11 4 6.01V6h16zM4 18V8.24l7.4 4.94a1 1 0 001.2 0L20 8.24V18H4z"/>
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const CartIcon = () => (
  <img src="Cart-2.png" alt="logo" width={22} />
);

export default function Header({
  phone = "+91 94903 23388",
  email = "trainings@hachion.com",
  onCorporateClick = () => {},
  onExploreClick = () => {},
  user = { name: "User Name", avatar: "https://i.pravatar.cc/80?img=32" },
}) {
  return (
    <header className={styles.hxheader}>
      {/* Top bar */}
      <div className={styles.hxtop}>
        <div className={styles.hxtopleft}>
          <span className={styles.hxtopitem}>
            <PhoneIcon />
            <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label="Call us">
              {phone}
            </a>
          </span>
          <span className={styles.hxtopitem}>
            <MailIcon />
            <a href={`mailto:${email}`} aria-label="Email us">
              {email}
            </a>
          </span>
        </div>

        <button className={styles.hxcorporate} onClick={onCorporateClick}>
          Corporate Training
        </button>
      </div>

      {/* Main bar */}
      <div className={styles.hxmain}>
        {/* Logo */}
        <a href="/" className={styles.hxlogo} aria-label="Hachion home">
          <img src={logo} alt="logo" />
        </a>

        {/* Explore dropdown trigger */}
        <button className={styles.hxexplore} onClick={onExploreClick}>
          <span>Explore Courses</span>
          <ChevronDown />
        </button>

        {/* Search */}
        <form
          className={styles.hxsearch}
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            // handle search(q)
          }}
        >
          <input
            name="q"
            type="search"
            placeholder="What would you like to learn?"
            aria-label="Search courses"
          />
          <button className={styles.hxsearchbtn} aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        {/* Right actions */}
        <nav className={styles.hxactions} aria-label="User actions">
          <button className={styles.hxiconbtn} aria-label="Cart">
            <CartIcon />
          </button>

          <button className={styles.hxuser}>
            <img src={user.avatar} alt="" />
            <span className={styles.hxusername}>{user.name}</span>
            <ChevronDown />
          </button>
        </nav>
      </div>
    </header>
  );
}
