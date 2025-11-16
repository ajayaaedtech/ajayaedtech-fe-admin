"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import {
  Add,
  ExpandMore,
  Delete,
  Edit,
  Layers,
  Movie,
  MenuBook,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  createCourse,
  addUnit,
  addChapter,
  deleteCourse,
  deleteUnit,
  deleteChapter,
} from "../../redux/slices/courseSlice";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { list: courses = [], loading } = useSelector((s) => s.courses || {});

  // Dialog / selection state
  const [openCreateCourse, setOpenCreateCourse] = useState(false);
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [openAddUnit, setOpenAddUnit] = useState(false);
  const [openAddChapter, setOpenAddChapter] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    type: null, // 'course' | 'unit' | 'chapter'
    payload: null,
  });

  // forms
  const [courseForm, setCourseForm] = useState({
    courseId: "",
    name: "",
    slug: "",
    duration: "",
    overview: "",
    price: "",
    language: "English",
    tags: "",
  });

  const [unitForm, setUnitForm] = useState({
    unitId: "",
    title: "",
    order: 1,
  });

  const [chapterForm, setChapterForm] = useState({
    chapterId: "",
    title: "",
    videoUrl: "",
    order: 1,
    duration: "",
    isFree: false,
  });

  // selection context (course/unit chosen for add/edit)
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  /* ---------------------- Course CRUD ---------------------- */

  const openNewCourseModal = () => {
    setCourseForm({
      courseId: uuidv4(),
      name: "",
      slug: "",
      duration: "",
      overview: "",
      price: "",
      language: "English",
      tags: "",
    });
    setOpenCreateCourse(true);
  };

  const handleCreateCourse = async () => {
    try {
      const payload = {
        ...courseForm,
        price: Number(courseForm.price) || 0,
        tags:
          typeof courseForm.tags === "string"
            ? courseForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : courseForm.tags || [],
      };
      await dispatch(createCourse(payload)).unwrap();
      setOpenCreateCourse(false);
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.message || "Failed to create course");
    }
  };

  const openEditCourseModal = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      courseId: course.courseId,
      name: course.name || "",
      slug: course.slug || "",
      duration: course.duration || "",
      overview: course.overview || "",
      price: course.price ?? "",
      language: course.language || "English",
      tags: (course.tags || []).join(", "),
    });
    setOpenEditCourse(true);
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    try {
      const updatePayload = {
        name: courseForm.name,
        slug: courseForm.slug,
        duration: courseForm.duration,
        overview: courseForm.overview,
        price: Number(courseForm.price) || 0,
        language: courseForm.language,
        tags:
          typeof courseForm.tags === "string"
            ? courseForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : courseForm.tags || [],
      };

      // Try to call backend update endpoint directly (safe fallback)
      await axiosInstance.put(`/api/admin/courses/course/update/${selectedCourse.courseId}`, updatePayload);

      toast.success("Course updated");
      setOpenEditCourse(false);
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update");
    }
  };

  const confirmDeleteCourse = (course) => {
    setConfirmDelete({ open: true, type: "course", payload: course });
  };

  const handleDeleteCourse = async () => {
    const course = confirmDelete.payload;
    if (!course) return;
    try {
      await dispatch(deleteCourse(course.courseId)).unwrap();
      toast.success("Course deleted");
      setConfirmDelete({ open: false, type: null, payload: null });
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.message || "Failed to delete course");
    }
  };

  /* ---------------------- Unit CRUD ---------------------- */

  const openAddUnitModal = (course) => {
    setSelectedCourse(course);
    setUnitForm({
      unitId: uuidv4(),
      title: "",
      order: (course.units?.length || 0) + 1,
    });
    setOpenAddUnit(true);
  };

  const handleAddUnit = async () => {
    if (!selectedCourse) return toast.error("Course not selected");
    try {
      const payload = {
        unitId: unitForm.unitId,
        title: unitForm.title,
        order: Number(unitForm.order) || 1,
        chapters: [],
      };

      await dispatch(addUnit({ courseId: selectedCourse.courseId, unit: payload })).unwrap();
      toast.success("Unit added");
      setOpenAddUnit(false);
      setSelectedCourse(null);
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.message || "Failed to add unit");
    }
  };

  const confirmDeleteUnit = (course, unit) => {
    setConfirmDelete({ open: true, type: "unit", payload: { course, unit } });
  };

  const handleDeleteUnit = async () => {
    const { course, unit } = confirmDelete.payload || {};
    if (!course || !unit) return;
    try {
      await dispatch(deleteUnit({ courseId: course.courseId, unitId: unit.unitId })).unwrap();
      toast.success("Unit deleted");
      setConfirmDelete({ open: false, type: null, payload: null });
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.message || "Failed to delete unit");
    }
  };

  /* ---------------------- Chapter CRUD ---------------------- */

  const openAddChapterModal = (course, unit) => {
    setSelectedCourse(course);
    setSelectedUnit(unit);
    setChapterForm({
      chapterId: uuidv4(),
      title: "",
      videoUrl: "",
      order: (unit.chapters?.length || 0) + 1,
      duration: "",
      isFree: false,
    });
    setOpenAddChapter(true);
  };

  const handleAddChapter = async () => {
    if (!selectedCourse || !selectedUnit) return toast.error("Context missing");
    try {
      const payload = {
        chapterId: chapterForm.chapterId,
        title: chapterForm.title,
        videoUrl: chapterForm.videoUrl,
        order: Number(chapterForm.order) || 1,
        duration: chapterForm.duration,
        isFree: !!chapterForm.isFree,
      };

      await dispatch(
        addChapter({
          courseId: selectedCourse.courseId,
          unitId: selectedUnit.unitId,
          chapter: payload,
        })
      ).unwrap();

      toast.success("Chapter added");
      setOpenAddChapter(false);
      setSelectedCourse(null);
      setSelectedUnit(null);
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.message || "Failed to add chapter");
    }
  };

  const confirmDeleteChapter = (course, unit, chapter) => {
    setConfirmDelete({ open: true, type: "chapter", payload: { course, unit, chapter } });
  };

  const handleDeleteChapter = async () => {
    const { course, unit, chapter } = confirmDelete.payload || {};
    if (!course || !unit || !chapter) return;
    try {
      await dispatch(
        deleteChapter({
          courseId: course.courseId,
          unitId: unit.unitId,
          chapterId: chapter.chapterId,
        })
      ).unwrap();
      toast.success("Chapter deleted");
      setConfirmDelete({ open: false, type: null, payload: null });
      dispatch(fetchCourses());
    } catch (err) {
      toast.error(err?.message || "Failed to delete chapter");
    }
  };

  /* ---------------------- small helpers ---------------------- */
  const autoSlug = (name) => name?.toLowerCase().trim().replace(/\s+/g, "-");

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={openNewCourseModal}>
          Add New Course
        </Button>
      </Box>

      <Box>
        {courses.length === 0 && !loading ? (
          <Typography>No courses yet.</Typography>
        ) : (
          courses.map((course) => (
            <Accordion key={course.courseId} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MenuBook />
                  <Typography sx={{ fontWeight: 600 }}>{course.name}</Typography>
                </Box>

                <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                  <IconButton size="small" onClick={() => openEditCourseModal(course)}>
                    <Edit />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => confirmDeleteCourse(course)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Overview: {course.overview || "—"}
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Typography sx={{ fontWeight: 600, mb: 1 }}>Units</Typography>

                {course.units?.length === 0 && (
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    No units. Add one.
                  </Typography>
                )}

                {course.units?.map((unit) => (
                  <Accordion key={unit.unitId} sx={{ ml: 3, mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Layers />
                        <Typography>{unit.title}</Typography>
                      </Box>

                      <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent accordion toggle
                            openAddChapterModal(course, unit);
                          }}
                        >
                          Add Chapter
                        </Button>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteUnit(course, unit);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {unit.chapters?.length === 0 ? (
                        <Typography color="text.secondary">No chapters.</Typography>
                      ) : (
                        unit.chapters.map((ch) => (
                          <Box
                            key={ch.chapterId}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              ml: 4,
                              py: 0.5,
                            }}
                          >
                            <Movie />
                            <Typography sx={{ flex: 1 }}>{ch.title}</Typography>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => confirmDeleteChapter(course, unit, ch)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        ))
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}

                <Box sx={{ mt: 1 }}>
                  <Button
                    startIcon={<Add />}
                    size="small"
                    variant="outlined"
                    onClick={() => openAddUnitModal(course)}
                  >
                    Add Unit
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* ---------------- Dialogs ---------------- */}

      {/* Create Course */}
      <Dialog open={openCreateCourse} onClose={() => setOpenCreateCourse(false)} fullWidth>
        <DialogTitle>Create Course</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 1, mt: 1 }}>
            <TextField label="Course ID" value={courseForm.courseId} fullWidth disabled />
            <TextField
              label="Name"
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm((p) => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))
              }
              fullWidth
            />
            <TextField label="Slug" value={courseForm.slug} fullWidth disabled />
            <TextField
              label="Duration"
              value={courseForm.duration}
              onChange={(e) => setCourseForm((p) => ({ ...p, duration: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Overview"
              value={courseForm.overview}
              onChange={(e) => setCourseForm((p) => ({ ...p, overview: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Price"
              type="number"
              value={courseForm.price}
              onChange={(e) => setCourseForm((p) => ({ ...p, price: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Tags (comma separated)"
              value={courseForm.tags}
              onChange={(e) => setCourseForm((p) => ({ ...p, tags: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateCourse(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCourse}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course */}
      <Dialog open={openEditCourse} onClose={() => setOpenEditCourse(false)} fullWidth>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 1, mt: 1 }}>
            <TextField label="Course ID" value={courseForm.courseId} fullWidth disabled />
            <TextField
              label="Name"
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm((p) => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))
              }
              fullWidth
            />
            <TextField label="Slug" value={courseForm.slug} fullWidth disabled />
            <TextField
              label="Duration"
              value={courseForm.duration}
              onChange={(e) => setCourseForm((p) => ({ ...p, duration: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Overview"
              value={courseForm.overview}
              onChange={(e) => setCourseForm((p) => ({ ...p, overview: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Price"
              type="number"
              value={courseForm.price}
              onChange={(e) => setCourseForm((p) => ({ ...p, price: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Tags (comma separated)"
              value={courseForm.tags}
              onChange={(e) => setCourseForm((p) => ({ ...p, tags: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditCourse(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCourse}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Unit */}
      <Dialog open={openAddUnit} onClose={() => setOpenAddUnit(false)} fullWidth>
        <DialogTitle>Add Unit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 1, mt: 1 }}>
            <TextField label="Unit ID" value={unitForm.unitId} fullWidth disabled />
            <TextField
              label="Title"
              value={unitForm.title}
              onChange={(e) => setUnitForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Order"
              type="number"
              value={unitForm.order}
              onChange={(e) => setUnitForm((p) => ({ ...p, order: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUnit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUnit}>
            Add Unit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Chapter */}
      <Dialog open={openAddChapter} onClose={() => setOpenAddChapter(false)} fullWidth>
        <DialogTitle>Add Chapter</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 1, mt: 1 }}>
            <TextField label="Chapter ID" value={chapterForm.chapterId} fullWidth disabled />
            <TextField
              label="Title"
              value={chapterForm.title}
              onChange={(e) => setChapterForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Video URL"
              value={chapterForm.videoUrl}
              onChange={(e) => setChapterForm((p) => ({ ...p, videoUrl: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Order"
              type="number"
              value={chapterForm.order}
              onChange={(e) => setChapterForm((p) => ({ ...p, order: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Duration"
              value={chapterForm.duration}
              onChange={(e) => setChapterForm((p) => ({ ...p, duration: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddChapter(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddChapter}>
            Add Chapter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generic Confirm Delete Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, type: null, payload: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDelete.type === "course" && `Delete course "${confirmDelete.payload?.name}"?`}
            {confirmDelete.type === "unit" && `Delete unit "${confirmDelete.payload?.unit?.title}"?`}
            {confirmDelete.type === "chapter" && `Delete chapter "${confirmDelete.payload?.chapter?.title}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, type: null, payload: null })}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              if (confirmDelete.type === "course") handleDeleteCourse();
              else if (confirmDelete.type === "unit") handleDeleteUnit();
              else if (confirmDelete.type === "chapter") handleDeleteChapter();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
