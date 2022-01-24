import { classNames, elementId } from "../common/utils";
import { cloneElement, createRef, forwardRef, useState } from "react";

let fixedRandomId = elementId();

export function Tabs({ label = "Système d'onglet", tabs, className }) {
  let clazz = classNames("fr-tabs", { className });
  let [selected, setSelected] = useState(0);
  let array = tabs.map((item, index) => {
    return {
      tabId: `tab-${index}-${fixedRandomId}`,
      panelId: `tab-panel-${index}-${fixedRandomId}`,
      tab: item.tab,
      panel: item.panel,
      ref: createRef(),
      key: index,
    };
  });

  function showTab(key, el) {
    setSelected(key);
    dsfr(el).tabPanel.disclose();
  }

  return (
    <div className={clazz}>
      <ul className="fr-tabs__list" role="tablist" aria-label={label}>
        {array.map(({ tabId, panelId, tab, ref, key }) => {
          return (
            <li role="presentation" key={key}>
              {cloneElement(tab, {
                id: tabId,
                "aria-controls": panelId,
                "aria-selected": key === 0,
                tabIndex: key === 0 ? 0 : -1,
                onClick: () => showTab(key, ref.current),
              })}
            </li>
          );
        })}
      </ul>
      {array.map(({ tabId, panelId, panel, ref, key }) => {
        return cloneElement(selected === key ? panel : <TabPanel />, {
          id: panelId,
          "aria-labelledby": tabId,
          tabIndex: 0,
          ref,
          key,
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
