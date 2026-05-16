import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const CustomTabs = ({ props, data = [] }: any) => {
  const [openTab, setOpenTab] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const filterData = data.filter((items: any) => items?.props !== undefined);
      if (filterData.length > 0) {
        setOpenTab(filterData[0].key);
      }
    }
  }, [data]);

  return (
    <div className="custom-tabs-container">
      {/* Left Sidebar / Tabs */}
      <div className="custom-tabs-sidebar">
        {data && data.length > 0 &&
          data
            .filter((items: any) => items?.props !== undefined)
            .map((tabItem: any) => {
              const isActive = openTab === tabItem.key;
              return (
                <button
                  key={tabItem.key || tabItem.props.label}
                  onClick={() => setOpenTab(tabItem.key)}
                  className={`custom-tabs-button ${isActive ? 'active' : ''}`}
                >
                  {tabItem.props.label}
                </button>
              );
            })}
      </div>

      {/* Right Content Area */}
      <div className="custom-tabs-content-area">
        {data && data.length > 0 &&
          data
            .filter((items: any) => items?.props !== undefined)
            .map((tabItem: any) => {
              const isActive = openTab === tabItem.key;
              return (
                <div 
                  key={tabItem.key} 
                  className={`custom-tabs-panel ${isActive ? 'active' : ''}`}
                >
                  {tabItem.props.children}
                </div>
              );
            })}

        {/* ========================================================
            COMMENTED OUT STATIC CONTENT UI FOR REFERENCE 
            (Based on the provided design image)
            ======================================================== */}
        {/* 
        <div className="custom-tabs-header">
          <div className="header-icon">
            <Users size={56} strokeWidth={2} />
          </div>
          <div className="header-text">
            <h2>Employees</h2>
            <p>Investing in skills, safety, and inclusive growth across operations.</p>
          </div>
        </div>

        <hr className="custom-tabs-divider" />

        <div className="custom-tabs-details">
          <div className="custom-tabs-section">
            <h3 className="section-title">ENGAGEMENT TOPICS</h3>
            <div className="topics-list">
              <div className="topic-item">
                <div className="topic-indicator"></div>
                Workforce safety & well-being
              </div>
              <div className="topic-item">
                <div className="topic-indicator"></div>
                Skills & capability building
              </div>
              <div className="topic-item">
                <div className="topic-indicator"></div>
                Transparent communication
              </div>
              <div className="topic-item">
                <div className="topic-indicator"></div>
                Performance & growth
              </div>
            </div>
          </div>

          <div className="custom-tabs-section value-created">
            <h3 className="section-title">VALUE CREATED</h3>
            <div className="values-list">
              <div className="value-item">
                <div className="value-indicator"></div>
                <div className="value-content">
                  <span className="value-number">2.1L</span>
                  <span className="value-desc">Learning Hours</span>
                </div>
              </div>
              <div className="value-item">
                <div className="value-indicator"></div>
                <div className="value-content">
                  <span className="value-number">100%</span>
                  <span className="value-desc">Health Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div> 
        */}
      </div>
    </div>
  );
};

export default CustomTabs;
