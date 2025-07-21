import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function CrudApp() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    job_title: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const API_URL = "http://localhost:4000/api/managed-users";

  const fetchUsers = async (query = "") => {
    try {
      const res = await axios.get(`${API_URL}?search=${query}`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update by email (which exists in formData)
        await axios.patch(`${API_URL}/${editingId}`, formData, { withCredentials: true });
        showSnackbar("User updated successfully", "success");
      } else {
        await axios.post(API_URL, formData, { withCredentials: true });
        showSnackbar("User added successfully", "success");
      }

      resetForm();
      fetchUsers(searchTerm);
      setDialogOpen(false);
    } catch (err) {
      showSnackbar("Failed to save user", "error");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      job_title: user.job_title,
    });
    setEditingId(user._id); 
    setDialogOpen(true);
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${confirmDeleteId}`, {
        withCredentials: true,
      });
      fetchUsers(searchTerm);
      showSnackbar("User deleted successfully", "info");
    } catch (err) {
      showSnackbar("Failed to delete user", "error");
    } finally {
      setConfirmDialogOpen(false);
      setConfirmDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      job_title: "",
    });
    setEditingId(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchUsers(value);
  };

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
  };

  const columns = [
    { field: "first_name", headerName: "First Name", width: 130 },
    { field: "last_name", headerName: "Last Name", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "job_title", headerName: "Job Title", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <EditIcon
            onClick={() => handleEdit(params.row)}
            style={{ cursor: "pointer", color: "#1976d2", marginRight: "1rem" }}
            titleAccess="Edit"
          />
          <DeleteIcon
            onClick={() => confirmDelete(params.row._id)}
            style={{ cursor: "pointer", color: "#d32f2f" }}
            titleAccess="Delete"
          />
        </>
      ),
    },
  ];

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
    <Box sx={{ maxWidth: "1000px", margin: "auto", padding: "2rem" , maxHeight: "2000px"}}>
      <h2 className="text-2xl flex justify-center items-center font-semibold mb-6">Employee Managerment System</h2>

      <TextField
        label="Search by Name, Email or Job Title"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        style={{ marginBottom: "1.5rem" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          resetForm();
          setDialogOpen(true);
        }}
        style={{ marginBottom: "1.5rem" }}
      >
        Add User
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={users}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </div>
    

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editingId ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              name="first_name"
              label="First Name"
              fullWidth
              value={formData.first_name}
              onChange={handleChange}
              required
              margin="dense"
            />
            <TextField
              name="last_name"
              label="Last Name"
              fullWidth
              value={formData.last_name}
              onChange={handleChange}
              required
              margin="dense"
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              margin="dense"
            />
            <TextField
              name="gender"
              label="Gender"
              fullWidth
              value={formData.gender}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              name="job_title"
              label="Job Title"
              fullWidth
              value={formData.job_title}
              onChange={handleChange}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  </div>
  );
}

export default CrudApp;
