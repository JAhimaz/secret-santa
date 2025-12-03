"use client";
import styles from "./Loader.module.css";

type LoaderProps = {
  size?: string | number;
};

export default function Loader({ size = 24 }: LoaderProps) {
  return <span className={styles.loader} style={{
    ['--size' as any]: typeof size === 'number' ? `${size}px` : size,
  }}></span>;
}