import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AutomationRules.css';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AdminPagination from '../AdminPagination';

const API_BASE = "http://localhost:8081";

const AutomationRules = () => {

  const [leadStatuses, setLeadStatuses] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [rules, setRules] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // FORM STATES
  const [leadStatus, setLeadStatus] = useState("");
  const [timezone, setTimezone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sendTime, setSendTime] = useState(null);
  const [frequencyDays, setFrequencyDays] = useState("");

  // =====================================================
  // FETCH LEAD STATUS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:8081/register-leadtag")
      .then(res => res.json())
      .then(data => setLeadStatuses(data || []))
      .catch(error =>
        console.error("Error fetching lead statuses:", error)
      );
  }, []);

  // =====================================================
  // FETCH TIMEZONES
  // =====================================================

  useEffect(() => {
    fetch(`${API_BASE}/register-timezones`)
      .then(res => res.json())
      .then(data => setTimezones(data || []))
      .catch(error =>
        console.error("Error fetching timezones:", error)
      );
  }, []);

  // =====================================================
  // FETCH RULES
  // =====================================================

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${API_BASE}/automation-rules`);
      setRules(response.data || []);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
    }
  };

  // =====================================================
  // ADD RULE
  // =====================================================

  const handleAddRule = async () => {

    try {

      const payload = {
        leadStatus,
        timezone,
        frequencyDays: frequencyDays === "" ? null : parseInt(frequencyDays),
        sendTime: sendTime ? sendTime.format("HH:mm:ss") : null,
        startDate,
        endDate,
        enabled: true,
        maxEmails: 50
      };

      await axios.post(`${API_BASE}/automation-rules`, payload);

      // RESET FORM
      setLeadStatus("");
      setTimezone("");
      setStartDate("");
      setEndDate("");
      setSendTime(null);
      setFrequencyDays("");

      fetchRules();

      alert("Automation rule added successfully");

    } catch (error) {

      console.error("Error saving automation rule:", error);

      alert("Failed to save automation rule");
    }
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const displayedRules = rules.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = page => setCurrentPage(page);

  const handleRowsPerPageChange = rows => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const handleSelectAll = (event) => {

    if (event.target.checked) {

      const allIds = displayedRules.map(rule => rule.id);

      setSelectedIds(allIds);

      setSelectAll(true);

    } else {

      setSelectedIds([]);

      setSelectAll(false);
    }
  };

  // =====================================================
  // SINGLE SELECT
  // =====================================================

  const handleSelectOne = (id) => {

    if (selectedIds.includes(id)) {

      setSelectedIds(
        selectedIds.filter(selectedId => selectedId !== id)
      );

      setSelectAll(false);

    } else {
      const updatedIds = [...selectedIds, id];
      setSelectedIds(updatedIds);

      if (updatedIds.length === displayedRules.length)
        setSelectAll(true);
    }
  };

  // =====================================================
  // RUN AUTOMATION
  // =====================================================

  const handleRunAutomation = async (id) => {
    try {
      await axios.post(`${API_BASE}/automation-rules/run/${id}`);
      alert("Automation executed successfully");
      fetchRules();
    } catch (error) {
      console.error(error);
      alert("Failed to execute automation");
    }
  };

  // =====================================================
  // TOGGLE RULE
  // =====================================================

  const handleToggleRule = async (id) => {
    try {
      await axios.put(`${API_BASE}/automation-rules/toggle/${id}`);
      fetchRules();
    } catch (error) {
      console.error(error);
      alert("Failed to update rule status");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="automation-rules-container">

        {/* FILTERS */}
        <div className="automation-filters">

          {/* LEAD STATUS */}
          <select
            className="automation-input"
            value={leadStatus}
            onChange={(e) => setLeadStatus(e.target.value)}
          >
            <option value="">All Lead Status</option>

            {leadStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* TIMEZONE */}
          <select
            className="automation-input"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="">All Timezones</option>

            {timezones.map((timezone, index) => (
              <option key={index} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>

          {/* START DATE */}
          <input
            type="date"
            className="automation-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* END DATE */}
          <input
            type="date"
            className="automation-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* TIME PICKER */}
          <TimePicker
            label="Select Time"
            ampm={true}
            value={sendTime}
            onChange={(newValue) => setSendTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
            sx={{
              "& .MuiInputBase-root": {
                width: "200px",
                height: "42px",
                background: "#fff"
              },
              "& .MuiIconButton-root": {
                color: "#00aeef"
              }
            }}
          />

          {/* FREQUENCY */}
          <select
            className="automation-input"
            value={frequencyDays}
            onChange={(e) => setFrequencyDays(e.target.value)}
          >
            <option value="">All Frequency</option>
           <option value="0">One Time</option>
<option value="1">Every Day</option>
<option value="2">Every 2 Days</option>
<option value="3">Every 3 Days</option>
          </select>
{/* 
          <button className="custom-filter-btn">
            Filter
          </button> */}

          <button className="custom-reset-btn">
            Reset
          </button>

        </div>

        {/* ADD RULE */}
        <div className="add-rule-wrapper">

          <button
            className="add-rule-btn"
            onClick={handleAddRule}
          >
            + Add Rule
          </button>

        </div>

        {/* SHOW ENTRIES */}
        <div className="entries">
          <div className="entries-left">
            <p>Show</p>
            <div className="btn-group">

              <button
                className="btn-number dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {rowsPerPage}
              </button>
              <ul className="dropdown-menu">
                {[10, 25, 50].map((val) => (
                  <li key={val}>
                    <a
                      href="#!"
                      className="dropdown-item"
                      onClick={() => handleRowsPerPageChange(val)}
                    >
                      {val}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p>entries</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="automation-table">
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < displayedRules.length
                    }
                  />

                </th>

                <th>Rule Name</th>
                <th>Lead Status</th>
                <th>Timezone</th>
                <th>Send Time</th>
                <th>Frequency</th>
                <th>Max Emails</th>
                <th>Status</th>
                <th>Last Run</th>
                <th>Actions</th>

              </tr>
            </thead>
            <tbody>
              {displayedRules.map((rule) => (

                <tr key={rule.id}>

                  {/* CHECKBOX */}
                  <td>
                    <Checkbox
                      checked={selectedIds.includes(rule.id)}
                      onChange={() => handleSelectOne(rule.id)}
                    />
                  </td>

                  {/* RULE NAME */}
                  <td>{rule.ruleName}</td>

                  {/* LEAD STATUS */}
                  <td>
                    <span className="warm-badge">
                      {rule.leadStatus}
                    </span>
                  </td>

                  {/* TIMEZONE */}
                  <td>{rule.timezone}</td>

                  {/* SEND TIME */}
                  <td>{rule.sendTime}</td>

                  {/* FREQUENCY */}
                  <td>{rule.frequencyDays} Day(s)</td>

                  {/* MAX EMAILS */}
                  <td>{rule.maxEmails}</td>

                  {/* STATUS */}
                  <td>

                    <span className="enabled-badge">
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </span>

                  </td>

                  {/* LAST RUN */}
                  <td>
                    {rule.lastRunAt ? rule.lastRunAt : "Never"}
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <div className="action-buttons">

                      <button className="edit-btn">
                        Edit
                      </button>

                      {/* RUN */}

                      <button
                        className="run-btn"
                        onClick={() => handleRunAutomation(rule.id)}
                      >
                        Run
                      </button>

                      {/* ENABLE / DISABLE */}

                      {/* <button
                        className="disable-btn"
                        onClick={() => handleToggleRule(rule.id)}
                      >
                        {rule.enabled ? "Disable" : "Enable"}
                      </button> */}

                    </div>

                  </td>
                </tr>
              ))}

            </tbody>
          </table>

        </div>

        {/* PAGINATION */}

        <div className="pagination-container">

          <AdminPagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalRows={rules.length}
            onPageChange={handlePageChange}
          />

        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AutomationRules;