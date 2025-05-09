
"use client";

import React from "react";
import styles from "./FormGroup.module.css";

type Props = {
  label: string;
  children: React.ReactNode
}

const FormGroup: React.FC<Props> = ({ label, children}) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputContainer}>
        {children}
      </div>
    </div>
  )
}

export default FormGroup