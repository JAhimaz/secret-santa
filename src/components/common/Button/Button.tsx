"use client";
import Link from "next/link";
import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  link?: string;
  width?: string;
  style?: React.CSSProperties;
};

export default function Button({ onClick, disabled, children, link, width, style }: ButtonProps) {

  if(link) {
    return (
      <Link href={link} className={styles.button} style={{ width, ...style }}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      style={{ width, ...style }}
    >
      {children}
    </button>
  );
}