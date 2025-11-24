import React, { useState } from "react";
import styles from "./Header.module.css";
import { cn } from "../lib/utils";
import logo from '../assets/images/logo.png';

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

const HamburgerIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleExploreMenu = () => {
    setExploreMenuOpen(!exploreMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

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
        <div className={styles.hxexploreWrapper}>
          <button className={styles.hxexplore} onClick={toggleExploreMenu}>
            <span>Explore Courses</span>
            <ChevronDown />
          </button>
          
          {exploreMenuOpen && (
            <>
              <div className={styles.hxdropoverlay} onClick={toggleExploreMenu}></div>
              <div className={styles.hxdropdown}>
                <div className={styles.hxdropheader}>Browse Categories</div>
                <a href="/courses/web-development" onClick={toggleExploreMenu}>Web Development</a>
                <a href="/courses/data-science" onClick={toggleExploreMenu}>Data Science</a>
                <a href="/courses/mobile-development" onClick={toggleExploreMenu}>Mobile Development</a>
                <a href="/courses/cloud-computing" onClick={toggleExploreMenu}>Cloud Computing</a>
                <a href="/courses/devops" onClick={toggleExploreMenu}>DevOps</a>
                <a href="/courses/ai-ml" onClick={toggleExploreMenu}>AI & Machine Learning</a>
                <a href="/courses/cybersecurity" onClick={toggleExploreMenu}>Cybersecurity</a>
                <a href="/courses/blockchain" onClick={toggleExploreMenu}>Blockchain</a>
                <div className={styles.hxdropfooter}>
                  <a href="/courses" onClick={toggleExploreMenu}>View All Courses →</a>
                </div>
              </div>
            </>
          )}
        </div>

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

          <div className={styles.hxuserWrapper}>
            <button className={styles.hxuser}>
              <img src={user.avatar} alt="user" onClick={toggleUserMenu} />
              <span className={styles.hxusername} onClick={toggleUserMenu}>{user.name}</span>
              <span className={styles.hxchevron} onClick={toggleUserMenu}><ChevronDown /></span>
              <span className={styles.hxhamburger} onClick={toggleMobileMenu}><HamburgerIcon /></span>
            </button>
            
            {userMenuOpen && (
              <>
                <div className={styles.hxdropoverlay} onClick={toggleUserMenu}></div>
                <div className={cn(styles.hxdropdown, styles.hxuserdropdown)}>
                  <div className={styles.hxdropuserinfo}>
                    <img src={user.avatar} alt="" />
                    <div>
                      <div className={styles.hxdropusername}>{user.name}</div>
                      <div className={styles.hxdropuseremail}>user@example.com</div>
                    </div>
                  </div>
                  <div className={styles.hxdropdivider}></div>
                  <a href="/profile" onClick={toggleUserMenu}>My Profile</a>
                  <a href="/courses/enrolled" onClick={toggleUserMenu}>My Courses</a>
                  <a href="/cart" onClick={toggleUserMenu}>Shopping Cart</a>
                  <a href="/wishlist" onClick={toggleUserMenu}>Wishlist</a>
                  <a href="/settings" onClick={toggleUserMenu}>Settings</a>
                  <div className={styles.hxdropdivider}></div>
                  <a href="/logout" onClick={toggleUserMenu}>Logout</a>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          <div className={styles.hxoverlay} onClick={toggleMobileMenu}></div>
          <div className={styles.hxmobilemenu}>
            <div className={styles.hxmenuheader}>
              <div className={styles.hxmenuuser}>
                <img src={user.avatar} alt="" />
                <span>{user.name}</span>
              </div>
              <button className={styles.hxclosebtn} onClick={toggleMobileMenu}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <nav className={styles.hxmenunav}>
              <a href="/" onClick={toggleMobileMenu}>Home</a>
              <a href="/courses" onClick={toggleMobileMenu}>All Courses</a>
              <a href="/about" onClick={toggleMobileMenu}>About Us</a>
              <a href="/contact" onClick={toggleMobileMenu}>Contact</a>
              <button onClick={() => { onCorporateClick(); toggleMobileMenu(); }}>Corporate Training</button>
              <a href="/cart" onClick={toggleMobileMenu}>My Cart</a>
              <a href="/profile" onClick={toggleMobileMenu}>Profile</a>
              <a href="/logout" onClick={toggleMobileMenu}>Logout</a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
