import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TextField, Snackbar, Alert, Skeleton, Box 
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ShowData() {
  const { formId, formname } = useParams();
  const navigate=useNavigate()
  const {id}=useParams()
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/forms/get-responses/${formId}`,{
        headers:{
          "Content-Type":"application/json",
          "auth-token":localStorage.getItem('token')
        }
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

  const handleEdit = (id) => {
    const selectedEntry = data.find((entry) => entry._id === id);
    setEditingId(id);
    setEditedData({ ...selectedEntry.responses });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    axios
      .put(`http://localhost:8000/api/forms/edit/${editingId}`, { responses: editedData })
      .then(() => {
        setData((prevData) =>
          prevData.map((entry) =>
            entry._id === editingId ? { ...entry, responses: editedData } : entry
          )
        );
        setEditingId(null);
        setSnackbarMessage("Response updated successfully!");
        setSnackbarOpen(true);
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
        .delete(`http://localhost:8000/api/forms/delete/${id}`)
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

    autoTable(doc,{
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`${formname}-responses.pdf`);
  };
  const deleteSchema=(id)=>{
    if (window.confirm("Are you sure you want to delete this Form?")) {
      axios
        .delete(`http://localhost:8000/api/forms/deleteSchema/${id}`)
        .then(() => {
          navigate('/form')
          setSnackbarMessage("Schema deleted successfully!");
          setSnackbarOpen(true);
        })
        .catch((err) => {
          setSnackbarMessage("Error deleting response.");
          setSnackbarOpen(true);
          console.error("Error deleting response:", err);
        });
    }
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h3 className="mb-3" style={{ fontWeight: 600, color: "#333" }}>
          {formname} Form Responses
        </h3>
        <br /><br />
        <Button variant="contained" color="secondary" onClick={generatePDF} className="my-4">
          Download PDF
        </Button>
      </Box>

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
              {data.map((entry, rowIndex) => (
                <TableRow
                  key={entry._id || rowIndex}
                  sx={{
                    "&:hover": { backgroundColor: "#f0f8ff" },
                    transition: "all 0.2s",
                  }}
                >
                  <TableCell align="center">{rowIndex + 1}</TableCell>

                  {schema.map((key, colIndex) => (
                    <TableCell key={`${entry._id}-${colIndex}`} align="center">
                      {editingId === entry._id ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={editedData[key] || ""}
                          onChange={(e) =>
                            setEditedData((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          fullWidth
                        />
                      ) : (
                        entry.responses?.[key] !== undefined ? entry.responses[key] : "NA"
                      )}
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    {editingId === entry._id ? (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={handleSaveEdit}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained" color="secondary"
                          size="small"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained" color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleEdit(entry._id)}
                        >
                          Edit
                        </Button>
                        <Button
                       variant="contained" color="error"
                          size="small"
                          onClick={() => handleDelete(entry._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
  <Button variant="contained" color="error" className="my-4" onClick={()=> deleteSchema(formId)}>
          Delete Form
        </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
