"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.scss";
import Input from "../Input";
import Button from "../Button";

export type NavItem = {
  label: string;
  href: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

type Props = {
  items: NavItem[];
};

const Navbar = ({ items }: Props) => {
  const handleClick = () => {
    console.log("click !");
  };

  return (
    <nav className={styles.nav_container}>
      <div className={styles.nav_content}>
        {/* LOGO */}
        <div className={styles.logo}>
          <Image src="/logo.png" alt="Nolyo" width={90} height={40} priority />
        </div>

        {/* MENU */}
        <ul className={styles.nav_list}>
          {items.map((item, index) => (
            <li key={index}>
              <Link className={styles.nav_link} href={item.href}>
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* SEARCH + BUTTON */}
        <div className={styles.right_section}>
          <Input
            type="text"
            name="search"
            placeholder="Search"
            leftIcon={
              <Image src="/recherche.png" alt="" width={16} height={16} />
            }
          />

          <Link href="/auth/login">
            <Button
              label="Mon compte"
              classNames={["btn_primary", "small"]}
              type="button"
              handleClick={handleClick}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
