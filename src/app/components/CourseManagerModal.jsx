"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton
} from "@mui/material";

import { Delete } from "@mui/icons-material";

export default function CourseManagerModal({ open, onClose, user }) {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  // Load when modal opens
  useEffect(() => {
    if (open) {
      fetchAllCourses();
      fetchEnrolledCourses();
    }
  }, [open]);

  // -------------------------------------------------
  // 1️⃣ Fetch ALL courses (admin)
  // -------------------------------------------------
  const fetchAllCourses = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/courses/all");
      setAllCourses(res.data.courses || []);
    } catch (err) {
      console.error("Fetch all courses error:", err);
    }
  };

  // -------------------------------------------------
  // 2️⃣ Fetch USER enrolled courses
  // -------------------------------------------------
  const fetchEnrolledCourses = async () => {
    try {
      const res = await axiosInstance.post("/api/course/my-courses", {
        type: "email",
        value: user.email
      });

      const enriched =
        res.data?.courses?.map((c) => ({
          courseId: c.courseId,
          name: c.name
        })) || [];

      setEnrolled(enriched);

    } catch (err) {
      console.error("Fetch enrolled error:", err);
      setEnrolled([]);
    }
  };

  // -------------------------------------------------
  // 3️⃣ Assign Course
  // -------------------------------------------------
  const assignCourse = async (courseId, name) => {
    try {
      await axiosInstance.post("/api/course/assign-trial", {
        userId: user._id,
        courseId
      });

      setEnrolled((prev) => [...prev, { courseId, name }]);

    } catch (err) {
      alert("Failed to assign course");
    }
  };

  // -------------------------------------------------
  // 4️⃣ Deassign (Remove) Course — REAL API
  // -------------------------------------------------
  const removeCourse = async (courseId) => {
    try {
      await axiosInstance.post("/api/course/deassign-course", {
        userId: user._id,
        courseId
      });

      setEnrolled((prev) => prev.filter((c) => c.courseId !== courseId));

    } catch (err) {
      console.error("Deassign Error:", err);
      alert("Failed to remove course");
    }
  };

  // -------------------------------------------------
  // 5️⃣ Unassigned courses = all - enrolled
  // -------------------------------------------------
  const unassignedCourses = allCourses.filter(
    (c) => !enrolled.some((e) => e.courseId === c.courseId)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

      <DialogTitle>Manage Courses</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          gap: 3,
          maxHeight: "480px",
          overflowY: "auto",
          p: 2
        }}
      >

        {/* LEFT — ENROLLED */}
        <div style={{ flex: 1, borderRight: "1px solid #ddd", paddingRight: 10 }}>
          <Typography variant="h6">Enrolled Courses</Typography>

          <List>
            {enrolled.length > 0 ? (
              enrolled.map((c, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <IconButton onClick={() => removeCourse(c.courseId)}>
                      <Delete sx={{ color: "red" }} />
                    </IconButton>
                  }
                >
                  <ListItemText primary={c.name} secondary={c.courseId} />
                </ListItem>
              ))
            ) : (
              <Typography>No courses enrolled</Typography>
            )}
          </List>
        </div>

        {/* RIGHT — ASSIGN */}
        <div style={{ flex: 1, paddingLeft: 10 }}>
          <Typography variant="h6">Assign New Course</Typography>

          <List>
            {unassignedCourses.length > 0 ? (
              unassignedCourses.map((c) => (
                <ListItem
                  key={c.courseId}
                  secondaryAction={
                    <Button
                      variant="contained"
                      onClick={() => assignCourse(c.courseId, c.name)}
                    >
                      Assign
                    </Button>
                  }
                >
                  <ListItemText primary={c.name} />
                </ListItem>
              ))
            ) : (
              <Typography>All courses already assigned</Typography>
            )}
          </List>
        </div>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
