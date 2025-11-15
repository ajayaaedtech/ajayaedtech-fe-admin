"use client";

import { Card, CardContent } from "@mui/material";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="mt-2 text-gray-600">1240</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent>
            <h2 className="text-xl font-bold">Active Courses</h2>
            <p className="mt-2 text-gray-600">32</p>
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
