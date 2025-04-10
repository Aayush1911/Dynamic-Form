import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFormSchemas = createAsyncThunk("forms/fetch", async () => {
  const response = await axios.get("http://localhost:8000/api/forms/name");
  return response.data;
});

export const saveFormSchema = createAsyncThunk("forms/save", async (schema, { dispatch }) => {
  await axios.post("http://localhost:8000/api/forms/save-schema", schema, {
    headers: { "Content-Type": "application/json" },
  });
  dispatch(addFormSchema(schema.schemaName)); // Update state after saving
});

const formSlice = createSlice({
  name: "forms",
  initialState: { schemas: [], status: "idle", error: null },
  reducers: {
    addFormSchema: (state, action) => {
      state.schemas.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormSchemas.fulfilled, (state, action) => {
        state.schemas = action.payload;
      })
      .addCase(fetchFormSchemas.rejected, (state, action) => {
        state.error = "Error fetching form schemas";
      });
  },
});

export const { addFormSchema } = formSlice.actions;
export default formSlice.reducer;
