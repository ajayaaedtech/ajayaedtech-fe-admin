"use client";
import Sidebar from "./components/Sidebar"
import { Card, CardContent } from "@mui/material";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-6">Dashboard Overview</h2>

        <div className="grid grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-xl font-bold">Total Users</h3>
              <p className="text-gray-600 mt-2">1,240</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-xl font-bold">Active Courses</h3>
              <p className="text-gray-600 mt-2">32</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-xl font-bold">Revenue</h3>
              <p className="text-gray-600 mt-2">₹2,40,000</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
