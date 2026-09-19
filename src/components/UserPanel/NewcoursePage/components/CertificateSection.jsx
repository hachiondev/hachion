"use client";

import React from "react";
import styles from "./CertificateSection.module.css";
import { cn } from "@/utils";

// This preview intentionally uses a different base image than the real
// generated certificate: the marketing/preview surface always shows
// cer.webp (a compressed copy of the original cer.png, same artwork), while
// the backend's real PDF (Certificateimp.java) uses Certificate_Genarated.jpg.
// The two are separate templates by design.
//
// Shown as-is, with no dynamic overlay (name/course/skills/certificate
// ID/support/date) drawn on top - by explicit request, this section
// displays the certificate image exactly, unmodified.
const CERTIFICATE_IMAGE = "/cer.webp";

const Check = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#22c55e" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
// eslint-disable-next-line @next/next/no-img-element
const Badge = () => <img src="/doc.png" alt="badge" width="44" height="44" />;
// eslint-disable-next-line @next/next/no-img-element
const Iso = () => <img src="/ISO.png" alt="ISO" width="44" height="44" />;
// eslint-disable-next-line @next/next/no-img-element
const Pmi = () => <img src="/MicrosoftProject.png" alt="MicrosoftProject" width="44" height="44" />;
const Share = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="#0ea5e9"
      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 000-1.39l7-4.11A3 3 0 0018 7.91a3.09 3.09 0 10-3.09-3.09 3 3 0 00.2 1.09l-7 4.11a3.09 3.09 0 100 4.96l7.09 4.17c-.12.33-.2.69-.2 1.06A3.09 3.09 0 1018 16.08z"
    />
  </svg>
);
// eslint-disable-next-line @next/next/no-img-element
const DownloadIco = () => <img src="/Downloading.png" alt="Download" width="44" height="44" />;

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/CertificateSection.jsx.
export default function CertificateSection() {
  return (
    <section className={styles.cfwrap}>
      <div className="container">
        <div className={styles.cfhead}>
          <h2>Certificate of Completion</h2>
          <p>Earn an industry-recognised certificate upon successful completion of the course</p>
        </div>

        <div className={styles.cfgrid}>
          <div className={styles.cfleft}>
            <div className={styles.cftitlerow}>
              <span className={styles.cfround}>
                <Badge />
              </span>
              <div>
                <div className={styles.cfh3}>Industry-Recognised Certification</div>
                <div className={styles.cfsub}>Accredited by leading tech organisations</div>
              </div>
            </div>

            <ul className={styles.cfchecks}>
              {["Blockchain-verified authenticity", "Accepted by 500+ companies worldwide", "Add to LinkedIn profile instantly", "Digital & printable versions included"].map((t) => (
                <li key={t}>
                  <Check /> {t}
                </li>
              ))}
            </ul>

            <div className={styles.cfaccredit}>
              <div className={styles.cfacctitle}>Accreditation & Recognition</div>

              <div className={styles.cfaccgrid}>
                <div className={styles.cfaccitem}>
                  <Iso />
                  <div>
                    <div className={styles.cfacchead}>ISO 9001:2025</div>
                    <div className={styles.cfaccsub}>Quality Management</div>
                  </div>
                </div>

                <div className={styles.cfaccitem}>
                  <Pmi />
                  <div>
                    <div className={styles.cfacchead}>PMI Approved</div>
                    <div className={styles.cfaccsub}>Project Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cfright}>
            <div className={styles.cfcert}>
              <div className={styles.cfcertFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CERTIFICATE_IMAGE} alt="Certificate preview" width={900} height={651} />
              </div>

              <div className={cn(styles.cfbubble, styles.cfshare)}>
                <span className={styles.cfbico}>
                  <Share />
                </span>
                <div>
                  <div className={styles.cfbtitle}>Easy sharing</div>
                  <div className={styles.cfbsub}>LinkedIn, social media</div>
                </div>
              </div>
              <div className={cn(styles.cfbubble, styles.cfdl)}>
                <span className={styles.cfbico}>
                  <DownloadIco />
                </span>
                <div>
                  <div className={styles.cfbtitle}>Instantly downloadable</div>
                  <div className={styles.cfbsub}>PDF & high-res formats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
