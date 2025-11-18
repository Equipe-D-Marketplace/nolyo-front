"use client";
import { useState } from "react";
import Multiselect from "@/components/MultiSelect";
import Slider from "@/components/Slider";
import Catalogue from "@/components/Catalogue";
import style from "./page.module.css";

export default function Explore() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 2000 });

  const products = [
    {
      id: "1",
      name: "Appartement cosy au centre-ville",
      price: 120,
      originalPrice: 150,
      category: "Appartement",
      image: "/home_image1.png",
      rating: 4.5,
      reviewsCount: 32,
      badge: "Populaire",
      badgeColor: "primary" as const,
    },
    {
      id: "2",
      name: "Maison familiale avec jardin",
      price: 220,
      category: "Maison",
      image: "/home_image1.png",
      rating: 4.8,
      reviewsCount: 12,
      badge: "Nouveau",
      badgeColor: "success" as const,
    },
    {
      id: "3",
      name: "Studio moderne proche des transports",
      price: 90,
      category: "Studio",
      image: "/home_image1.png",
      rating: 4.2,
      reviewsCount: 8,
    },
    {
      id: "4",
      name: "Loft design avec vue panoramique",
      price: 310,
      originalPrice: 350,
      category: "Loft",
      image: "/home_image1.png",
      rating: 4.9,
      reviewsCount: 45,
      badge: "Premium",
      badgeColor: "secondary" as const,
    },
  ];

  const categoryOptions = [
    { value: "Appartement", label: "Appartement" },
    { value: "Maison", label: "Maison" },
    { value: "Studio", label: "Studio" },
    { value: "Loft", label: "Loft" },
  ];

  const handlePriceChange = (values: { min: number; max: number }) => {
    setPriceFilter(values);
  };

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);

    const matchPrice = p.price >= priceFilter.min && p.price <= priceFilter.max;

    return matchCategory && matchPrice;
  });

  return (
    <main className={style.main}>
      <div className={style["filter-bar-container"]}>
        <Multiselect
          label="Catégories : "
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoryChange}
        />

        <Slider min={0} max={2000} step={50} onChange={handlePriceChange} />
      </div>

      <Catalogue products={filteredProducts} />
    </main>
  );
}
