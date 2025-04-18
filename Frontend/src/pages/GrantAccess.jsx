import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Autocomplete, TextField, Chip, Box, MenuItem, Select,
  InputLabel, FormControl, CircularProgress, Slide, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import FormIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const GrantAccess = () => {
  const [open, setOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formList, setFormList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFormsAndUsers = async () => {
    try {
      const [formsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8000/api/forms"),
        axios.get("http://localhost:8000/auth/users")
      ]);
      setFormList(formsRes.data);
      setUserList(usersRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const fetchAccessList = async (formId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/forms/access-list/${formId}`);
      setAccessList(res.data);
    } catch (error) {
      console.error("Error fetching access list:", error);
      setAccessList([]);
    }
  };

  useEffect(() => {
    if (open) fetchFormsAndUsers();
  }, [open]);

  useEffect(() => {
    if (selectedFormId) {
      fetchAccessList(selectedFormId);
    }
  }, [selectedFormId]);

  const handleGrantAccess = async () => {
    if (!selectedFormId || selectedUsers.length === 0) return;
    try {
      setIsLoading(true);
      await axios.post("http://localhost:8000/api/forms/give-access", {
        formId: selectedFormId,
        userIds: selectedUsers.map(user => user._id)
      });
      alert("Access granted successfully!");
      fetchAccessList(selectedFormId); // Refresh access list
      setSelectedUsers([]); // Reset selected users
    } catch (error) {
      console.error("Error granting access:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccess = async (userId) => {
    if (!selectedFormId || !userId) return;
    try {
      setIsLoading(true);
      await axios.post("http://localhost:8000/api/forms/remove-access", {
        formId: selectedFormId,
        userId: userId
      });
      alert("Access removed successfully!");
      fetchAccessList(selectedFormId); // Refresh access list after removing access
    } catch (error) {
      console.error("Error removing access:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFormId('');
    setSelectedUsers([]);
    setAccessList([]);
  };

  const glow = keyframes`
    0% { box-shadow: 0 0 5px rgba(255,255,255,0.2); }
    50% { box-shadow: 0 0 20px rgba(0,200,255,0.7); }
    100% { box-shadow: 0 0 5px rgba(255,255,255,0.2); }
  `;

  return (
    <Box>
     <Box
  sx={{
    mb: 4,
    p: 3,
    borderRadius: 4,
    background: 'linear-gradient(145deg, #e0f7fa, #ffffff)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderLeft: '6px solid #00bcd4',
  }}
>
  <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
    🔐 Form Access Control Panel
  </Typography>

  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
    Assign and manage access rights for your team members across different forms.
  </Typography>

  <Typography variant="body1" color="text.primary">
    Use this section to grant or revoke access to specific forms. You can easily select a form from the list, choose multiple users, and control who gets to interact with each form. Access changes reflect immediately and help maintain secure collaboration.
  </Typography>
</Box>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<PersonAddAltIcon />}
        sx={{
          background: 'linear-gradient(to right, #06beb6, #48b1bf)',
          color: '#fff',
          animation: `${glow} 2.5s infinite`,
          borderRadius: 3,
          fontWeight: 'bold',
          px: 3,
          py: 1.2,
          '&:hover': {
            background: 'linear-gradient(to right, #43cea2, #185a9d)',
          }
        }}
      >
        Grant Access
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        transitionDuration={400}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            background: '#f4fafd',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
          🔐 Grant or Remove Form Access
        </DialogTitle>

        <DialogContent dividers>
          {/* Form Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Form</InputLabel>
            <Select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              label="Select Form"
              startAdornment={<FormIcon sx={{ mr: 1 }} />}
            >
              {formList.map((form) => (
                <MenuItem key={form._id} value={form._id}>
                  {form.schemaName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* User Selector */}
          <Autocomplete
            multiple
            options={userList}
            getOptionLabel={(user) => `${user.name} (${user.email})`}
            value={selectedUsers}
            onChange={(event, newValue) => setSelectedUsers(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option._id}
                  label={option.name}
                  color="primary"
                  variant="outlined"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Users"
                placeholder="Choose users"
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <GroupIcon sx={{ mr: 1, color: '#1976d2' }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {/* Access List Table */}
          {accessList.length > 0 && (
            <>
              <Typography variant="h6" mt={4} mb={1} sx={{ fontWeight: 'bold' }}>
                📋 Current Access List
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accessList.map(user => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveAccess(user._id)}
                            startIcon={<DeleteIcon />}
                            size="small"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="text">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleGrantAccess}
            disabled={!selectedFormId || selectedUsers.length === 0 || isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            sx={{
              backgroundColor: "#1976d2",
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: "#115293",
              }
            }}
          >
            {isLoading ? "Granting..." : "Grant Access"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GrantAccess;
