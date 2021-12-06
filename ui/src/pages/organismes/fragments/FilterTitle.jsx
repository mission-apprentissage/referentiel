import { Tag } from "../../../common/components/dsfr/elements/Tag";

export default function FilterTitle({ label, nbCheckedElements }) {
  return (
    <div>
      <span>{label}</span>
      {nbCheckedElements > 0 && <Tag>{nbCheckedElements}</Tag>}
    </div>
  );
}
