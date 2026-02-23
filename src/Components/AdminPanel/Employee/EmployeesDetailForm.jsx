import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../Admin.css";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import AdminPagination from "../AdminPagination";
import { countries, getDefaultCountry } from "../../../countryUtils";

const API_BASE = "https://api.test.hachion.co";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white",
    position: "sticky",
    top: 0,
    zIndex: 1,
    padding: "3px 5px",
    fontWeight: "bold",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: "3px 4px",
    borderRight: "1px solid #e0e0e0",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

// Field component for consistent form field styling
const Field = ({ label, required, error, children, className = "" }) => (
  <div className={`form-field ${className}`}>
    {label && (
      <label className="form-label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
    )}
    {children}
    {error && <span className="error-message">⚠ {error}</span>}
  </div>
);

const EmployeesDetailForm = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    phone: "",
    email: "",
    location: "",
    department: "",
    role: "",
    additionalInfo: "",
    employeeId: "",
    dateOfJoining: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    workEmail: "",
    workPhone: "",
    reportingManager: "",
    employmentType: "full-time",
    workLocation: "",
    shiftTiming: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",
    aadharNumber: "",
    uanNumber: "",
    pfNumber: "",
    esiNumber: "",
    salary: "",
    skills: [],
    education: [],
    previousExperience: [],
    documents: {},
  });
  const [formMode, setFormMode] = useState("Add");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [imageDisplayName, setImageDisplayName] = useState("");
  const [existingImagePath, setExistingImagePath] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const phoneInputRef = useRef(null);

  const extractFileName = (path) => (path ? path.split("/").pop() : "");

  // Tabs configuration
  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "professional", label: "Professional Details"},
    { id: "employment", label: "Employment Details"},
    { id: "bank", label: "Bank & Financial"},
    { id: "documents", label: "Documents"},
  ];

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/employees`)
      .then((res) => {
        setEmployees(res.data || []);
        setFilteredEmployees(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setEmployees([]);
        setFilteredEmployees([]);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term) ||
        emp.role?.toLowerCase().includes(term) ||
        emp.employeeId?.toLowerCase().includes(term) ||
        emp.workEmail?.toLowerCase().includes(term) ||
        emp.phone?.toLowerCase().includes(term)
    );
    setFilteredEmployees(filtered);
    setSelectedIds([]);
    setSelectAll(false);
  }, [searchTerm, employees]);

  useEffect(() => {
    fetch("https://api.country.is")
      .then((res) => res.json())
      .then((data) => {
        const match = countries.find(
          (c) => c.flag === (data?.country || "").toUpperCase()
        );
        if (match) setSelectedCountry(match);
      })
      .catch(() => {});
  }, []);

  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedEmployees.map(emp => emp.employeeId ?? emp.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  const handleSelectOne = (employeeId) => {
    if (selectedIds.includes(employeeId)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== employeeId));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, employeeId];
      setSelectedIds(newSelectedIds);
      if (newSelectedIds.length === displayedEmployees.length) {
        setSelectAll(true);
      }
    }
  };

  useEffect(() => {
    const allCurrentPageIds = displayedEmployees.map(emp => emp.employeeId ?? emp.id);
    const allSelected = allCurrentPageIds.length > 0 &&
      allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedEmployees, selectedIds]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    phoneInputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayInputChange = (field, index, key, value) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] || [])];
      if (!newArray[index]) newArray[index] = {};
      newArray[index][key] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultItem = {}) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultItem],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, image: file || "" }));
    setImageDisplayName(file ? file.name : "");
  };

  const handleDocumentChange = (e, docType) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [docType]: file },
    }));
  };

  const handleReset = () => {
    setFormData({
      id: "",
      name: "",
      image: "",
      phone: "",
      email: "",
      location: "",
      department: "",
      role: "",
      additionalInfo: "",
      employeeId: "",
      dateOfJoining: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      bloodGroup: "",
      emergencyContact: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      workEmail: "",
      workPhone: "",
      reportingManager: "",
      employmentType: "full-time",
      workLocation: "",
      shiftTiming: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      panNumber: "",
      aadharNumber: "",
      uanNumber: "",
      pfNumber: "",
      esiNumber: "",
      salary: "",
      skills: [],
      education: [],
      previousExperience: [],
      documents: {},
    });
    setImageDisplayName("");
    setExistingImagePath("");
    setFormErrors({});
    setActiveTab("personal");
  };

  const validateForm = () => {
    const errors = {};
    
    // Personal Information validation
    if (!formData.name?.trim()) errors.name = "Name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.phone?.trim()) errors.phone = "Phone is required";
    if (!formData.employeeId?.trim()) errors.employeeId = "Employee ID is required";
    
    // Professional validation
    if (!formData.department) errors.department = "Department is required";
    if (!formData.role?.trim()) errors.role = "Role is required";
    if (!formData.dateOfJoining) errors.dateOfJoining = "Date of joining is required";
    
    return errors;
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("❌ Please select at least one employee to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'employee' : 'employees'}?`;

    if (window.confirm(confirmMessage)) {
      try {
        const deletePromises = selectedIds.map(employeeId =>
          axios.delete(`${API_BASE}/employees/delete/${employeeId}`)
        );

        await Promise.all(deletePromises);

        const updatedEmployees = employees.filter(item => !selectedIds.includes(item.employeeId ?? item.id));
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);

        setSelectedIds([]);
        setSelectAll(false);

        setSuccessMessage(`✅ ${selectedIds.length} ${selectedIds.length === 1 ? 'employee' : 'employees'} deleted successfully`);
        setErrorMessage("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting employees:", error);
        setSuccessMessage("");
        setErrorMessage("❌ Error deleting some employees. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Find first tab with error
      if (errors.name || errors.email || errors.phone || errors.employeeId) {
        setActiveTab("personal");
      } else if (errors.department || errors.role || errors.dateOfJoining) {
        setActiveTab("professional");
      }
      return;
    }

    const fullPhone = `${selectedCountry.code} ${formData.phone.replace(/\D/g, "")}`;

    const employeePayload = {
      name: formData.name,
      phone: fullPhone,
      email: formData.email,
      location: formData.location,
      department: formData.department,
      role: formData.role,
      additionalInfo: formData.additionalInfo,
      employeeId: formData.employeeId,
      dateOfJoining: formData.dateOfJoining,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      bloodGroup: formData.bloodGroup,
      emergencyContact: formData.emergencyContact,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelation: formData.emergencyContactRelation,
      workEmail: formData.workEmail,
      workPhone: formData.workPhone,
      reportingManager: formData.reportingManager,
      employmentType: formData.employmentType,
      workLocation: formData.workLocation,
      shiftTiming: formData.shiftTiming,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      panNumber: formData.panNumber,
      aadharNumber: formData.aadharNumber,
      uanNumber: formData.uanNumber,
      pfNumber: formData.pfNumber,
      esiNumber: formData.esiNumber,
      salary: formData.salary,
      skills: formData.skills,
      education: formData.education,
      previousExperience: formData.previousExperience,
    };

    const fd = new FormData();
    fd.append("employee", JSON.stringify(employeePayload));
    if (formData.image) fd.append("companyImage", formData.image);
    
    // Append documents
    Object.entries(formData.documents).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    try {
      const endpoint = formData.id
        ? `${API_BASE}/employees/update/${formData.id}`
        : `${API_BASE}/employees/add`;
      const method = formData.id ? axios.put : axios.post;

      const response = await method(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(
        `Employee ${formMode === "Add" ? "added" : "updated"} successfully`
      );
      setErrorMessage("");

      if (formData.id) {
        const updatedRecord = response.data;
        setEmployees((prev) =>
          prev.map((emp) =>
            (emp.employeeId ?? emp.id) === (formData.id || updatedRecord.employeeId)
              ? { ...emp, ...updatedRecord }
              : emp
          )
        );
        setSelectedIds(prev => prev.filter(id => id !== formData.id));
      } else {
        setEmployees((prev) => [...prev, response.data]);
      }

      handleReset();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error submitting employee data");
      setSuccessMessage("");
    }
  };

  const handleEdit = (id) => {
    const emp = employees.find((e) => (e.employeeId ?? e.id) === id);
    if (emp) {
      const cleanPhone = (emp.phone || "").replace(/^\+\d+\s*/, "");
      setFormData({
        id: emp.employeeId ?? emp.id,
        name: emp.name || "",
        phone: cleanPhone,
        email: emp.email || "",
        location: emp.location || "",
        department: emp.department || "",
        role: emp.role || "",
        additionalInfo: emp.additionalInfo || "",
        image: "",
        employeeId: emp.employeeId || "",
        dateOfJoining: emp.dateOfJoining || "",
        dateOfBirth: emp.dateOfBirth || "",
        gender: emp.gender || "",
        maritalStatus: emp.maritalStatus || "",
        bloodGroup: emp.bloodGroup || "",
        emergencyContact: emp.emergencyContact || "",
        emergencyContactName: emp.emergencyContactName || "",
        emergencyContactRelation: emp.emergencyContactRelation || "",
        workEmail: emp.workEmail || "",
        workPhone: emp.workPhone || "",
        reportingManager: emp.reportingManager || "",
        employmentType: emp.employmentType || "full-time",
        workLocation: emp.workLocation || "",
        shiftTiming: emp.shiftTiming || "",
        bankName: emp.bankName || "",
        accountNumber: emp.accountNumber || "",
        ifscCode: emp.ifscCode || "",
        panNumber: emp.panNumber || "",
        aadharNumber: emp.aadharNumber || "",
        uanNumber: emp.uanNumber || "",
        pfNumber: emp.pfNumber || "",
        esiNumber: emp.esiNumber || "",
        salary: emp.salary || "",
        skills: emp.skills || [],
        education: emp.education || [],
        previousExperience: emp.previousExperience || [],
        documents: emp.documents || {},
      });
      setExistingImagePath(emp.companyImage || "");
      setImageDisplayName("");
      setFormMode("Edit");
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Employee?"))
      return;
    try {
      await axios.delete(`${API_BASE}/employees/delete/${id}`);
      setEmployees((prev) =>
        prev.filter((emp) => (emp.employeeId ?? emp.id) !== id)
      );
      setFilteredEmployees((prev) =>
        prev.filter((emp) => (emp.employeeId ?? emp.id) !== id)
      );

      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));

      setSuccessMessage("Employee details deleted successfully");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to delete employee");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  
  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setFormMode("Add");
    handleReset();
    setShowForm(true);
  };

  const getImageUrl = (storedPath) => {
    if (!storedPath) return null;
    if (storedPath.startsWith("images/")) {
      const fileOnly = storedPath.substring("images/".length);
      return `${API_BASE}/uploads/employee_company_logo/${fileOnly}`;
    }
    return `${API_BASE}/uploads/employees/${storedPath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Render personal information tab
  const renderPersonalTab = () => (
    <div className="tab-content">
      <div className="form-row">
        <Field label="Employee ID" required error={formErrors.employeeId}>
          <input
            type="text"
            name="employeeId"
            className="form-control"
            value={formData.employeeId}
            onChange={handleInputChange}
            placeholder="EMP001"
          />
        </Field>
        <Field label="Full Name" required error={formErrors.name}>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Date of Birth">
          <input
            type="date"
            name="dateOfBirth"
            className="form-control"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Gender">
          <select
            name="gender"
            className="form-select"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>

      <div className="form-row">
        <Field label="Marital Status">
          <select
            name="maritalStatus"
            className="form-select"
            value={formData.maritalStatus}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </Field>
        <Field label="Blood Group">
          <select
            name="bloodGroup"
            className="form-select"
            value={formData.bloodGroup}
            onChange={handleInputChange}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </Field>
      </div>

      <div className="form-row">
        <Field label="Personal Email" required error={formErrors.email}>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
          />
        </Field>
        <Field label="Work Email">
          <input
            type="email"
            name="workEmail"
            className="form-control"
            value={formData.workEmail}
            onChange={handleInputChange}
            placeholder="john@company.com"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Personal Phone" required error={formErrors.phone}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="mobile-button"
              style={{
                position: "absolute",
                left: "4px",
                top: "25px",
                border: "none",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <Flag code={selectedCountry.flag} style={{ width: 20 }} />
              <span style={{ fontSize: "small" }}>
                {selectedCountry.code}
              </span>
              <AiFillCaretDown size={12} />
            </button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {countries.map((country) => (
                <MenuItem
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                >
                  <Flag
                    code={country.flag}
                    style={{ width: 20, marginRight: 8 }}
                  />
                  {country.name} ({country.code})
                </MenuItem>
              ))}
            </Menu>

            <input
              type="tel"
              name="phone"
              ref={phoneInputRef}
              className="form-control"
              style={{ paddingLeft: "100px" }}
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
              placeholder="Enter Phone Number"
            />
          </div>
        </Field>
        <Field label="Work Phone">
          <input
            type="tel"
            name="workPhone"
            className="form-control"
            value={formData.workPhone}
            onChange={handleInputChange}
            placeholder="Work Phone"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Emergency Contact Name">
          <input
            type="text"
            name="emergencyContactName"
            className="form-control"
            value={formData.emergencyContactName}
            onChange={handleInputChange}
            placeholder="Emergency Contact Name"
          />
        </Field>
        <Field label="Emergency Contact Number">
          <input
            type="tel"
            name="emergencyContact"
            className="form-control"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Emergency Contact Number"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Relationship">
          <input
            type="text"
            name="emergencyContactRelation"
            className="form-control"
            value={formData.emergencyContactRelation}
            onChange={handleInputChange}
            placeholder="e.g., Spouse, Father, etc."
          />
        </Field>
        <Field label="Profile Image">
          <input
            type="file"
            name="companyImage"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
          {(imageDisplayName || existingImagePath) && (
            <small className="file-hint">
              {imageDisplayName
                ? `Selected: ${imageDisplayName}`
                : `Current: ${extractFileName(existingImagePath)}`}
            </small>
          )}
        </Field>
      </div>

      <Field label="Current Address">
        <textarea
          name="location"
          className="form-control"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Enter current address"
          rows="2"
        />
      </Field>
    </div>
  );

  // Render professional tab
  const renderProfessionalTab = () => (
    <div className="tab-content">
      <div className="form-row">
        <Field label="Department" required error={formErrors.department}>
          <select
            name="department"
            className="form-select"
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="SEO">SEO</option>
            <option value="Business">Business</option>
            <option value="Developer">Developer</option>
            <option value="Recruitment">Recruitment</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </Field>
        <Field label="Role" required error={formErrors.role}>
          <input
            type="text"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g., Senior Developer"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Date of Joining" required error={formErrors.dateOfJoining}>
          <input
            type="date"
            name="dateOfJoining"
            className="form-control"
            value={formData.dateOfJoining}
            onChange={handleInputChange}
          />
        </Field>
        <Field label="Reporting Manager">
          <input
            type="text"
            name="reportingManager"
            className="form-control"
            value={formData.reportingManager}
            onChange={handleInputChange}
            placeholder="Manager Name"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Employment Type">
          <select
            name="employmentType"
            className="form-select"
            value={formData.employmentType}
            onChange={handleInputChange}
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
            <option value="probation">Probation</option>
          </select>
        </Field>
        <Field label="Work Location">
          <input
            type="text"
            name="workLocation"
            className="form-control"
            value={formData.workLocation}
            onChange={handleInputChange}
            placeholder="Office/Remote/Hybrid"
          />
        </Field>
      </div>

      <Field label="Shift Timing">
        <input
          type="text"
          name="shiftTiming"
          className="form-control"
          value={formData.shiftTiming}
          onChange={handleInputChange}
          placeholder="e.g., 9 AM - 6 PM"
        />
      </Field>

      <div className="form-section">
        <h4 className="section-subtitle">Skills</h4>
        <div className="skills-container">
          {formData.skills.map((skill, index) => (
            <div key={index} className="skill-item form-row">
              <input
                type="text"
                className="form-control"
                placeholder="Skill"
                value={skill.name || ""}
                onChange={(e) => handleArrayInputChange("skills", index, "name", e.target.value)}
              />
              <select
                className="form-select"
                value={skill.level || ""}
                onChange={(e) => handleArrayInputChange("skills", index, "level", e.target.value)}
              >
                <option value="">Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeArrayItem("skills", index)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={() => addArrayItem("skills", { name: "", level: "beginner" })}
          >
            + Add Skill
          </button>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-subtitle">Education</h4>
        {formData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="form-row">
              <input
                type="text"
                className="form-control"
                placeholder="Degree"
                value={edu.degree || ""}
                onChange={(e) => handleArrayInputChange("education", index, "degree", e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Institution"
                value={edu.institution || ""}
                onChange={(e) => handleArrayInputChange("education", index, "institution", e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                className="form-control"
                placeholder="Year of Passing"
                value={edu.year || ""}
                onChange={(e) => handleArrayInputChange("education", index, "year", e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Percentage/Grade"
                value={edu.percentage || ""}
                onChange={(e) => handleArrayInputChange("education", index, "percentage", e.target.value)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeArrayItem("education", index)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => addArrayItem("education", { degree: "", institution: "", year: "", percentage: "" })}
        >
          + Add Education
        </button>
      </div>

      <div className="form-section">
        <h4 className="section-subtitle">Previous Experience</h4>
        {formData.previousExperience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="form-row">
              <input
                type="text"
                className="form-control"
                placeholder="Company Name"
                value={exp.company || ""}
                onChange={(e) => handleArrayInputChange("previousExperience", index, "company", e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Position"
                value={exp.position || ""}
                onChange={(e) => handleArrayInputChange("previousExperience", index, "position", e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                className="form-control"
                placeholder="Duration (e.g., 2 years)"
                value={exp.duration || ""}
                onChange={(e) => handleArrayInputChange("previousExperience", index, "duration", e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={exp.location || ""}
                onChange={(e) => handleArrayInputChange("previousExperience", index, "location", e.target.value)}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeArrayItem("previousExperience", index)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => addArrayItem("previousExperience", { company: "", position: "", duration: "", location: "" })}
        >
          + Add Experience
        </button>
      </div>
    </div>
  );

  // Render bank details tab
  const renderBankTab = () => (
    <div className="tab-content">
      <div className="form-row">
        <Field label="Bank Name">
          <input
            type="text"
            name="bankName"
            className="form-control"
            value={formData.bankName}
            onChange={handleInputChange}
            placeholder="Bank Name"
          />
        </Field>
        <Field label="Account Number">
          <input
            type="text"
            name="accountNumber"
            className="form-control"
            value={formData.accountNumber}
            onChange={handleInputChange}
            placeholder="Account Number"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="IFSC Code">
          <input
            type="text"
            name="ifscCode"
            className="form-control"
            value={formData.ifscCode}
            onChange={handleInputChange}
            placeholder="IFSC Code"
          />
        </Field>
        <Field label="PAN Number">
          <input
            type="text"
            name="panNumber"
            className="form-control"
            value={formData.panNumber}
            onChange={handleInputChange}
            placeholder="PAN Number"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="Aadhar Number">
          <input
            type="text"
            name="aadharNumber"
            className="form-control"
            value={formData.aadharNumber}
            onChange={handleInputChange}
            placeholder="Aadhar Number"
          />
        </Field>
        <Field label="UAN Number (PF)">
          <input
            type="text"
            name="uanNumber"
            className="form-control"
            value={formData.uanNumber}
            onChange={handleInputChange}
            placeholder="UAN Number"
          />
        </Field>
      </div>

      <div className="form-row">
        <Field label="PF Number">
          <input
            type="text"
            name="pfNumber"
            className="form-control"
            value={formData.pfNumber}
            onChange={handleInputChange}
            placeholder="PF Number"
          />
        </Field>
        <Field label="ESI Number">
          <input
            type="text"
            name="esiNumber"
            className="form-control"
            value={formData.esiNumber}
            onChange={handleInputChange}
            placeholder="ESI Number"
          />
        </Field>
      </div>

      <Field label="Salary (Annual)">
        <input
          type="number"
          name="salary"
          className="form-control"
          value={formData.salary}
          onChange={handleInputChange}
          placeholder="Annual Salary"
        />
      </Field>
    </div>
  );

  // Render documents tab
  const renderDocumentsTab = () => (
    <div className="tab-content">
      <Field label="Resume/CV">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleDocumentChange(e, "resume")}
        />
        <small className="file-hint">PDF, DOC, DOCX (Max 10MB)</small>
      </Field>

      <Field label="Offer Letter">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => handleDocumentChange(e, "offerLetter")}
        />
        <small className="file-hint">PDF, DOC, DOCX, Images (Max 5MB)</small>
      </Field>

      <Field label="ID Proof">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleDocumentChange(e, "idProof")}
        />
        <small className="file-hint">PDF or Images (Max 5MB)</small>
      </Field>

      <Field label="Address Proof">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleDocumentChange(e, "addressProof")}
        />
        <small className="file-hint">PDF or Images (Max 5MB)</small>
      </Field>

      <Field label="Educational Certificates">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleDocumentChange(e, "educationDocs")}
        />
        <small className="file-hint">PDF or Images (Max 10MB)</small>
      </Field>
    </div>
  );

  // Additional info field (always shown)
  const renderAdditionalInfo = () => (
    <div className="form-section">
      <Field label="Additional Information">
        <textarea
          name="additionalInfo"
          className="form-control"
          value={formData.additionalInfo}
          onChange={handleInputChange}
          placeholder="Any additional notes, achievements, or remarks"
          rows="3"
        />
      </Field>
    </div>
  );

  return (
    <>
      {showForm ? (
        <div className="course-category">
          <h3>Employees Detail Form</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a
                  href="#!"
                  onClick={() => {
                    setShowForm(false);
                    handleReset();
                  }}
                >
                  Employees Detail Form
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === "Add" ? "Add Employee Details" : "Edit Employee Details"}
              </li>
            </ol>
          </nav>

          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>
                {formMode === "Add" ? "Add New Employee Details" : "Edit Employee Details"}
              </p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Tabs Navigation */}
              <div className="form-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="form-content">
                {activeTab === "personal" && renderPersonalTab()}
                {activeTab === "professional" && renderProfessionalTab()}
                {activeTab === "employment" && renderBankTab()}
                {activeTab === "bank" && renderBankTab()}
                {activeTab === "documents" && renderDocumentsTab()}
              </div>

              {/* Additional Info - Always visible */}
              {renderAdditionalInfo()}

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {formMode === "Add" ? "Add Employee" : "Update Employee"}
                </button>
                <button
                  type="button"
                  className="reset-btn"
                  onClick={handleReset}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="course-category">
          <h3>Employees Detail Form</h3>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>Employee Details</p>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

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

              <div className="entries-right">
                <div
                  className="search-div"
                  role="search"
                  style={{ border: "1px solid #d3d3d3" }}
                >
                  <input
                    className="search-input"
                    type="search"
                    placeholder="Search Employees Detail"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn-search">
                    <IoSearch />
                  </button>
                </div>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    className="btn-category delete-btn"
                    onClick={handleBulkDelete}
                  >
                    <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
                  </button>
                )}

                <button className="btn-category" onClick={handleAddClick}>
                  <FiPlus /> Add Employee
                </button>
              </div>
            </div>
          </div>

          <TableContainer component={Paper} style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table style={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" style={{ width: '50px' }}>
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < displayedEmployees.length}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '60px' }}>S.No.</StyledTableCell>
                  {/* <StyledTableCell align="center" style={{ width: '80px' }}>Image</StyledTableCell> */}
                  <StyledTableCell align="center" style={{ width: '100px' }}>
                    Employee ID
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '120px' }}>
                    Name
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '100px' }}>
                    Department
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '100px' }}>
                    Role
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '150px' }}>
                    Email
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '120px' }}>
                    Phone
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '100px' }}>
                    Date of Joining
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '100px' }}>Location</StyledTableCell>
                  <StyledTableCell align="center" style={{ width: '100px' }}>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedEmployees.length > 0 ? (
                  displayedEmployees.map((emp, index) => (
                    <StyledTableRow key={emp.employeeId ?? emp.id}>
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedIds.includes(emp.employeeId ?? emp.id)}
                          onChange={() => handleSelectOne(emp.employeeId ?? emp.id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                        {emp.companyImage ? (
                          <img
                            src={
                              emp.companyImage.startsWith("http")
                                ? emp.companyImage
                                : `${API_BASE}/uploads/employee_company_logo/${emp.companyImage}`
                            }
                            alt="Employee"
                            width="40"
                            height="40"
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        <strong>{emp.employeeId || "—"}</strong>
                      </StyledTableCell>
                      <StyledTableCell align="center">{emp.name}</StyledTableCell>
                      <StyledTableCell align="center">
                        <span className="badge badge-primary">{emp.department || "—"}</span>
                      </StyledTableCell>
                      <StyledTableCell align="center">{emp.role}</StyledTableCell>
                      <StyledTableCell align="center">
                        <small>{emp.email}</small>
                      </StyledTableCell>
                      <StyledTableCell align="center">{emp.phone}</StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDate(emp.dateOfJoining)}
                      </StyledTableCell>
                      <StyledTableCell align="center">{emp.location || "—"}</StyledTableCell>
                      <StyledTableCell align="center">
                        <FaEdit
                          className="edit-icon"
                          onClick={() => handleEdit(emp.employeeId ?? emp.id)}
                          style={{ marginRight: '8px' }}
                        />
                        <RiDeleteBin6Line
                          className="delete-icon"
                          onClick={() => handleDelete(emp.employeeId ?? emp.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={12} align="center">
                      No employees found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="pagination-container">
            <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredEmployees.length}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeesDetailForm;