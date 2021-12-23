import Fieldset from "../../../common/dsfr/elements/Fieldset";
import GreyAccordionItem from "../../../common/dsfr/custom/GreyAccordionItem";
import styled from "styled-components";
import { Tag } from "../../../common/dsfr/elements/Tag";
import SmallCheckbox from "../../../common/dsfr/custom/SmallCheckbox";
import { castArray } from "lodash-es";
import useNavigation from "../../../common/navigation/useNavigation";
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
  let array = castArray(params[paramName]).filter((v) => v);
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

export function TypeFilter() {
  return (
    <Filter
      label={"Type"}
      paramName={"type"}
      items={[
        { code: "of-cfa", label: "OF-CFA" },
        { code: "ufa", label: "UFA" },
        { code: "entite-administrative", label: "Entité administratrive" },
      ]}
    />
  );
}

export function NdaFilter() {
  return (
    <Filter
      label={"Déclaré datagouv"}
      paramName={"numero_declaration_activite"}
      items={[
        { code: "true", label: "Oui" },
        { code: "false", label: "Non" },
      ]}
    />
  );
}
