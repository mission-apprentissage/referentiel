import { classNames } from '../dsfr';
import { cloneElement, createRef, forwardRef, useState } from 'react';
import useElementId from '../../hooks/useElementId';
import cs from 'classnames';

export function Tabs({ label = 'Système d\'onglet', tabs, className }) {
  const clazz = classNames('fr-tabs', { className });
  const tabsId = useElementId();
  const [selectedTab, setSelectedTab] = useState(0);
  const items = tabs.map((item, index) => {
    return {
      tabId: `tab-${index}-${tabsId}`,
      panelId: `tab-panel-${index}-${tabsId}`,
      tab: item.tab,
      panel: item.panel,
      isSelected: item.tab.props.hasOwnProperty('selected') ? item.tab.props.selected : index === selectedTab,
      ref: createRef(),
      key: index,
    };
  });

  function showTab(index, el) {
    setSelectedTab(index);
    dsfr(el).tabPanel.disclose();
  }

  return (
    <div className={clazz}>
      <ul className="fr-tabs__list" role="tablist" aria-label={label}>
        {items.map((item) => {
          const { tabId, panelId, tab, isSelected, ref, key } = item;
          return (
            <li role="presentation" key={key}>
              {cloneElement(tab, {
                id: tabId,
                'aria-controls': panelId,
                'aria-selected': isSelected,
                tabIndex: isSelected ? 0 : -1,
                onClick: (e) => {
                  if (tab.props.onClick) {
                    tab.props.onClick(e);
                  }
                  showTab(key, ref.current);
                },
              })}
            </li>
          );
        })}
      </ul>
      {items.map(({ tabId, panelId, panel, isSelected, ref, key }) => {
        return cloneElement(isSelected ? panel : <TabPanel />, {
          id: panelId,
          'aria-labelledby': tabId,
          tabIndex: 0,
          ref,
          key,
        });
      })}
    </div>
  );
}

export function Tab({ children, modifiers, className, ...rest }) {
  const clazz = classNames('fr-tabs__tab', { modifiers, className });

  return (
    <button className={clazz} role="tab" {...rest}>
      {children}
    </button>
  );
}

export const TabPanel = forwardRef(({ children, modifiers, className, ...rest }, ref) => {
  const clazz = classNames('fr-tabs__panel', { modifiers, className: cs(className, 'xfr-tabs__panel--fix') });

  return (
    <div className={clazz} role="tabpanel" ref={ref} {...rest}>
      {children}
    </div>
  );
});
