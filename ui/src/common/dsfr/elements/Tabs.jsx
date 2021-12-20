import { classNames, elementId } from "../common/utils";
import { cloneElement, createRef, forwardRef } from "react";

export function Tabs({ label, tabs }) {
  let ids = tabs.map(() => elementId("tabs"));
  let refs = tabs.map(() => createRef());
  function showTab(el) {
    return dsfr(el).tabPanel.disclose();
  }

  return (
    <div className="fr-tabs">
      <ul className="fr-tabs__list" role="tablist" aria-label={label}>
        <li role="presentation">
          {tabs
            .map((t) => t.tab)
            .map((tab, index) => {
              let id = ids[index];
              return cloneElement(tab, {
                id,
                key: index,
                "aria-controls": `${id}-panel`,
                "aria-selected": index === 0,
                onClick: () => showTab(refs[index].current),
              });
            })}
        </li>
      </ul>
      {tabs
        .map((t) => t.panel)
        .map((panel, index) => {
          let panelId = `${ids[index]}-panel`;
          return cloneElement(panel, {
            key: index,
            id: panelId,
            ref: refs[index],
          });
        })}
    </div>
  );
}

export function Tab({ children, modifiers, className, ...rest }) {
  let clazz = classNames("fr-tabs__tab", { modifiers, className });

  return (
    <button className={clazz} role="tab" {...rest}>
      {children}
    </button>
  );
}

export const TabPanel = forwardRef(({ children, modifiers, className, ...rest }, ref) => {
  let clazz = classNames("fr-tabs__panel", { modifiers, className });

  return (
    <div className={clazz} role="tabpanel" ref={ref} {...rest}>
      {children}
    </div>
  );
});
