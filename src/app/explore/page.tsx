"use client"
import { useState } from "react";
import Multiselect from "@/components/MultiSelect";
import Slider from "@/components/Slider";
import style from "./page.module.css"

export default function Explore() {

    const [cities, setCities] = useState<string[]>(["lyon"]);

    const options = [
        { value: "paris", label: "Paris" },
        { value: "lyon", label: "Lyon" },
        { value: "marseille", label: "Marseille" },
      ];

      const handlePriceChange = (values: { min: number; max: number }) => {
        console.log("Nouveau filtre :", values);
      };

  return (
    <main>
      <h1>Explore page</h1>
      <div className={style["filter-bar-container"]}>
        <Multiselect
          label="Catégories : "
          options={options}
      ></Multiselect>
      <Slider min={0} max={2000} step={50} onChange={handlePriceChange} />
      </div>
      
    </main>
  );
}
