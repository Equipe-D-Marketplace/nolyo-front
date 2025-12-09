"use client";

import { useState, useEffect } from "react";
import Multiselect from "@/components/MultiSelect";
import Slider from "@/components/Slider";
import Catalogue from "@/components/Catalogue";
import style from "./page.module.css";
import { fetchRestApi } from "@/utils/utils";

export default function Explore() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 2000 });

  useEffect(() => {
    const load = async () => {
      const resProducts = await fetchRestApi("products", "GET");
      const resCat = await fetchRestApi("categories", "GET");

      setProducts(resProducts?.data || []);
      setCategories(resCat?.data || []);
      setLoading(false);
    };

    load();
  }, []);

  const handlePriceChange = (values: { min: number; max: number }) => {
    setPriceFilter(values);
  };

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
  };

  if (loading) return <p>Chargement des produits...</p>;

  // 🔥 Filtrage correct : ID ↔ ID
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category?.id);

    const matchPrice =
      p.price >= priceFilter.min && p.price <= priceFilter.max;

    return matchCategory && matchPrice;
  });

  return (
    <main className={style.main}>
      <div className={style["filter-bar-container"]}>
        <Multiselect
          label="Catégories : "
          options={categories.map((cat) => ({
            value: cat.id,   // 👉 ID envoyé
            label: cat.name, // 👉 label affiché
          }))}
          value={selectedCategories}
          onChange={handleCategoryChange}
        />

        <Slider min={0} max={2000} step={50} onChange={handlePriceChange} />
      </div>

      <Catalogue products={filteredProducts} />
    </main>
  );
}
