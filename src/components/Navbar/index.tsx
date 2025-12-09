"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

import styles from "./navbar.module.scss";
import Input from "../Input";
import Button from "../Button";
import { useCart } from "@/context/CartContext";

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
  const { totalCount, openCart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

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

          <Link href={isLoggedIn ? "/profil" : "/auth/login"}>
            <Button
              label={isLoggedIn ? "Mon compte" : "Se connecter"}
              classNames={["btn_primary", "btn_small"]}
              type="button"
              handleClick={handleClick}
            />
          </Link>

          <button
            className={styles.cart_button}
            onClick={openCart}
            aria-label="Ouvrir le panier"
          >
            <span>Panier</span>
            {totalCount > 0 && (
              <span className={styles.cart_badge}>{totalCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
