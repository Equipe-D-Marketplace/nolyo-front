import React, { useState, useEffect, useRef, useId } from "react";
import styles from "./multiSelect.module.scss";

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value?: string[];
  onChange?: (values: string[]) => void;
  label?: string;
};

const Multiselect = ({ options, value, onChange, label }: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value ?? []);
  const triggerId = useId();

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    }
  }, [value]);

  const toggleValue = (val: string) => {
    const next = selectedValues.includes(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val];
    setSelectedValues(next);
    console.log("Multiselect selected values:", next);
    onChange?.(next);
  };

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label);

  return (
    <div ref={containerRef} className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
      )}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        id={triggerId}
      >
        {selectedLabels.length > 0
          ? selectedLabels.join(", ")
          : "Sélectionner..."}
      </button>

      {open && (
        <div role="listbox" aria-multiselectable className={styles.dropdown}>
          {options.map((opt) => (
            <label key={opt.value} className={styles.option}>
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Multiselect;
