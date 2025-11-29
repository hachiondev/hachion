import React, { useState } from 'react';
import './Admin.css';
import OnlinePayment from './OnlinePayment';
import OfflinePayment from './OfflinePayment';
import RequestInstallment from './RequestInstallment';
export default function Certificate() {
  const [activeTab, setActiveTab] = useState('requestInstallment');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>Payment Tracking</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'requestInstallment' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('requestInstallment')}
        >
         Installment Requests
        </div>
        <div 
          className={`tab-item ${activeTab === 'onlinePayment' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('onlinePayment')}
        >
         Online Payment
        </div>
        <div 
          className={`tab-item ${activeTab === 'offlinePayment' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('offlinePayment')}
        >
          Offline Payment
        </div>
      </div>  
      {activeTab==='requestInstallment' &&  <RequestInstallment/>}
      {activeTab==='onlinePayment' &&  <OnlinePayment/>}
      {activeTab==='offlinePayment' &&  <OfflinePayment/>}
    </>
  );
}