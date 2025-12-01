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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Employee?"))
      return;
    try {
      await axios.delete(`${API_BASE}/employees/delete/${id}`);
      setEmployees((prev) =>
        prev.filter((emp) => (emp.employeeId ?? emp.id) !== id)
      );
      setSuccessMessage("Employee details deleted successfully");
      setErrorMessage("");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to delete employee");
      setSuccessMessage("");
    }
  };

  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
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
                  <StyledTableCell align="center">
                    <Checkbox />
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
                      <StyledTableCell align="center">
                        <Checkbox />
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
          : `https://api.test.hachion.co/uploads/prod/employee_company_logo/${emp.companyImage.startsWith("/") ? emp.companyImage.substring(1) : emp.companyImage}`
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
                    <StyledTableCell colSpan={11} align="center">
                      No employees found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {successMessage && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
          )}

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
