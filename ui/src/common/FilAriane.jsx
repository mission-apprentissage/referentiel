import Breadcrumb, { BreadcrumbCurrent, BreadcrumbLink } from "./dsfr/elements/Breadcrumb";
import React from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { ValidationTitle } from "../pages/validation/ValidationPage";
import { OrganismeTitle } from "../pages/organisme/OrganismePage";

export default function FilAriane() {
  const routes = [
    { path: "/", breadcrumb: "Tableau de bord" },
    { path: "/validation/:validationStatus", breadcrumb: ValidationTitle },
    { path: "/validation/:validationStatus/:siret", breadcrumb: OrganismeTitle },
    { path: "/organismes", breadcrumb: "Liste des organismes" },
    { path: "/organismes/:siret", breadcrumb: OrganismeTitle },
  ];
  const breadcrumbs = useBreadcrumbs(routes, { disableDefaults: true });

  return (
    <Breadcrumb>
      {breadcrumbs.map(({ match, breadcrumb }, index) => {
        let last = index === breadcrumbs.length - 1;
        let Component = last ? BreadcrumbCurrent : BreadcrumbLink;
        let props = last ? { "aria-current": "page" } : { to: match.pathname };

        return (
          <Component key={index} {...props}>
            {breadcrumb}
          </Component>
        );
      })}
    </Breadcrumb>
  );
}
