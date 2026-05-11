import React, { useState } from 'react';
import '../Admin.css';

import AutomationRules from './AutomationRules';

const PreviewLeads = () => <div>Preview Leads Screen</div>;
const EmailHistory = () => <div>Email History Screen</div>;

export default function EmailAutomation() {

  const [activeTab, setActiveTab] = useState('automationrules');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>

      <h3>Email Automation</h3>

      <div className="certificate-tabs">

        <div
          className={`tab-item ${
            activeTab === 'automationrules'
              ? 'active-tab'
              : ''
          }`}
          onClick={() => handleTabChange('automationrules')}
        >
          Automation Rules
        </div>

        <div
          className={`tab-item ${
            activeTab === 'previewleads'
              ? 'active-tab'
              : ''
          }`}
          onClick={() => handleTabChange('previewleads')}
        >
          Preview Leads
        </div>

        <div
          className={`tab-item ${
            activeTab === 'emailhistory'
              ? 'active-tab'
              : ''
          }`}
          onClick={() => handleTabChange('emailhistory')}
        >
          Email History
        </div>

      </div>

      {activeTab === 'automationrules' &&
        <AutomationRules />
      }

      {activeTab === 'previewleads' &&
        <PreviewLeads />
      }

      {activeTab === 'emailhistory' &&
        <EmailHistory />
      }

    </>
  );
}