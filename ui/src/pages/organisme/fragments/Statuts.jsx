import { Tag, TagGroup } from "../../../common/components/dsfr/elements/Tag";
import React from "react";
import statutsMapper from "../../../common/statutsMapper";

export default function Statuts({ organisme }) {
  if (organisme.statuts.length === 0) {
    return <span>&#8239;</span>;
  }
  return (
    <TagGroup>
      {organisme.statuts.map((statut, index) => {
        return (
          <Tag modifiers="sm" key={index}>
            {statutsMapper[statut]}
          </Tag>
        );
      })}
    </TagGroup>
  );
}
