import React from "react";
import { classNames } from "../dsfr";
import { cloneNodes } from "../../utils";

export function Thead({ children }) {
  return (
    <thead>
      <tr>{cloneNodes(children, () => ({ scope: "col" }))}</tr>
    </thead>
  );
}

export function Table({ caption, modifiers, thead, children, className, ...rest }) {
  const clazz = classNames("fr-table", { modifiers, className });

  return (
    <div className={clazz} {...rest}>
      <table>
        <caption>{caption}</caption>
        {thead}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
