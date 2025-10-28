"use client"
import React from "react";
import Link from "next/link";
import styles from "./navbar.module.scss";
import Image from "next/image";
import Input from "../Input";
import Button from "../Button"

export type NavItem = {
  label: string;
  href: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

type Props = {
  items: NavItem[];
  ariaLabel?: string;
};

const Navbar = ({ items }: Props) => {

  const handleClick = async () => {
    console.log("click !");
  };

  return (
    <nav className={styles.nav_container}>
      <div>
        <Image src="/logo.png" alt="Nolyo" width={90} height={40} priority />
      </div>
      <ul className={styles.nav_list}>
        {items.map((item, index) => {
          return (
            <Link key={index} href={item.href}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Input
          type="text"
          name="search"
          placeholder="Search"
          leftIcon={<Image src="/recherche.png" alt="" width={16} height={16}/>}
        />
        <Button
        label="Mon compte"
        classNames={["btn_primary", "small"]}
        type="button"
        handleClick={() => {
          handleClick();
        }}
      ></Button>
      </div>
    </nav>
  );
};

export default Navbar;
