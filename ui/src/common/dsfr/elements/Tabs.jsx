import { classNames, elementId } from "../common/utils";
import { cloneElement, createRef, forwardRef } from "react";

export function Tabs({ label = "Système d'onglet", tabs, className }) {
  let tabIds = tabs.map(() => elementId("tabs"));
  let clazz = classNames("fr-tabs", { className });
  let refs = tabs.map(() => createRef());
  function showTab(el) {
    return dsfr(el).tabPanel.disclose();
  }

  return (
    <div className={clazz}>
      <ul className="fr-tabs__list" role="tablist" aria-label={label}>
        {tabs
          .map((t) => t.tab)
          .map((tab, index) => {
            let id = tabIds[index];
            const element = cloneElement(tab, {
              id,
              "aria-controls": `${id}-panel`,
              "aria-selected": index === 0,
              onClick: () => showTab(refs[index].current),
            });

            return (
              <li role="presentation" key={index}>
                {element}
              </li>
            );
          })}
      </ul>
      {tabs
        .map((t) => t.panel)
        .map((tabPanel, index) => {
          const tabId = tabIds[index];
          let panelId = `${tabId}-panel`;
          return cloneElement(tabPanel, {
            key: index,
            id: panelId,
            ref: refs[index],
            "aria-labelledby": tabId,
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
