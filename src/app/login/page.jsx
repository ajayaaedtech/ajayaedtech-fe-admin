"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { ADMINLOGIN } from "../../api/api" // Assuming this is the correct path to your API constant

// --- Component Start ---

export default function LoginPage() {
  const router = useRouter();

  // 1. State for form inputs
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 2. Redirect if already logged in (Check token on mount)
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // 3. Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 4. Handle Login submission
  const handleLogin = async () => {
    // Input validation
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      // API Call
      const res = await axios.post(
        ADMINLOGIN,
        form
      );

      const token = res.data?.token;

      // Token check
      if (!token) {
        toast.error("Authentication token missing from server response.");
        return;
      }

      // 5. Store in cookie (Set expiration to 7 days)
      // Note: For security, consider using HttpOnly cookies set by the BE.
      Cookies.set("token", token, { expires: 7, secure: process.env.NODE_ENV === 'production' });

      toast.success("Login successful!");

      // Delay for toast visibility before redirect
      setTimeout(() => {
        // router.refresh() is good practice to re-fetch layout data
        router.refresh(); 
        router.push("/dashboard");
      }, 400);

    } catch (err) {
      // Error handling
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials or network error.");
    }
  };

  // 6. Component UI
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      
      {/* Card Container for the form */}
      <Card className="w-full max-w-md shadow-2xl transition-shadow duration-300 hover:shadow-2xl">
        <CardContent className="p-8 space-y-6">

          {/* Title Section */}
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            className="font-bold text-gray-800 mb-6"
          >
            Admin Login 🔑
          </Typography>
          
          <hr className="my-4" />

          {/* Form Fields Section */}
          <div className="space-y-6">
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={form.email}
              onChange={handleChange}
              // Added margin bottom for spacing between fields
              className="mb-4" 
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              value={form.password}
              onChange={handleChange}
              // Added margin bottom for spacing between fields
              className="mb-4" 
            />
          </div>

          <hr className="my-4" />
          
          {/* Button Section */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleLogin}
            // Added margin top/bottom for spacing around the button
            className="mt-6 mb-4 transform transition duration-200 hover:scale-[1.01]" 
          >
            Login
          </Button>
          
        </CardContent>
      </Card>
      
    </div>
  );
}