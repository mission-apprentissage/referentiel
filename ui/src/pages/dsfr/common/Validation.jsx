import React from "react";

export default function Validation({ id, validation }) {
  return (
    <p id={id} className={`fr-${validation.type}-text`}>
      {validation.error}
    </p>
  );
}
