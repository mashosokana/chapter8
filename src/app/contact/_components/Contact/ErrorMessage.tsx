"use client";

import React from "react";

type Props = {
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return message ? <div style={{ color: "red" }}>{message}</div>: null;
};

export default ErrorMessage;