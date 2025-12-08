import React from "react";
import styles from "./input.module.scss";

type CommonProps = {
  name: string;
  label?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
};

type TextInputProps = CommonProps & {
  type: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
};

type RadioInputProps = CommonProps & {
  type: "radio";
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  labelLeftIcon?: React.ReactNode;
};

type Props = TextInputProps | RadioInputProps;

const Input: React.FC<Props> = (props) => {
  const {
    type,
    name,
    label,
    errorMessage,
    onChange,
    onBlur,
    disabled,
    required,
  } = props;
  const id = props.id ?? name;

  if (type === "radio") {
    const { value, checked, defaultChecked } = props as RadioInputProps;
    return (
      <div>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
        />
        {label && (
          <label htmlFor={id} className={styles.radio_label}>
            {(props as RadioInputProps).labelLeftIcon && (
              <span className={styles.label_left_icon} aria-hidden>
                {(props as RadioInputProps).labelLeftIcon}
              </span>
            )}
            {label}
          </label>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    );
  }

  const { value, defaultValue, placeholder, autoComplete, leftIcon } =
    props as TextInputProps;
  return (
    <div className={styles.input_container}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles.input_wrapper}>
        {leftIcon && <span className={styles.left_icon} aria-hidden>{leftIcon}</span>}
        <input
          className={leftIcon ? `${styles.input} ${styles.input_with_icon}` : styles.input}
          type={type}
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
        />
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Input;
