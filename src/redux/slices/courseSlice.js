import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

// GET COURSES
export const fetchCourses = createAsyncThunk("courses/fetch", async () => {
  const res = await axiosInstance.get("/api/admin/courses/all");
  return res.data.courses;
});

// CREATE COURSE
export const createCourse = createAsyncThunk("courses/create", async (data) => {
  const res = await axiosInstance.post("/api/admin/courses/course/create", data);
  toast.success("Course created successfully!");
  return res.data.course;
});

// ADD UNIT
export const addUnit = createAsyncThunk("courses/addUnit", async ({ courseId, unit }) => {
  const res = await axiosInstance.post(`/api/admin/courses/${courseId}/unit/add`, unit);
  toast.success("Unit added successfully!");
  return res.data.course;
});

// ADD CHAPTER
export const addChapter = createAsyncThunk(
  "courses/addChapter",
  async ({ courseId, unitId, chapter }) => {
    const res = await axiosInstance.post(
      `/api/admin/courses/${courseId}/unit/${unitId}/chapter/add`,
      chapter
    );
    toast.success("Chapter added successfully!");
    return res.data.course;
  }
);

// DELETE UNIT
export const deleteUnit = createAsyncThunk(
  "courses/deleteUnit",
  async ({ courseId, unitId }) => {
    await axiosInstance.delete(`/api/admin/courses/course/${courseId}/unit/${unitId}`);
    toast.success("Unit deleted successfully!");
    return { courseId, unitId };
  }
);

// DELETE CHAPTER
export const deleteChapter = createAsyncThunk(
  "courses/deleteChapter",
  async ({ courseId, unitId, chapterId }) => {
    await axiosInstance.delete(
      `/api/admin/courses/course/${courseId}/unit/${unitId}/chapter/${chapterId}`
    );
    toast.success("Chapter deleted!");
    return { courseId, unitId, chapterId };
  }
);

// DELETE COURSE
export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (courseId) => {
  await axiosInstance.delete(`/api/admin/courses/course/delete/${courseId}`);
  toast.success("Course deleted!");
  return courseId;
});

const courseSlice = createSlice({
  name: "courses",
  initialState: { list: [], loading: false },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.courseId !== action.payload);
      })
      .addCase(addUnit.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((c) =>
          c.courseId === updated.courseId ? updated : c
        );
      })
      .addCase(addChapter.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((c) =>
          c.courseId === updated.courseId ? updated : c
        );
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        const { courseId, unitId } = action.payload;
        const course = state.list.find((c) => c.courseId === courseId);
        course.units = course.units.filter((u) => u.unitId !== unitId);
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        const { courseId, unitId, chapterId } = action.payload;
        const course = state.list.find((c) => c.courseId === courseId);
        const unit = course.units.find((u) => u.unitId === unitId);
        unit.chapters = unit.chapters.filter((c) => c.chapterId !== chapterId);
      });
  },
});

export default courseSlice.reducer;
