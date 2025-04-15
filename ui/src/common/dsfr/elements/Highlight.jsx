import { classNames } from '../dsfr';


export default function Highlight ({ modifiers, className, children }) {
  const clazz = classNames('fr-highlight', { modifiers, className });

  return (
    <div className={clazz}>
      <p>{children}</p>
    </div>
  );
}
