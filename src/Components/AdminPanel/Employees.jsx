import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Admin.css";
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
import AdminPagination from "./AdminPagination";
import { countries, getDefaultCountry } from "../../countryUtils";

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
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "3px 4px",
    borderRight: "1px solid #e0e0e0",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

const Employees = () => {
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
  });
  const [formMode, setFormMode] = useState("Add");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ADD: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [imageDisplayName, setImageDisplayName] = useState("");
  const [existingImagePath, setExistingImagePath] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const phoneInputRef = useRef(null);

  const extractFileName = (path) => (path ? path.split("/").pop() : "");

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
        emp.role?.toLowerCase().includes(term)
    );
    setFilteredEmployees(filtered);
    // Reset selection on search
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
      .catch(() => { });
  }, []);

    const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ADD: Handle Select All checkbox
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

  // ADD: Handle individual checkbox
  const handleSelectOne = (employeeId) => {
    if (selectedIds.includes(employeeId)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== employeeId));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, employeeId];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedEmployees.length) {
        setSelectAll(true);
      }
    }
  };

  // ADD: Update selectAll state when page changes
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, image: file || "" }));
    setImageDisplayName(file ? file.name : "");
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
    });
    setImageDisplayName("");
    setExistingImagePath("");
  };

  // ADD: Handle bulk delete
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
        // Delete all selected employees
        const deletePromises = selectedIds.map(employeeId =>
          axios.delete(`${API_BASE}/employees/delete/${employeeId}`)
        );

        await Promise.all(deletePromises);

        // Update state
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

    const fullPhone = `${selectedCountry.code} ${formData.phone.replace(
      /\D/g,
      ""
    )}`;

    const employeePayload = {
      name: formData.name,
      phone: fullPhone,
      email: formData.email,
      location: formData.location,
      department: formData.department,
      role: formData.role,
      additionalInfo: formData.additionalInfo,
    };

    const fd = new FormData();
    fd.append("employee", JSON.stringify(employeePayload));
    if (formData.image) fd.append("companyImage", formData.image);

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
            (emp.employeeId ?? emp.id) ===
              (formData.id || updatedRecord.employeeId)
              ? { ...emp, ...updatedRecord }
              : emp
          )
        );
        // Remove from selectedIds if present
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
      });
      setExistingImagePath(emp.companyImage || "");
      setImageDisplayName("");
      setFormMode("Edit");
      setShowForm(true);
    }
  };

  // UPDATED: handleDelete function to remove from selectedIds
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

      // Remove from selectedIds if present
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

  return (
    <>
      {showForm ? (
        <div className="course-category">
          <h3>Employees</h3>
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
                  Employees
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === "Add" ? "Add Employee" : "Edit Employee"}
              </li>
            </ol>
          </nav>

          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>
                {formMode === "Add" ? "Add Employee" : "Edit Employee"}
              </p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="course-details">
                <div className="course-row">
                  <div className="col">
                    <label className="form-label">Employee Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter Employee Name"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      name="companyImage"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    {(imageDisplayName || existingImagePath) && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "4px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        {imageDisplayName
                          ? `Selected: ${imageDisplayName}`
                          : `Current: ${extractFileName(existingImagePath)}`}
                      </small>
                    )}
                  </div>

                  <div className="col">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter Location"
                    />
                  </div>
                </div>

                <div className="course-row">
                  <div className="col">
                    <label className="form-label">Phone Number</label>
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
                        required
                      />
                    </div>
                  </div>

                  <div className="col">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      required
                    />
                  </div>
                </div>

                <div className="course-row">
                  <div className="col">
                    <label className="form-label">Department</label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Department</option>
                      <option value="HR">HR</option>
                      <option value="SEO">SEO</option>
                      <option value="Business">Business</option>
                      <option value="Developer">Developer</option>
                      <option value="Recruitment">Recruitment</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      name="role"
                      className="form-control"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="Enter Role"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="form-label">Additional Info</label>
                  <textarea
                    name="additionalInfo"
                    className="form-control"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Enter Additional Info"
                    rows="4"
                  ></textarea>
                </div>

                <div className="course-row">
                  <button type="submit" className="submit-btn">
                    {formMode === "Add" ? "Submit" : "Update"}
                  </button>
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="course-category">
          <h3>Employees</h3>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>Employee Details</p>
            </div>

            {/* ADD: Success and Error Messages */}
            {successMessage && <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</div>}
            {errorMessage && <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</div>}

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
                    placeholder="Search Employees"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn-search">
                    <IoSearch />
                  </button>
                </div>

                {/* ADD: Bulk Delete Button */}
                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    className="btn-category"
                    onClick={handleBulkDelete}
                    style={{
                      backgroundColor: '#dc3545',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
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

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* ADD: Select All Checkbox */}
                  <StyledTableCell align="center">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < displayedEmployees.length}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">S.No.</StyledTableCell>
                  <StyledTableCell align="center">Image</StyledTableCell>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Phone</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Role</StyledTableCell>
                  <StyledTableCell align="center">
                    Additional Info
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedEmployees.length > 0 ? (
                  displayedEmployees.map((emp, index) => (
                    <StyledTableRow key={emp.employeeId ?? emp.id}>
                      {/* ADD: Individual Checkbox */}
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedIds.includes(emp.employeeId ?? emp.id)}
                          onChange={() => handleSelectOne(emp.employeeId ?? emp.id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {emp.companyImage ? (
                          <img
                            src={
                              emp.companyImage.startsWith("http")
                                ? emp.companyImage
                                : `https://api.test.hachion.co/uploads/test/employee_company_logo/${emp.companyImage.startsWith("/") ? emp.companyImage.substring(1) : emp.companyImage}`
                            }
                            alt="Employee"
                            width="50"
                            height="50"
                            style={{ borderRadius: "50%" }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </StyledTableCell>

                      <StyledTableCell align="center">{emp.name}</StyledTableCell>
                      <StyledTableCell align="center">{emp.phone}</StyledTableCell>
                      <StyledTableCell align="center">{emp.email}</StyledTableCell>
                      <StyledTableCell align="center">{emp.location}</StyledTableCell>
                      <StyledTableCell align="center">{emp.department}</StyledTableCell>
                      <StyledTableCell align="center">{emp.role}</StyledTableCell>
                      <StyledTableCell align="left" style={{ maxWidth: 250 }}>
                        <div
                          style={{ maxHeight: "100px", overflowY: "auto" }}
                          dangerouslySetInnerHTML={{
                            __html: emp.additionalInfo || "—",
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <FaEdit
                          className="edit"
                          onClick={() =>
                            handleEdit(emp.employeeId ?? emp.id)
                          }
                        />
                        <RiDeleteBin6Line
                          className="delete"
                          onClick={() =>
                            handleDelete(emp.employeeId ?? emp.id)
                          }
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    {/* UPDATED: Changed colSpan from 11 to 12 to include checkbox column */}
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

export default Employees;