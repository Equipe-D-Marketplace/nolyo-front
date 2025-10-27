import React from "react";
import Image from "next/image";
import styles from "./footer.module.scss";

export type FooterProps = {
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  copyright?: string;
  companyName?: string;
  className?: string;
};

const Footer: React.FC<FooterProps> = ({
  logo,
  copyright,
  companyName = "Nolyo",
  className,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${companyName}. Tous droits réservés.`;

  return (
    <footer className={`${styles.footer} ${className || ""}`}>
      {/* Copyright */}
      <div className={styles.copyright_section}>
        <p className={styles.copyright}>{copyright || defaultCopyright}</p>
        {logo && (
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 120}
            height={logo.height || 40}
            className={styles.logo}
          />
        )}
        {/* {logo && (
          <div className={styles.logo_section}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={logo.height || 40}
              className={styles.logo}
            />
          </div>
        )} */}
      </div>
    </footer>
  );
};

export default Footer;
