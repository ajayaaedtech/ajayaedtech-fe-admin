"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";

import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Pagination,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, page, totalPages, loading } = useSelector(
    (state) => state.users
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  // Load first page
  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Pagination
  const handlePageChange = (_, value) => {
    dispatch(fetchUsers({ page: value, limit: 10 }));
  };

  // OPEN MODAL
  const openEditModal = (user) => {
    setSelectedUser(user);
    console.log("openboxuser", user)
    setOpenModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setSelectedUser({});
    setOpenModal(false);
  };

  // UPDATE SELECTED USER FIELD
  const handleChange = (field, value) => {
    setSelectedUser((prev) => ({ ...prev, [field]: value }));
  };

  // SAVE CHANGES → API CALL
  const saveModalChanges = async () => {
    console.log("savemodel before", selectedUser)
    try {
      await axiosInstance.patch(
        `/api/admin/user-edit-full/${selectedUser._id}`,
        selectedUser
      );

      toast.success("User updated successfully");

      closeModal();
      dispatch(fetchUsers({ page, limit: 10 }));
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // DELETE USER
  const deleteUserFunc = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/user/${id}`);
      toast.success("User deleted");

      dispatch(fetchUsers({ page, limit: 10 }));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Users</h1>

      <TableContainer component={Paper} className="shadow-xl">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Profile Pic</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading &&
              users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>

                  <TableCell>{u.email}</TableCell>

                  <TableCell>{u.phone}</TableCell>

                  <TableCell>{u.role}</TableCell>

                  <TableCell>{u.status}</TableCell>

                  <TableCell>
                    <img
                      src={u.profilePic}
                      className="h-10 w-10 rounded-full"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => openEditModal(u)}>
                      <Edit className="text-blue-600" />
                    </IconButton>

                    <IconButton onClick={() => deleteUserFunc(u._id)}>
                      <Delete className="text-red-600" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* EDIT MODAL */}
      <Dialog open={openModal} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={selectedUser.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={selectedUser.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Profile Pic URL"
            value={selectedUser.profilePic || ""}
            onChange={(e) => handleChange("profilePic", e.target.value)}
          />

          <Select
            fullWidth
            value={selectedUser.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
            margin="dense"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
            <MenuItem value="organization">Organization</MenuItem>
          </Select>

          <Select
            fullWidth
            value={selectedUser.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            margin="dense"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal} color="error">
            Cancel
          </Button>
          <Button onClick={saveModalChanges} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
