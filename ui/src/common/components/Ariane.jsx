import { last, lowerCase, startCase } from "lodash-es";
import Breadcrumb, { BreadcrumbLink } from "./dsfr/elements/Breadcrumb";
import React from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";

export default function Ariane() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumb>
      {breadcrumbs.map((bc, index) => {
        return (
          <BreadcrumbLink key={index} to={bc.key}>
            {bc.key === "/" ? "Accueil" : startCase(lowerCase(last(bc.key.split("/"))))}
          </BreadcrumbLink>
        );
      })}
    </Breadcrumb>
  );
}
