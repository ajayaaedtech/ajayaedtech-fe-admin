"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TextField, Button, Card, CardContent } from "@mui/material";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) router.push("/dashboard");
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/admin/login",
        form
      );

      const token = res.data?.token;

      if (!token) {
        toast.error("Token missing from server");
        return;
      }

      // Store in cookie
      Cookies.set("token", token, { expires: 7 });

      toast.success("Login successful");

      setTimeout(() => {
        router.refresh();
        router.push("/dashboard");
      }, 400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent>
          <h1 className="text-3xl font-semibold mb-6 text-center">
            Admin Login
          </h1>

          <div className="space-y-5">
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
