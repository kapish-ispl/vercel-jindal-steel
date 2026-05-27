import React, { useState, useEffect, useMemo } from 'react';

interface TabProps {
  label?: string;
  children?: React.ReactNode;
  className?: string;
}
const CustomTabs = ({ props, data = [] }: any) => {
  const [openTab, setOpenTab] = useState<any>(null);

  const tabs = useMemo(() => {
    if (!data) return [];

    return React.Children.toArray(data)
      .filter(
        (child): child is React.ReactElement<TabProps> =>
          React.isValidElement(child) &&
          typeof (child.props) !== "undefined"
      )
      .map((child, index) => ({
        id: index + 1,
        label: child.props?.label,
        class: child.props?.className || '',
        children: child.props?.children,
      }));
  }, [data]);


  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setOpenTab(tabs[0].id);
    }
  }, [tabs]);

  return (
    <div className="custom-tabs-container">
      {/* Left Sidebar / Tabs */}

      <div className="custom-tabs-sidebar">
        {tabs && tabs.length > 0 &&
          tabs.map((tabItem: any) => {
            const isActive = openTab === tabItem.id;
            return (
              <button key={tabItem.id} onClick={() => setOpenTab(tabItem.id)} className={`custom-tabs-button ${tabItem.class ?? ""} ${isActive ? 'active' : ''}`}>
                {tabItem.label}
              </button>
            );
          })}
      </div>

      {/* Right Content Area */}
      <div className="custom-tabs-content-area">
        {tabs && tabs.length > 0 &&
          tabs.map((tabItem: any) => {
            const isActive = openTab === tabItem.id;
            return (
              <div key={tabItem.id} className={`custom-tabs-panel ${tabItem.class ?? ""} ${isActive ? 'active' : ''}`}>
                {tabItem.children}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default CustomTabs;
