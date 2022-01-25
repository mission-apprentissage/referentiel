import Fieldset from "../../../common/dsfr/elements/Fieldset";
import GreyAccordionItem from "../../../common/dsfr/custom/GreyAccordionItem";
import styled from "styled-components";
import { Tag } from "../../../common/dsfr/elements/Tag";
import SmallCheckbox from "../../../common/dsfr/custom/SmallCheckbox";
import useNavigation from "../../../common/hooks/useNavigation";
import { useContext } from "react";
import { FilterContext } from "./Filters";
import { DataContext } from "../../../common/hooks/useData";

const FilterTitle = styled(({ label, nbCheckedElements, ...rest }) => {
  return (
    <div {...rest}>
      <span>{label}</span>
      {nbCheckedElements > 0 && <Tag>{nbCheckedElements}</Tag>}
    </div>
  );
})`
  .fr-tag {
    margin-left: 0.5rem;
    color: var(--text-inverted-grey);
    background-color: var(--text-action-high-blue-france);
  }
`;

export function Filter({ label, paramName, items }) {
  let { params } = useNavigation();
  let { onChange, register } = useContext(FilterContext);
  let array = params[paramName] ? params[paramName].split(",") : [];
  register(paramName);

  return (
    <GreyAccordionItem label={<FilterTitle label={label} nbCheckedElements={array.length} />}>
      <Fieldset>
        {items.map((item, index) => {
          let checked = array.includes(item.code);
          return (
            <SmallCheckbox
              key={index}
              name={paramName}
              label={item.label}
              value={item.code}
              checked={checked}
              onChange={() => {
                let elements = checked ? array.filter((i) => i !== item.code) : [...array, item.code];
                onChange({ [paramName]: elements });
              }}
            />
          );
        })}
      </Fieldset>
    </GreyAccordionItem>
  );
}

export function DepartementsFilter() {
  let [{ departements }] = useContext(DataContext);

  return (
    <Filter
      label={"Départements"}
      paramName={"departements"}
      items={departements.map((d) => {
        return {
          code: d.code,
          label: d.nom,
        };
      })}
    />
  );
}

export function NatureFilter({ items }) {
  return (
    <Filter
      label={"Nature des organismes"}
      paramName={"natures"}
      items={
        items || [
          { code: "formateur|responsable", label: "Responsable et formateur" },
          { code: "formateur|-responsable", label: "Formateur" },
          { code: "-formateur|responsable", label: "Responsable" },
          { code: "-formateur|-responsable", label: "N.A" },
        ]
      }
    />
  );
}

export function NdaFilter() {
  return (
    <Filter
      label={"Déclaré en tant qu'Organisme Formateur"}
      paramName={"numero_declaration_activite"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}

export function IdentiteFilter() {
  return (
    <Filter
      label={"Identité validée"}
      paramName={"uai"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}
