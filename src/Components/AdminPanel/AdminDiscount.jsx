import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Switch } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import "react-quill/dist/quill.snow.css";
import AdminPagination from './AdminPagination';
import Select, { components } from "react-select";
import Flag from "react-world-flags";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: '1px solid #e0e0e0',
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

const AdminDiscount = ({ onChange }) => {
  const [coupon, setCoupon] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [countries, setCountries] = useState([]);

const [formData, setFormData] = useState({
  id: "",
  course_name: "",
  discountPercentage: "",
  status: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  selectedCourses: [],
  selectedCountries: [],
  createdDate: ""
});

  const [formMode, setFormMode] = useState('Add');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoupon, setFilteredCoupon] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allCoupon, setAllCoupon] = useState([]);
   
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        axios
          .get("https://api.test.hachion.co/courses/all")
          .then((res) => {
            setCourses(res.data);
          })
          .catch((err) => {
            console.error("Error fetching courses:", err);
            setErrorMessage("Failed to load courses. Please try again.");
          });
      }, []);

const courseOptions = [
  { value: "ALL", label: "All Courses" },
  ...courses.map((course) => ({
    value: course.courseName,
    label: course.courseName,
  })),
];

const handleCourseChange = (selectedOptions) => {
  if (!selectedOptions) {
    setFormData((prev) => ({ ...prev, selectedCourses: [] }));
    return;
  }

  
  const isAllSelected = selectedOptions.some((opt) => opt.value === "ALL");

  if (isAllSelected) {
    
    setFormData((prev) => ({
      ...prev,
      selectedCourses: courses.map((c) => c.courseName),
    }));
  } else {
    const selectedValues = selectedOptions.map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, selectedCourses: selectedValues }));
  }
};

const handleCourseCheckboxChange = (courseName) => {
  setFormData((prev) => ({
    ...prev,
    selectedCourses: prev.selectedCourses.includes(courseName)
      ? prev.selectedCourses.filter((c) => c !== courseName) 
      : [...prev.selectedCourses, courseName], 
  }));
};

  
  useEffect(() => {
    axios.get("https://api.test.hachion.co/discounts-courses")
      .then(res => {
        setCoupon(res.data);
        setAllCoupon(res.data);
         setFilteredCoupon(res.data); 
      })
      .catch(console.error);
  }, []);

