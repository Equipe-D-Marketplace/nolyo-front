import React from "react";
import styles from "./button.module.scss"

type Props = {
  label: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  iconPosition?: string;
  type: "button" | "submit";
  classNames: string[];
  disabled?: boolean
};

const index = ({ label, handleClick, icon, classNames, type, iconPosition="left", disabled }: Props) => {
  const styleClass = [styles.btn, disabled ? styles.btn_disabled : "", ...classNames.map((name) => styles[name])].join(" ");
  return (
    <button disabled={disabled} type={type} onClick={handleClick} className={`${styleClass}`}>
      {icon && iconPosition === "left" &&( //opti flex order 
        <span className={styles.icon_wrapper}>{icon}</span>
      )}
      {label}
      {icon && iconPosition == "right" &&( //opti flex order 
        <span className={styles.icon_wrapper}>{icon}</span>
      )}
    </button>
  );
};

export default index;
