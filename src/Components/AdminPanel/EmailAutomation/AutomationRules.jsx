import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AutomationRules.module.css';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AdminPagination from '../AdminPagination';
import dayjs from 'dayjs';

const API_BASE = "https://api.test.hachion.co";

const AutomationRules = () => {

  const [leadStatuses, setLeadStatuses] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [rules, setRules] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [runningRuleId, setRunningRuleId] = useState(null);
  // FORM STATES
  const [leadStatus, setLeadStatus] = useState("");
  const [timezone, setTimezone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sendTime, setSendTime] = useState(null);
  const [frequencyDays, setFrequencyDays] = useState("");
  const isAddRuleEnabled =
  leadStatus.trim() !== "" &&
  timezone.trim() !== "";

  // =====================================================
// EDIT POPUP STATES
// =====================================================

const [showEditPopup, setShowEditPopup] = useState(false);

const [editingRuleId, setEditingRuleId] = useState(null);

const [editLeadStatus, setEditLeadStatus] = useState("");

const [editTimezone, setEditTimezone] = useState("");

const [editStartDate, setEditStartDate] = useState("");

const [editEndDate, setEditEndDate] = useState("");

const [editSendTime, setEditSendTime] = useState(null);

const [editFrequencyDays, setEditFrequencyDays] = useState("");

  // =====================================================
  // FETCH LEAD STATUS
  // =====================================================

  useEffect(() => {
    fetch("https://api.test.hachion.co/register-leadtag")
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

  const handleReset = () => {
  setLeadStatus("");
  setTimezone("");
  setStartDate("");
  setEndDate("");
  setSendTime(null);
  setFrequencyDays("");
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

const handleRunAutomation = async (rule) => {

  try {

    const confirmed = window.confirm(
      `Run this automation immediately?\n\n` +
      `Lead Status : ${rule.leadStatus}\n` +
      `Timezone : ${rule.timezone}\n` +
      `Max Emails : ${rule.maxEmails}\n\n` +
      `Matching users will receive emails immediately.`
    );

   if (!confirmed) return;

// ✅ DISABLE BUTTON
setRunningRuleId(rule.id);

await axios.post(
  `${API_BASE}/automation-rules/run/${rule.id}`
);

alert("Automation executed successfully");

fetchRules();

// ✅ ENABLE AGAIN
setRunningRuleId(null);

 } catch (error) {

  console.error(error);

  // ✅ ENABLE AGAIN ON ERROR
  setRunningRuleId(null);

  alert("Failed to execute automation");
}
};

// =====================================================
// OPEN EDIT POPUP
// =====================================================

const handleEditRule = (rule) => {

  setEditingRuleId(rule.id);

  setEditLeadStatus(rule.leadStatus || "");

  setEditTimezone(rule.timezone || "");

  setEditStartDate(rule.startDate || "");

  setEditEndDate(rule.endDate || "");

  setEditFrequencyDays(
    rule.frequencyDays != null
      ? String(rule.frequencyDays)
      : ""
  );

  // TIME
  if (rule.sendTime) {

    const today = new Date();

    // const [hours, minutes] =
    //   rule.sendTime.split(":");

    const safeSendTime =
  rule.sendTime || "00:00";

const [hours, minutes] =
  safeSendTime.split(":");

    today.setHours(hours);
    today.setMinutes(minutes);

    setEditSendTime(dayjs(today));

  } else {

    setEditSendTime(null);
  }

  setShowEditPopup(true);
};

// =====================================================
// UPDATE RULE
// =====================================================

const handleUpdateRule = async () => {

  try {

    const payload = {

      startDate: editStartDate,

      endDate: editEndDate,

      frequencyDays:
        editFrequencyDays === ""
          ? null
          : parseInt(editFrequencyDays),

      sendTime:
        editSendTime
          ? editSendTime.format("HH:mm:ss")
          : null
    };

    await axios.put(
      `${API_BASE}/automation-rules/${editingRuleId}`,
      payload
    );

    alert("Rule updated successfully");

    setShowEditPopup(false);

    fetchRules();

  } catch (error) {

    console.error(error);

    alert(
      error?.response?.data ||
      "Failed to update rule"
    );
  }
};
  const handleToggleRule = async (rule) => {

  try {
    if (!rule.enabled) {

      let message = "";

      // ONE TIME
      if (rule.frequencyDays === 0) {

        message =
          `This one-time automation will run at ${rule.sendTime || "-"} ${rule.timezone || "-"}.`;

      }
      else if (rule.frequencyDays === 1) {
        message =
          `This automation will run every day at ${rule.sendTime || "-"} ${rule.timezone || "-"}.`;

      }
      else {

        message =
          `This automation will run every ${rule.frequencyDays || 0} days at ${rule.sendTime || "-"} ${rule.timezone || "-"}.`;

      }

      // ✅ TIME CHECK
      const currentTime = new Date();

      // const [hours, minutes] =
      //   rule.sendTime.split(":");

      const safeSendTime =
  rule.sendTime || "00:00";

const [hours, minutes] =
  safeSendTime.split(":");

      const ruleTime = new Date();

      ruleTime.setHours(hours);
      ruleTime.setMinutes(minutes);
      ruleTime.setSeconds(0);

      // TIME PASSED
     if (currentTime > ruleTime) {

  if (rule.frequencyDays === 0) {

    alert(
      `This one-time automation expired today at ${rule.sendTime} ${rule.timezone}. Please update send time before enabling.`
    );

    return;
  }

  message +=
    "\n\n⚠ Today's scheduled time already passed. Rule will run on next eligible schedule.";

}
      // CONFIRMATION
      const confirmed = window.confirm(message);

      if (!confirmed) return;
    }

    await axios.put(
      `${API_BASE}/automation-rules/toggle/${rule.id}`
    );

    fetchRules();

  } catch (error) {

    console.error(error);

    alert("Failed to update rule status");
  }
};
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles["automation-rules-container"]}>

        {/* FILTERS */}
        <div className={styles["automation-filters"]}>

          {/* LEAD STATUS */}
          <select
            className={styles["automation-input"]}
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
            className={styles["automation-input"]}
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
            className={styles["automation-input"]}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* END DATE */}
          <input
            type="date"
            className={styles["automation-input"]}
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
            className={styles["automation-input"]}
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

      <button
  className={styles["custom-reset-btn"]}
  onClick={handleReset}
>
  Reset
</button>

        </div>

        {/* ADD RULE */}
        <div className={styles["add-rule-wrapper"]}>

         <button
  className={styles["add-rule-btn"]}
  onClick={handleAddRule}
  disabled={!isAddRuleEnabled}
  style={{
    backgroundColor: isAddRuleEnabled ? "" : "#bdbdbd",
    cursor: isAddRuleEnabled ? "pointer" : "not-allowed",
    opacity: isAddRuleEnabled ? 1 : 0.7
  }}
>
  + Add Rule
</button>

        </div>

        {/* SHOW ENTRIES */}
        <div className={styles["entries"]}>
          <div className={styles["entries-left"]}>
            <p>Show</p>
            <div className={styles["btn-group"]}>

              <button
                className={`${styles["btn-number"]} dropdown-toggle`}
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
        <div className={styles["table-responsive"]}>
          <table className={styles["automation-table"]}>
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
                  {/* <td>{rule.ruleName}</td> */}
                  <td>{rule.ruleName || "-"}</td>

                  {/* LEAD STATUS */}
                  <td>
                    <span className={styles["warm-badge"]}>
                      {rule.leadStatus || "-"}
                    </span>
                  </td>

                  {/* TIMEZONE */}
                  <td>{rule.timezone || "-"}</td>

                  {/* SEND TIME */}
                  <td>{rule.sendTime || "-"}</td>

                  {/* FREQUENCY */}
                  <td>
  {rule.frequencyDays != null
    ? `${rule.frequencyDays} Day(s)`
    : "-"}
</td>

                  {/* MAX EMAILS */}
                  <td>{rule.maxEmails || "-"}</td>

                  {/* STATUS */}
                  <td>

                    <span className={styles["enabled-badge"]}>
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </span>

                  </td>

                  {/* LAST RUN */}
                  <td>
                    {rule.lastRunAt || "Never"}
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <div className={styles["action-buttons"]}>

{(() => {

  

  const currentTime = new Date();

  // const [hours, minutes] =
  //   rule.sendTime.split(":");

  const safeSendTime =
  rule.sendTime || "00:00";

const [hours, minutes] =
  safeSendTime.split(":");

  const ruleTime = new Date();

  ruleTime.setHours(hours);
  ruleTime.setMinutes(minutes);
  ruleTime.setSeconds(0);

  const today = new Date();

today.setHours(0,0,0,0);

const ruleEndDate =
  rule.endDate
    ? new Date(rule.endDate)
    : null;

let isExpired = false;
// ==========================================
// END DATE EXPIRED
// ==========================================

if (ruleEndDate) {

  // normalize end date
  ruleEndDate.setHours(0, 0, 0, 0);

  // END DATE ALREADY PASSED
  if (today > ruleEndDate) {

    isExpired = true;
  }

  // SAME DAY + TIME PASSED
  else if (
    today.getTime() === ruleEndDate.getTime() &&
    currentTime > ruleTime
  ) {

    isExpired = true;
  }
}

// ==========================================
// ONE TIME RULE EXPIRED
// ==========================================

if (
  rule.frequencyDays === 0 &&
  currentTime > ruleTime
) {

  isExpired = true;
}
 return (

  <>

    <button
  className={
    isExpired
      ? styles["expired-btn"]
      : styles["edit-btn"]
  }

  disabled={isExpired}

  onClick={() => handleEditRule(rule)}
>
  {isExpired ? "Lock" : "Edit"}
</button>

<button
  className={styles["run-btn"]}
  disabled={runningRuleId === rule.id}
  onClick={() => handleRunAutomation(rule)}
>
  {runningRuleId === rule.id
    ? "Running..."
    : "Run"}
</button>

<button
  className={
    isExpired
      ? styles["expired-btn"]
      : rule.enabled
      ? styles["disable-btn"]
      : styles["enable-btn"]
  }

  disabled={isExpired}

  onClick={() => handleToggleRule(rule)}
>
  {isExpired
    ? "Expired"
    : rule.enabled
    ? "Disable"
    : "Enable"}
</button>

  </>

);

})()}

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
      {/* =====================================================
    EDIT POPUP
===================================================== */}

{showEditPopup && (

  <div className={styles["popup-overlay"]}>

    <div className={styles["popup-container"]}>

      <h3>Edit Automation Rule</h3>

      {/* LEAD STATUS */}

      {/* <select
        className={styles["automation-input"]}
        value={editLeadStatus}
        disabled
      >
        <option value="">
          Select Lead Status
        </option>
      </select> */}

<input
  type="text"
  className={`${styles["automation-input"]} ${styles["disabled-input"]}`}
  value={editLeadStatus}
  disabled
/>
      {/* TIMEZONE */}

    <input
  type="text"
  className={`${styles["automation-input"]} ${styles["disabled-input"]}`}
  value={editTimezone}
  disabled
/>

      {/* START DATE */}

      <input
        type="date"
        className={styles["automation-input"]}
        value={editStartDate}
        onChange={(e) =>
          setEditStartDate(e.target.value)
        }
      />

      {/* END DATE */}

      <input
        type="date"
        className={styles["automation-input"]}
        value={editEndDate}
        onChange={(e) =>
          setEditEndDate(e.target.value)
        }
      />

      {/* TIME PICKER */}

     <TimePicker
  label="Select Time"
  ampm={true}
  value={editSendTime}
  onChange={(newValue) =>
    setEditSendTime(newValue)
  }
  renderInput={(params) => (
    <TextField {...params} />
  )}
  slotProps={{
    popper: {
      sx: {
        zIndex: 999999
      }
    }
  }}
  sx={{
    "& .MuiInputBase-root": {
      width: "100%",
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
        className={styles["automation-input"]}
        value={editFrequencyDays}
        onChange={(e) =>
          setEditFrequencyDays(e.target.value)
        }
      >
        <option value="0">One Time</option>
        <option value="1">Every Day</option>
        <option value="2">Every 2 Days</option>
        <option value="3">Every 3 Days</option>
      </select>

      {/* BUTTONS */}

      <div className={styles["popup-buttons"]}>

        <button
          className={styles["enable-btn"]}
          onClick={handleUpdateRule}
        >
          Update
        </button>

        <button
          className={styles["disable-btn"]}
          onClick={() =>
            setShowEditPopup(false)
          }
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
    </LocalizationProvider>
  );
};

export default AutomationRules;