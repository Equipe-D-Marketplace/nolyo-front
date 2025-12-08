"use client"

import Image from "next/image";
import HomeImage from "../../public/home_image1.png";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/explore");
  };
  return (
    <main>
      <div className={styles.homeContainer}>
        <div>
          <h1>Vendez ou achetez en toute simplicité</h1>
          <p>
            Découvrez des milliers de produits uniques et connectez-vous avec
            une communauté de vendeurs passionnés.
          </p>
          <Button
            label="Commencer a explorer"
            classNames={["btn_primary", "large"]}
            type="button"
            handleClick={() => {
              handleClick();
            }}
          ></Button>
        </div>
        <div>
          <Image src={HomeImage} alt="home image"></Image>
        </div>
      </div>
    </main>
  );
}
