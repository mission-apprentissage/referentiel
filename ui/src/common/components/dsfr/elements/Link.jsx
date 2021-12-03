import React from "react";
import { buildComponent, buildListComponent } from "../common/utils";
import { Link as ReactRouterLink } from "react-router-dom";

export const LinkGroup = buildListComponent("ul", "fr-links-group");
export const Link = buildComponent(ReactRouterLink, "fr-link");
