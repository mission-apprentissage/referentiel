import Breadcrumb, { BreadcrumbCurrent, BreadcrumbLink } from "../dsfr/elements/Breadcrumb";
import React, { useContext } from "react";
import { cloneDeep } from "lodash-es";
import { FilArianeContext } from "./FilArianeProvider";

export default function FilAriane() {
  let [fil] = useContext(FilArianeContext);
  let array = cloneDeep(fil);
  if (array.length > 1) delete array[array.length - 1].to;

  return (
    <Breadcrumb>
      {array.map((f, index) => {
        let Component = f.to ? BreadcrumbLink : BreadcrumbCurrent;
        let options = f.to ? { to: f.to } : { "aria-current": "page" };
        return (
          <Component key={index} to={f.to} {...options}>
            {f.label}
          </Component>
        );
      })}
    </Breadcrumb>
  );
}
