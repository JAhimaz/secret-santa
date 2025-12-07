"use client";
import styles from "./Loader.module.css";

type LoaderProps = {
  size?: string | number;
  dark?: boolean;
};

export default function Loader({ size = 24, dark = false }: LoaderProps) {
  return <span className={styles.loader} style={{
    ['--size' as any]: typeof size === 'number' ? `${size}px` : size,
    ['--color' as any]: dark ? 'var(--highlight)' : 'var(--text-inverse)',
  }}></span>;
}