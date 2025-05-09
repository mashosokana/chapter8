"use client";

import { ChangeEvent } from "react";
import Style from "./Textarea.module.css";

type TextareaProps = {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean;
  className?: string;
};

const Textarea: React.FC<TextareaProps> = ({ 
  id, 
  value, 
  onChange, 
  disabled = false,
  className = "",
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${Style.textarea} ${className}`}
    />
  );
};

export default Textarea;