const filtered = coupon.filter(c => {
  const q = (searchTerm || "").toLowerCase();
  const courses = Array.isArray(c.courseNames) ? c.courseNames.join(", ") : "";
  const countries = Array.isArray(c.countryNames) ? c.countryNames.join(", ") : "";
  const disc = (c.discountPercentage ?? "").toString();
  const status = (c.status ?? "");
  const sd = (c.startDate ?? "");
  const ed = (c.endDate ?? "");

  return (
    courses.toLowerCase().includes(q) ||
    countries.toLowerCase().includes(q) ||
    disc.toLowerCase().includes(q) ||
    status.toLowerCase().includes(q) ||
    sd.toLowerCase().includes(q) ||
    ed.toLowerCase().includes(q)
  );
});

  const CheckboxOption = (props) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => null}
      style={{ marginRight: "8px" }}
    />
    <label>{props.label}</label>
  </components.Option>
);

  
  const handleInputChange = (e, name, value) => {
    if (e) {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleReset = () => {
  
    setFormData({
  id: "",
  course_name: "",            
  discountPercentage: "",
  status: false,              
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  selectedCourses: [],
  selectedCountries: [],
  createdDate: ""
});
setStartDate(null);   
  setEndDate(null);
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      discountId: formData.id || null,
      courseNames: formData.selectedCourses || [],
      countryNames: formData.selectedCountries || [],
      discountPercentage: formData.discountPercentage || "",
      startDate: startDate ? dayjs(startDate).format("MM/DD/YYYY") : "",
      endDate: endDate ? dayjs(endDate).format("MM/DD/YYYY") : "",
      status: formData.status ? "Active" : "Inactive",
    };

    if (formMode === "Add") {
      const { data: created } = await axios.post(
        "https://api.test.hachion.co/discounts-courses",
        payload
      );
      setCoupon(prev => [created, ...prev]);
      setAllCoupon(prev => [created, ...prev]);
      setFilteredCoupon(prev => [created, ...prev]);

      setSuccessMessage("✅ Discount created successfully.");
      setErrorMessage("");
      setShowForm(false);
setStartDate(null);
setEndDate(null);
      setTimeout(() => setSuccessMessage(""), 3000);

    } else if (formMode === "Edit") {
      const { data: updated } = await axios.put(
        "https://api.test.hachion.co/discounts-courses",
        payload
      );
      setCoupon(prev => prev.map(c => c.discountId === updated.discountId ? updated : c));
      setAllCoupon(prev => prev.map(c => c.discountId === updated.discountId ? updated : c));
      setFilteredCoupon(prev => prev.map(c => c.discountId === updated.discountId ? updated : c));

      setSuccessMessage("✅ Discount updated successfully.");
      setErrorMessage("");
      setShowForm(false);
      setIsEditing(false);
setStartDate(null);
setEndDate(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    }

  } catch (error) {
    console.error("❌ Error submitting coupon:", error);
    setSuccessMessage("");
    setErrorMessage("❌ Failed to submit coupon. Please try again.");
  }
};

const handleEdit = (discountId) => {
  const discountToEdit = coupon.find(c => c.discountId === discountId);

  if (discountToEdit) {
     console.log("Editing coupon:", discountToEdit);
    console.log("discountToEdit.countryNames:", discountToEdit.countryNames); 

setFormData({
  id: discountToEdit.discountId || "",
  discountPercentage: discountToEdit.discountPercentage ?? "",
  
  status: (discountToEdit.status ?? "").toLowerCase() === "active",
  startDate: discountToEdit.startDate || "",
  endDate: discountToEdit.endDate || "",
  selectedCourses: discountToEdit.courseNames || [],
  selectedCountries: discountToEdit.countryNames || []
});

const parseDate = (s) => {
  if (!s) return dayjs();
  return dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true).isValid()
    ? dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true)
    : dayjs(s);
};

setStartDate(discountToEdit.startDate ? parseDate(discountToEdit.startDate) : dayjs());
setEndDate(discountToEdit.endDate ? parseDate(discountToEdit.endDate) : dayjs());

    setFormMode("Edit");
    setShowForm(true);
  }
};


  const handleDelete = async (discountId) => {
  if (!window.confirm("Are you sure you want to delete this coupon?")) return;

  try {
    const resp = await axios.delete(`https://api.test.hachion.co/discounts-courses/${discountId}`);
    const serverMsg = resp?.data ? String(resp.data) : "";
    setCoupon(prev => prev.filter(c => c.discountId !== discountId));
    setAllCoupon(prev => prev.filter(c => c.discountId !== discountId));
    setFilteredCoupon(prev => prev.filter(c => c.discountId !== discountId));

    setSuccessMessage(serverMsg || `✅ Successfully deleted discount with id ${discountId}`);
    setErrorMessage("");

    setTimeout(() => setSuccessMessage(""), 3000);

  } catch (error) {
    console.error("❌ Error deleting coupon:", error);
    setSuccessMessage("");
    setErrorMessage("❌ Failed to delete coupon. Please try again.");
    
  }
};

  const displayedCoupon = filteredCoupon.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  
  const handleDateFilter = () => {
    
    const filtered = allCoupon.filter((item) => {
  const parse = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
  const itemStart = parse(item.startDate);
  const hasStart = startDate && dayjs(startDate).isValid();
  const hasEnd = endDate && dayjs(endDate).isValid();

  const afterStart = !hasStart || (itemStart.isValid() && itemStart.isAfter(dayjs(startDate).subtract(1, "day")));
  const beforeEnd = !hasEnd || (itemStart.isValid() && itemStart.isBefore(dayjs(endDate).add(1, "day")));

  return afterStart && beforeEnd;
});
setCoupon(filtered);

  };
  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCoupon(allCoupon);
  };
    const handleAddClick = () => {
    setFormMode('Add');
    setShowForm(true);
    handleReset();
  };

 useEffect(() => {
  axios
    .get("https://restcountries.com/v3.1/all?fields=name,cca2,currencies,flags")
    .then((res) => {
      console.log("✅ Countries API Response:", res.data);
      const formatted = res.data.map((c) => ({
        value: c.name.common,
        name: c.name.common,
        code: c.cca2,
        currency: c.currencies ? Object.keys(c.currencies)[0] : "N/A",
        flag: c.cca2,
        label: `${c.name.common} (${c.cca2}) - ${
          c.currencies ? Object.keys(c.currencies)[0] : "N/A"
        }`,
      }));
      setCountries(formatted);
    })
    .catch((err) => {
      console.error("❌ Error fetching countries:", err);
    });
}, []);

  const countryOptions = [
    { value: "ALL", label: "🌍 All Countries" },
    ...countries,
  ];

