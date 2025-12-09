import React from "react";
import styles from "./dropdown.module.scss";

type Option = { label: string; value: string };

type Props = {
  name: string;
  options: Option[];
  value?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  onChange?: (value: string) => void;
  id?: string;
};

const Dropdown: React.FC<Props> = ({
  name,
  options,
  value,
  placeholder = "Sélectionner...",
  label,
  disabled,
  required,
  errorMessage,
  onChange,
  id,
}) => {
  const selectId = id ?? name;

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          name={name}
          className={styles.select}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.caret} aria-hidden>
          ▾
        </span>
      </div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default Dropdown;

