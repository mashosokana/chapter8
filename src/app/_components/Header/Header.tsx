"use client"

import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return(
    <header className={styles.header}>
      <Link href="/" className={styles.header}>
        Blog
      </Link>
      <Link href="/contact" className={styles.hederLink}>
        お問い合わせ
      </Link> 
    </header>
  )
}