"use client"
import React, { useState } from "react";
import styles from "./slider.module.scss";

interface PriceSliderProps {
  min?: number;
  max?: number;
  step?: number;
  onChange?: (values: { min: number; max: number }) => void;
}

const Slider = ({
  min = 0,
  max = 1000,
  step = 10,
  onChange,
}: PriceSliderProps) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
    onChange?.({ min: value, max: maxValue });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
    onChange?.({ min: minValue, max: value });
  };

  const rangeWidth = ((maxValue - min) / (max - min)) * 100;
  const leftPos = ((minValue - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.header}>
        <span>Prix : </span>
        <strong>
          {minValue}€ – {maxValue}€
        </strong>
      </div>

      <div className={styles.slider}>
        <div
          className={styles.progress}
          style={{ left: `${leftPos}%`, width: `${rangeWidth - leftPos}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
};

export default Slider;
