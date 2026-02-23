import React, { useState } from 'react';
import Employees from './Employees';
import EmployeesDetailForm from './EmployeesDetailForm';


export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState('employees'); // Default tab is Course Details



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>   
    <h3>Employees</h3>
      <div className="certificate-tabs">
        {/* Tab Navigation */}
        <div 
          className={`tab-item ${activeTab === 'employees' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('employees')}
        >
          Employees
        </div>
        <div 
          className={`tab-item ${activeTab === 'employeesdetailform' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('employeesdetailform')}
        >
         Employees Detail Form
        </div>
      </div>
      
      {activeTab==='employees' && <Employees/>}
      {activeTab==='employeesdetailform' &&  <EmployeesDetailForm/>}
     
     
    </>
  );
}
