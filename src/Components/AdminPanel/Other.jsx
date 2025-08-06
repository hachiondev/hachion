import React, { useEffect } from "react";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { duration, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import "./Admin.css";
import { RiCloseCircleLine } from "react-icons/ri";
import success from "../../Assets/success.gif";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IoSearch } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { MdKeyboardArrowRight } from "react-icons/md";
import AdminPagination from "./AdminPagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white", // Add vertical lines
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: "1px solid #e0e0e0", // Add vertical lines for body rows
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Other() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [banner, setBanner] = useState([]);
  const [filteredBanner, setFilteredBanner] = useState([]);
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedData, setEditedData] = useState({
    banner_image: "",
    home_banner_image: "",
    path: "",
    status: "Enabled",
    home_status: "Enabled",
  });
  const [bannerData, setBannerData] = useState({
    banner_image: "",
    home_banner_image: "",
    path: "",
    date: currentDate,
    status: "",
    home_status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };
  // Inside your CourseCategory component

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to the first page whenever rows per page changes
  };

  const displayedCourse = filteredBanner.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleFileChange = (e, imageType) => {
    setBannerData((prev) => ({
      ...prev,
      [imageType]: e.target.files[0],
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFileChange = (e, imageType) => {
    const file = e.target.files[0];
    setEditedData((prev) => ({
      ...prev,
      [imageType]: e.target.files[0],
    }));
  };

  useEffect(() => {
    const filtered = banner.filter(
      (item) =>
        item?.path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.date?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBanner(filtered);
  }, [searchTerm, banner]);

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/banner");
        console.log(response.data);
        setBanner(response.data); // Use the curriculum state
        setFilteredBanner(response.data);
      } catch (error) {
        console.error("Error fetching resume:", error.message);
      }
    };
    fetchBanner();
  }, []);

  const handleDeleteConfirmation = (banner_id) => {
    if (window.confirm("Are you sure you want to delete this banner")) {
      handleDelete(banner_id);
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      const jsonData = {
        status: editedData.status,
        home_status: editedData.home_status,
        path: editedData.path,
      };
      console.log("bannerdata", jsonData);
      formDataToSend.append(
        "banner",
        new Blob([JSON.stringify(jsonData)], { type: "application/json" })
      );
      console.log(editedData);
      // Ensure banner_image is sent only if updated
      if (
        editedData.banner_image instanceof File &&
        editedData.banner_image !== ""
      ) {
        formDataToSend.append("banner_image", editedData.banner_image);
      } else {
        formDataToSend.append("banner_image", ""); // Prevent missing key issue
      }

      // Ensure home_banner_image is sent only if updated
      if (
        editedData.home_banner_image instanceof File &&
        editedData.home_banner_image !== ""
      ) {
        formDataToSend.append(
          "home_banner_image",
          editedData.home_banner_image
        );
      } else {
        formDataToSend.append("home_banner_image", "");
      }

      console.log("FormData Entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]); // Debugging output
      }

      // Send the update request
      const response = await axios.put(
        `https://api.hachion.co/banner/update/${editedData.banner_id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      // Update banner list state
      setFilteredBanner((prev) =>
        prev.map((curr) =>
          curr.banner_id === editedData.banner_id
            ? { ...curr, ...editedData }
            : curr
        )
      );

      setMessage("Banner updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
    } catch (error) {
      console.error(
        "Error updating banner:",
        error.response?.data || error.message
      );
      setMessage("Error updating Banner.");
    }
  };

  const handleDelete = async (banner_id) => {
    try {
      const response = await axios.delete(
        `https://api.hachion.co/banner/delete/${banner_id}`
      );
      console.log("Banner deleted successfully:", response.data);
      setFilteredBanner((prev) =>
        prev.filter((banner) => banner.banner_id !== banner_id)
      );

      setMessage("Banner deleted successfully.");
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleClickOpen = (row) => {
  setEditedData({
    ...row,
    home_status: row.home_status?.toLowerCase() === "disabled" ? "Disabled" : "Enabled",
    status: row.status?.toLowerCase() === "disabled" ? "Disabled" : "Enabled"
  });
  setOpen(true);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    //  console.log(value);
    setBannerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get("https://api.hachion.co/banner");
      setFilteredBanner(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleSubmit = async (e, actionType) => {
    e.preventDefault();

    if (
      actionType === "banner" &&
      (!bannerData.banner_image || bannerData.banner_image === "")
    ) {
      alert("Please select a file before submitting.");
      return;
    }

    console.log("Action Type:", actionType);
    console.log("Banner Data:", bannerData);
    console.log("Banner Image:", bannerData?.home_banner_image);
    if (
      actionType === "homeBanner" &&
      (!bannerData || // Ensure the object exists
        !bannerData.home_banner_image ||
        bannerData.home_banner_image === undefined ||
        bannerData.home_banner_image === null)
    ) {
      alert("Please select a file before submitting.");
      return;
    }

    console.log("Validation triggered!");

    console.log(
      "Type of bannerData.home_banner_image:",
      typeof bannerData?.home_banner_image
    );
    console.log("Banner Image Value:", bannerData?.home_banner_image);
    const formDataToSend = new FormData();
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date
    const jsonData = {
      date: currentDate,
      path: bannerData.path,
    };
    if (actionType === "banner" && bannerData.banner_image) {
      formDataToSend.append("banner_image", bannerData.banner_image);
      jsonData.status = "Enabled";
    } else if (actionType === "homeBanner" && bannerData.home_banner_image) {
  formDataToSend.append("home_banner_image", bannerData.home_banner_image);
  jsonData.home_status = "Enabled";
}
    // Append JSON data as a Blob
    formDataToSend.append(
      "banner",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    try {
      const response = await axios.post(
        "https://api.hachion.co/banner/add",
        formDataToSend
      );
      console.log(response.data);
      if (response.status === 201) {
        alert("Banner added successfully!");
        await fetchBanners(); // Refresh banner list from API
        setShowAddCourse(false);
      }
    } catch (error) {
      console.error(
        "Error submitting banner:",
        error.response?.data || error.message
      );
      alert(
        `Error: ${error.response?.data?.message || "Something went wrong!"}`
      );
    }
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
  };
  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      {showAddCourse ? (
        <div className="course-category">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>
                  Banner
                </a>{" "}
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Banner
              </li>
            </ol>
          </nav>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>Add Banner </p>
            </div>
            <form encType="multipart/form-data">
              <div>
                <div className="course-details">
                  <div className="col">
                    <label className="form-label">Banner popup Image (max-width=800px, max-height=500px)</label>
                    <input
                      type="file"
                      className="schedule-input"
                      accept="image/*"
                      name="banner_image"
                      onChange={(e) => handleFileChange(e, "banner_image")}
                      required
                    />
                  </div>
                  <div
                    className="update"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <button
                      className="submit-btn"
                      onClick={(e) => handleSubmit(e, "banner")}
                    >
                      Upload
                    </button>
                  </div>
                </div>
                <div className="course-details">
                  <div className="col">
                    <label className="form-label">
                      Home Banner Image (width=1440px, height=450px)
                    </label>
                    <input
                      type="file"
                      className="schedule-input"
                      accept="image/*"
                      name="home_banner_image"
                      onChange={(e) => handleFileChange(e, "home_banner_image")}
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Path (URL)</label>
                    <input
                      type="link"
                      className="schedule-input"
                      name="path"
                      value={bannerData?.path ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="update"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <button
                      className="submit-btn"
                      onClick={(e) => handleSubmit(e, "homeBanner")}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="course-category">
              <div className="category">
                <div className="category-header">
                  <p style={{ marginBottom: 0 }}>Banner</p>
                </div>
                <div className="date-schedule">
                  Start Date
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    sx={{
                      "& .MuiIconButton-root": { color: "#00aeef" },
                    }}
                  />
                  End Date
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    isClearable
                    sx={{
                      "& .MuiIconButton-root": { color: "#00aeef" },
                    }}
                  />
                  <button className="filter">Filter</button>
                </div>
                <div className="entries">
                  <div className="entries-left">
                    <p style={{ marginBottom: "0" }}>Show</p>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn-number dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {rowsPerPage}
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(10)}
                          >
                            10
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(25)}
                          >
                            25
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(50)}
                          >
                            50
                          </a>
                        </li>
                      </ul>
                    </div>
                    <p style={{ marginBottom: "0" }}>entries</p>
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
                        placeholder="Enter Path, Date"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn-search" type="submit">
                        <IoSearch style={{ fontSize: "2rem" }} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn-category"
                      onClick={handleAddTrendingCourseClick}
                    >
                      <FiPlus /> Add Banner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </LocalizationProvider>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: 70 }} align="center">
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 80 }} align="center">
                    S.No.
                  </StyledTableCell>
                  <StyledTableCell align="center">Banner Image</StyledTableCell>
                  <StyledTableCell align="center">
                    Banner Status{" "}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Home Banner Image
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Home Banner Status{" "}
                  </StyledTableCell>
                  <StyledTableCell align="center">Path (URL) </StyledTableCell>
                  <StyledTableCell align="center">
                    Created Date{" "}
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCourse.length > 0 ? (
                  displayedCourse.map((curr, index) => (
                    <StyledTableRow key={curr.banner_id}>
                      <StyledTableCell align="center">
                        <Checkbox />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>{" "}
                      {/* S.No. */}
                      <StyledTableCell align="center">
                        {curr.banner_image ? (
                          <img
                            src={`https://api.hachion.co/${curr.banner_image}`}
                            alt={`Banner ${index + 1}`}
                            style={{ width: "100px", height: "auto" }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </StyledTableCell>
                     <StyledTableCell align="center">
                    {curr.banner_image
                      ? (curr.status ? capitalize(curr.status) : "Enabled")
                      : ""}
                  </StyledTableCell>
                      <StyledTableCell align="center">
                        {curr.home_banner_image ? (
                          <img
                            src={`https://api.hachion.co/${curr.home_banner_image}`}
                            alt={`Banner ${index + 1}`}
                            style={{ width: "100px", height: "auto" }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                      {curr.home_banner_image
                        ? (curr.home_status ? capitalize(curr.home_status) : "Enabled")
                        : ""}
                    </StyledTableCell>
                      <StyledTableCell align="center">
                        {curr.path}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {curr.date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <FaEdit
                            className="edit"
                            onClick={() => handleClickOpen(curr)}
                          />
                          <RiDeleteBin6Line
                            className="delete"
                            onClick={() =>
                              handleDeleteConfirmation(curr.banner_id)
                            }
                          />
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={6} align="center">
                      No data available.
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
              totalRows={filteredBanner.length} // Use the full list for pagination
              onPageChange={handlePageChange}
            />
          </div>
          {message && <div className="success-message">{message}</div>}
        </div>
      )}

      <Dialog
        className="dialog-box"
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-schedule-dialog"
        PaperProps={{
          style: { borderRadius: 20 },
        }}
      >
        <div>
          <DialogTitle className="dialog-title" id="edit-schedule-dialog">
            Edit Banner
            <Button onClick={handleClose} className="close-btn">
              <IoMdCloseCircleOutline
                style={{ color: "white", fontSize: "2rem" }}
              />
            </Button>
          </DialogTitle>
        </div>
        <DialogContent>
  <div className="col">
    <label className="form-label">Banner Image</label>
    <input
      type="file"
      className="form-control"
      name="banner_image"
      onChange={(e) => handleEditFileChange(e, "banner_image")}
    />
    {/* Show selected or existing banner image name */}
    {editedData.banner_image && (
      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        {editedData.banner_image instanceof File
          ? `Selected: ${editedData.banner_image.name}`
          : `Existing: ${editedData.banner_image.split('/').pop()}`}
      </p>
    )}
    <label>Status (Banner):</label>
    <FormControlLabel
      control={
        <Switch
          checked={editedData?.status === "Enabled"}
          onChange={(e) =>
            setEditedData((prev) => ({
              ...prev,
              status: e.target.checked ? "Enabled" : "Disabled",
            }))
          }
          disabled={!editedData.banner_image}
        />
      }
    />
    <span>{editedData?.banner_image ? editedData?.status : ""}</span>
  </div>

  <div className="col">
    <label className="form-label">Home Banner Image</label>
    <input
      type="file"
      className="form-control"
      name="home_banner_image"
      onChange={(e) => handleEditFileChange(e, "home_banner_image")}
    />
    {/* Show selected or existing home banner image name */}
    {editedData.home_banner_image && (
      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        {editedData.home_banner_image instanceof File
          ? `Selected: ${editedData.home_banner_image.name}`
          : `Existing: ${editedData.home_banner_image.split('/').pop()}`}
      </p>
    )}
    <label>Status (Home):</label>
    <FormControlLabel
      control={
        <Switch
          checked={editedData?.home_status === "Enabled"}
          onChange={(e) =>
            setEditedData((prev) => ({
              ...prev,
              home_status: e.target.checked ? "Enabled" : "Disabled",
            }))
          }
          disabled={!editedData.home_banner_image}
        />
      }
    />
    <span>{editedData?.home_banner_image ? editedData?.home_status : ""}</span>
  </div>

  <div className="col">
    <label className="form-label">Path (URL)</label>
    <input
      type="text"
      className="form-control"
      name="path"
      value={editedData?.path || ""}
      onChange={handleInputChange}
    />
  </div>
</DialogContent>
        <DialogActions
          className="update"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button onClick={handleSave} className="update-btn">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}