"use client";
import { Icon, IconName } from "@/components/utils/Icons";
import styles from "./Input.module.css";
import { useState } from "react";

interface InputProps {
  label?: string;
  type: string;
  placeholder?: string;
  width?: string | number;
  icon?: IconName;
  value: string;
  disabled?: boolean;
  maxNumber?: number;
  minNumber?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className={styles.inputSection}>
      <div className={styles.label}>{props.label}</div>
      <div
        className={`${styles.inputContainer} ${isFocused ? styles.focused : ""} ${props.disabled ? styles.disabled : ""}`}
        style={{ width: props.width || "100%" }}
      >
        {props.icon && <Icon icon={props.icon} className={styles.icon} />}
        <input
          max={props.type === "number" ? props.maxNumber : undefined}
          min={props.type === "number" ? props.minNumber : undefined}
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
    </section>
  );  
}