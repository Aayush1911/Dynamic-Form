import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Snackbar, Alert, Skeleton, Box, Pagination
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditPopup from "./EditPopup";
import { jwtDecode } from "jwt-decode";
import { FormContext } from "../context/FormContext";
import { AdminContext } from "../context/AdminContext";

export default function ShowData() {
  const { formId, formname } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { fetchAdminForms } = useContext(AdminContext);

  // Pagination states
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  let role = "null";
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  role = decoded.role;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/forms/get-responses/${formId}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      })
      .then((response) => {
        if (response.data.length > 0) {
          const firstEntry = response.data[0].responses;
          setSchema(Object.keys(firstEntry));
          const cleanedData = response.data.map((entry) => ({
            ...entry,
            responses: entry.responses.responses || entry.responses,
          }));
          setData(cleanedData);
        }
      })
      .catch((err) => console.error("Error fetching form data:", err))
      .finally(() => setLoading(false));
  }, [formId]);

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditData({ ...entry.responses });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    axios
      .put(`http://localhost:8000/api/forms/edit/${editingId}`, { responses: editData })
      .then(() => {
        setData((prevData) =>
          prevData.map((entry) =>
            entry._id === editingId ? { ...entry, responses: editData } : entry
          )
        );
        setEditingId(null);
        setSnackbarMessage("Response updated successfully!");
        setSnackbarOpen(true);
        setEditDialogOpen(false);
      })
      .catch((err) => {
        setSnackbarMessage("Error updating response.");
        setSnackbarOpen(true);
        console.error("Error updating response:", err);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this response?")) {
      axios
        .delete(`http://localhost:8000/api/forms/delete/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        .then(() => {
          setData((prevData) => prevData.filter((entry) => entry._id !== id));
          setSnackbarMessage("Response deleted successfully!");
          setSnackbarOpen(true);
        })
        .catch((err) => {
          setSnackbarMessage("Error deleting response.");
          setSnackbarOpen(true);
          console.error("Error deleting response:", err);
        });
    }
  };

  const deleteSchema = (id) => {
    if (window.confirm("Are you sure you want to delete this Form?")) {
      axios
        .delete(`http://localhost:8000/api/forms/deleteSchema/${id}`)
        .then(() => {
          navigate("/");
          setSnackbarMessage("Schema deleted successfully!");
          setSnackbarOpen(true);
          fetchAdminForms();
        })
        .catch((err) => {
          setSnackbarMessage("Error deleting response.");
          setSnackbarOpen(true);
          console.error("Error deleting response:", err);
        });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`${formname} Form Responses`, 14, 15);
    const tableColumn = ["Sr No", ...schema];
    const tableRows = data.map((entry, index) => [
      index + 1,
      ...schema.map((key) => entry.responses?.[key] || "NA"),
    ]);
    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });
    doc.save(`${formname}-responses.pdf`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h3 className="mb-3" style={{ fontWeight: 600, color: "#333" }}>
          <span style={{ textTransform: "capitalize" }}>{formname} Form Responses</span>
        </h3>
         
        <Button variant="contained" color="secondary" onClick={generatePDF} style={{marginBottom:"20px"}}>
          Download PDF
        </Button>
      </Box>
      {/* <Link
                    to={`/form/${formId}`}
                    style={{ textDecoration: "none"}}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{width:"8vw",height:"6vh",marginBottom:"20px"}}
                      sx={{
                        mb: 1,
                        mt:2,
                        fontWeight: 500,
                        letterSpacing: 0.5,
                        "&:hover": {
                          background: "linear-gradient(to right, #005be6, #00b2e3)",
                        },
                      }}
                    >
                      Add data
                    </Button>
      </Link> */}
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <TableContainer sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell align="center">Sr No</TableCell>
                {schema.map((sch) => (
                  <TableCell key={`schema-${sch}`} align="center">
                    {sch}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((entry, rowIndex) => (
                <TableRow
                  key={entry._id || rowIndex}
                  sx={{
                    "&:hover": { backgroundColor: "#f0f8ff" },
                    transition: "all 0.2s",
                  }}
                >
                  <TableCell align="center">
                    {(page - 1) * rowsPerPage + rowIndex + 1}
                  </TableCell>
                  {schema.map((key, colIndex) => (
                    <TableCell key={`${entry._id}-${colIndex}`} align="center">
                      {entry.responses?.[key] !== undefined ? entry.responses[key] : "NA"}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(entry._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {role === "admin" && (
        <Button
          variant="contained"
          color="error"
          className="my-4"
          onClick={() => deleteSchema(formId)}
          sx={{ mt: 2 }}
        >
          Delete Form
        </Button>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <EditPopup
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        formId={formId}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSaveEdit}
      />
    </Container>
  );
}
