import cs from 'classnames';


export default function Icon ({ name, className }) {
  return <span className={cs(`fr-icon-${name}`, className)} aria-hidden="true" />;
}
