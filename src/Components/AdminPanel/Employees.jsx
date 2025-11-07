import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import AdminPagination from "./AdminPagination";

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

  // Fetch employees
  useEffect(() => {
    axios
      .get("https://api.test.hachion.co/employees") // replace with your actual endpoint
      .then((res) => {
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      })
      .catch(console.error);
  }, []);

  // Filter
  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("additionalInfo", formData.additionalInfo);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const endpoint = formData.id
        ? `https://api.test.hachion.co/employees/update/${formData.id}`
        : "https://api.test.hachion.co/employees/add";
      const method = formData.id ? axios.put : axios.post;

      const response = await method(endpoint, formDataToSend);
      alert(`Employee ${formData.id ? "updated" : "added"} successfully`);

      if (formData.id) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === formData.id ? { ...emp, ...response.data } : emp
          )
        );
      } else {
        setEmployees((prev) => [...prev, response.data]);
      }

      handleReset();
      setShowForm(false);
    } catch (error) {
      alert("Error submitting employee data");
    }
  };

  const handleEdit = (id) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      setFormData({
        id: emp.id,
        name: emp.name || "",
        phone: emp.phone || "",
        email: emp.email || "",
        location: emp.location || "",
        department: emp.department || "",
        role: emp.role || "",
        additionalInfo: emp.additionalInfo || "",
        image: "",
      });
      setFormMode("Edit");
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Employee?"))
      return;
    try {
      await axios.delete(`https://api.test.hachion.co/employees/delete/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch {
      alert("Failed to delete employee");
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
                      name="image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
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
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter Phone Number"
                      required
                    />
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
                    <select id="inputState" 
                    class="form-select" 
                    name="department" 
                    value={formData.department} 
                    onChange={handleInputChange}>
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
                  <button type="button" className="reset-btn" onClick={handleReset}>
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
                <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
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
                  <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                  <StyledTableCell align="center">S.No.</StyledTableCell>
                  <StyledTableCell align="center">Image</StyledTableCell>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Phone</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Role</StyledTableCell>
                  <StyledTableCell align="center">Additional Info</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedEmployees.length > 0 ? (
                  displayedEmployees.map((emp, index) => (
                    <StyledTableRow key={emp.id}>
                      <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {emp.image ? (
                          <img
                            src={`https://api.test.hachion.co/uploads/employees/${emp.image}`}
                            alt="Employee"
                            width="50"
                            height="50"
                            style={{ borderRadius: "50%" }}
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
                          onClick={() => handleEdit(emp.id)}
                        />
                        <RiDeleteBin6Line
                          className="delete"
                          onClick={() => handleDelete(emp.id)}
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
