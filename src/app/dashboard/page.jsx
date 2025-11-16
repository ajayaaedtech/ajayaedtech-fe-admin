"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@mui/material";
import { USER_COUNT_URL, COURSE_COUNT_URL } from "../../api/api";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const userRes = await axios.get(USER_COUNT_URL);
        const courseRes = await axios.get(COURSE_COUNT_URL);

        setUserCount(userRes.data.total || 0);
        setCourseCount(courseRes.data.total || 0);
      } catch (error) {
        toast.error("Failed to load dashboard stats — please try again.");
        console.log("Dashboard API Error:", error);
      }
    }

    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="mt-2 text-gray-600">{userCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Total Courses</h2>
            <p className="mt-2 text-gray-600">{courseCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Revenue</h2>
            <p className="mt-2 text-gray-600">₹2,40,000</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
