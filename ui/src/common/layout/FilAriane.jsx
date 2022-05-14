import Breadcrumb, { BreadcrumbCurrent, BreadcrumbLink } from "../dsfr/elements/Breadcrumb";
import React from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";

export default function FilAriane({ routes }) {
  const breadcrumbs = useBreadcrumbs(routes, { disableDefaults: true });

  return (
    <Breadcrumb>
      {breadcrumbs.map(({ match, breadcrumb }, index) => {
        const last = index === breadcrumbs.length - 1;
        const Component = last ? BreadcrumbCurrent : BreadcrumbLink;
        const props = last ? { "aria-current": "page" } : { to: match.pathname };

        return (
          <Component key={index} {...props}>
            {breadcrumb}
          </Component>
        );
      })}
    </Breadcrumb>
  );
}
