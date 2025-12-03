"use client";
import { Icon, IconName } from "@/components/utils/Icons";
import styles from "./Input.module.css";
import { useState } from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  width?: string | number;
  icon?: IconName;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`${styles.inputContainer} ${isFocused ? styles.focused : ""} ${props.disabled ? styles.disabled : ""}`}
      style={{ width: props.width || "100%" }}
    >
      {props.icon && <Icon icon={props.icon} className={styles.icon} />}
      <input
        type={props.type}
        placeholder={props.placeholder}
        className={styles.input}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );  
}