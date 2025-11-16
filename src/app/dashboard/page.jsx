"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../redux/slices/adminStatsSlice"
import { Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const {
    totalUsers,
    totalCourses,
    totalEnrolledCourses,
    loading,
    error,
  } = useSelector((state) => state.adminStats);

  useEffect(() => {
    dispatch(fetchAdminStats())
      .unwrap()
      .catch(() => toast.error("Failed to load dashboard stats"));
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      {loading && <p>Loading stats…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="mt-2 text-gray-600">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Total Courses</h2>
            <p className="mt-2 text-gray-600">{totalCourses}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Total Enrolled Courses</h2>
            <p className="mt-2 text-gray-600">{totalEnrolledCourses}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