const handleCountryChange = (selected) => {
  if (!selected || selected.length === 0) {
    setFormData(prev => ({ ...prev, selectedCountries: [] }));
    return;
  }

  const isAllSelected = selected.some(opt => opt.value === "ALL");

  if (isAllSelected) {
    setFormData(prev => ({
      ...prev,
      selectedCountries: countries.map(c => c.value),
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      selectedCountries: selected.map(c => c.value),
    }));
  }
};

  const handleCountryCheckboxChange = (countryValue) => {
  const countryObj = countries.find((c) => c.value === countryValue);

  setSelectedCountries((prev) =>
    prev.some((c) => c.value === countryValue)
      ? prev.filter((c) => c.value !== countryValue) 
      : [...prev, countryObj] 
  );

  setFormData((prev) => ({
    ...prev,
    selectedCountries: prev.selectedCountries.includes(countryValue)
      ? prev.selectedCountries.filter((c) => c !== countryValue)
      : [...prev.selectedCountries, countryValue],
  }));
};

  return (
    <>
{showForm ? (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="course-category">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#!" onClick={() => { setShowForm(false); handleReset(); }}>
              Discount Courses
            </a>
            <MdKeyboardArrowRight />
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {formMode === 'Add' ? 'Add Discount Courses' : 'Edit Discount Courses'}
          </li>
        </ol>
      </nav>
      <div className="category">
        <div className="category-header">
          <p style={{ marginBottom: 0 }}>{formMode === 'Add' ? 'Add Discount Courses' : 'Edit Discount Courses'}</p>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="course-details">
            <div className="course-row">
              <div className="col-md-3">
                <label className="form-label">Course Name</label>
                <Select
                  options={courseOptions}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option: CheckboxOption }}
                  onChange={handleCourseChange}
                  value={courseOptions.filter((opt) =>
                    (formData.selectedCourses || []).includes(opt.value)
                  )}
                  placeholder="Search or select courses..."
                  
                />
                <div
                className="border rounded p-3 mt-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "5px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {(formData.selectedCourses || []).map((courseName, index) => (
                  <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.selectedCourses.includes(courseName)}
                    onChange={() => handleCourseCheckboxChange(courseName)} 
                  />
                    <label className="form-check-label">{courseName}</label>
                  </div>
                ))}
              </div>
                </div>
            </div>

           <div className="course-row">
            <div className="col-md-3">
                  <label className="form-label">Country</label>
                  {countries.length > 0 ? (
    <Select
  options={countryOptions}
  isMulti
  closeMenuOnSelect={false}
  hideSelectedOptions={false}
  components={{
    Option: (props) => (
      <div {...props.innerProps} className="d-flex align-items-center p-1">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{ marginRight: "8px" }}
        />
        {props.data.flag && <Flag code={props.data.flag} style={{ width: "20px", marginRight: "8px" }} />}
        <span>{props.data.label}</span>
      </div>
    ),
    MultiValueLabel: (props) => (
      <div className="d-flex align-items-center">
        {props.data.flag && <Flag code={props.data.flag} style={{ width: "16px", marginRight: "6px" }} />}
        <span>{props.data.label}</span>
      </div>
    ),
  }}
  onChange={handleCountryChange}
  value={countryOptions.filter(opt =>
    (formData.selectedCountries || []).includes(opt.value)
  )} 
  placeholder="Search or select countries..."
/>

                  ) : (
                    <p>Loading countries...</p>
                  )}

                  <div
                    className="border rounded p-3 mt-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "5px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
                  >
                    {selectedCountries.map((country, index) => (
                      <div key={index} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.selectedCountries.includes(country.value)}
                          onChange={() => handleCountryCheckboxChange(country.value)}
                        />
                        <label className="form-check-label">
                          {country.flag && (
                            <Flag
                              code={country.flag}
                              style={{ width: "20px", marginRight: "10px" }}
                            />
                          )}
                          {country.name} ({country.code}) - {country.currency}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

            <div className="course-row">
              <div className="col-md-3">
                <label className="form-label">Discount %</label>
                <input
                  type="text"
                  name="discountPercentage"
                  className="form-control"
                  placeholder="Enter Discount %"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <br />
                <DatePicker 
                  value={startDate} 
                  onChange={(newDate) => setStartDate(newDate)} 
                  sx={{
                  '& .MuiInputBase-root': {
                  }, '& .MuiIconButton-root':{color: '#00aeef'}
                }}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Expiry Date</label>
                <br />
                <DatePicker 
                  value={endDate} 
                  onChange={(newDate) => setEndDate(newDate)} 
                  sx={{
                  '& .MuiInputBase-root': {
                  }, '& .MuiIconButton-root':{color: '#00aeef'}
                }}
                />
              </div>
            </div>
                <div className="col" style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <label className="form-label">Status:</label>
                <br/>
                <Switch
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  color="primary"
                />
                <span>{formData.status ? 'Active' : 'Inactive'}</span>
              </div>
{successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
            <div className="course-row">
              <button type="submit" className="submit-btn">
                {formMode === 'Add' ? 'Submit' : 'Update'}
              </button>
              
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  </LocalizationProvider>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="course-category">
            <h3>Discount Courses</h3>
            <div className="category">
              <div className="category-header"><p style={{ marginBottom: 0 }}>Discount Courses Details</p></div>
              <div className="date-schedule">
                Start Date
                <DatePicker value={startDate} onChange={setStartDate} 
                sx={{
                  '& .MuiInputBase-root': {
                  }, '& .MuiIconButton-root':{color: '#00aeef'}
                }}/>
                End Date
                <DatePicker value={endDate} onChange={setEndDate} 
                sx={{
                  '& .MuiInputBase-root': {
                  }, '& .MuiIconButton-root':{color: '#00aeef'}
                }}/>
                <button className='filter' onClick={handleDateFilter}>Filter</button>
                <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>
              <div className="entries">
                <div className="entries-left">
                  <p>Show</p>
                  <div className="btn-group">
                    <button className="btn-number dropdown-toggle" data-bs-toggle="dropdown">
                      {rowsPerPage}
                    </button>
                    <ul className="dropdown-menu">
                      {[10, 25, 50].map((val) => (
                        <li key={val}>
                          <a href="#!" className="dropdown-item" onClick={() => handleRowsPerPageChange(val)}>
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
                      placeholder="Search Discount Courses"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-search"><IoSearch /></button>
                  </div>
                  <button className="btn-category" onClick={handleAddClick}>
                    <FiPlus /> Add Discount Courses
                  </button>
                </div>
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center" style={{width: '50px'}}><Checkbox /></StyledTableCell>
                    <StyledTableCell align="center">S.No.</StyledTableCell>
                    <StyledTableCell align="center">Course Name</StyledTableCell>
                    <StyledTableCell align="center">Country Name</StyledTableCell>
                    <StyledTableCell align="center">Discount %</StyledTableCell>
                    <StyledTableCell align="center">Start Date</StyledTableCell>
                    <StyledTableCell align="center">Expiry Date</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Created Date</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {displayedCoupon.length > 0 ? displayedCoupon.map((coupon, index) => (
    <StyledTableRow key={coupon.discountId}>
      <StyledTableCell align="center"><Checkbox /></StyledTableCell>
      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
      <StyledTableCell align="center">{coupon.courseNames?.join(", ")}</StyledTableCell>
      <StyledTableCell align="center">{coupon.countryNames?.join(", ")}</StyledTableCell>
      <StyledTableCell align="center">{coupon.discountPercentage}</StyledTableCell>
      <StyledTableCell align="center">{dayjs(coupon.startDate).format("MM-DD-YYYY")}</StyledTableCell>
      <StyledTableCell align="center">{dayjs(coupon.endDate).format("MM-DD-YYYY")}</StyledTableCell>
      <StyledTableCell align="left">{coupon.status}</StyledTableCell>
      <StyledTableCell align="center">{dayjs(coupon.createdDate).format('MM-DD-YYYY')}</StyledTableCell>
      <StyledTableCell align="center">
        <FaEdit className="edit" onClick={() => handleEdit(coupon.discountId)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDelete(coupon.discountId)} />
      </StyledTableCell>
    </StyledTableRow>
  )) : (
    <StyledTableRow>
      <StyledTableCell colSpan={12} align="center">No Discount Courses found</StyledTableCell>
    </StyledTableRow>
  )}
</TableBody>

              </Table>
            </TableContainer>
            <div className="pagination-container">
              <AdminPagination
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={filteredCoupon.length}
                onPageChange={handlePageChange}
              />
            </div>
            {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
{errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

          </div>
        </LocalizationProvider>
      )}
    </>
  );
};

export default AdminDiscount;
