import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';

const EditPopup = ({ open, onClose, formId, editData, setEditData, onSave }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (formId && open) {
      axios
        .get(`http://localhost:8000/api/forms/get-schema/${formId}`)
        .then((res) => {
          setFields(res.data.fields || []);
        })
        .catch((err) => {
          console.error('Error fetching form schema:', err);
        });
    }
  }, [formId, open]);

  const handleChange = (label, value) => {
    setEditData((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleCheckboxChange = (label, option) => {
    const currentValues = Array.isArray(editData[label]) ? editData[label] : [];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter((val) => val !== option)
      : [...currentValues, option];
    setEditData((prev) => ({
      ...prev,
      [label]: updatedValues,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Form Data</DialogTitle>
      <DialogContent dividers>
        {fields.map((field, index) => {
          const { label, type, options = [] } = field;
          const value =
            editData?.[label] ?? (type === 'checkbox' ? [] : '');

          switch (type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
              return (
                <TextField
                  key={index}
                  fullWidth
                  margin="dense"
                  type={type}
                  label={label}
                  value={value}
                  onChange={(e) => handleChange(label, e.target.value)}
                />
              );

            case 'textarea':
              return (
                <TextField
                  key={index}
                  fullWidth
                  margin="dense"
                  multiline
                  rows={3}
                  label={label}
                  value={value}
                  onChange={(e) => handleChange(label, e.target.value)}
                />
              );

            case 'radio':
              return (
                <FormControl component="fieldset" key={index} margin="dense">
                  <FormLabel component="legend">{label}</FormLabel>
                  <RadioGroup
                    row
                    value={value}
                    onChange={(e) => handleChange(label, e.target.value)}
                  >
                    {options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              );

            case 'checkbox':
              return (
                <FormControl component="fieldset" key={index} margin="dense">
                  <FormLabel component="legend">{label}</FormLabel>
                  <FormGroup row>
                    {options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={
                          <Checkbox
                            checked={
                              Array.isArray(value) && value.includes(option)
                            }
                            onChange={() =>
                              handleCheckboxChange(label, option)
                            }
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              );

            case 'select':
              return (
                <FormControl fullWidth margin="dense" key={index}>
                  <FormLabel>{label}</FormLabel>
                  <Select
                    value={value}
                    onChange={(e) => handleChange(label, e.target.value)}
                  >
                    {options.map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );

            default:
              return null;
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(editData)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPopup;
