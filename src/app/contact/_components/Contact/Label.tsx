"use client";

import React from "react";

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor,children }) =>{
  return <Label htmlFor={htmlFor}>{children}</Label>
};

export default Label;