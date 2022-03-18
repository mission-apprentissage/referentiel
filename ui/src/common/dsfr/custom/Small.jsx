import cs from "classnames";

export default function Small({ as, className, ...rest }) {
  let Component = as;
  return <Component className={cs("fr-text--sm fr-mb-1v", className)} {...rest} />;
}
