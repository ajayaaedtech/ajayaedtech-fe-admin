"use client";

import Link from "next/link";
import { Dashboard, People } from "@mui/icons-material";

export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: <Dashboard />, href: "/dashboard" },
    { label: "Users", icon: <People />, href: "/users" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-xl p-6">
      <h1 className="text-2xl font-bold mb-6">Ajayaa Admin</h1>

      <nav className="space-y-3">
        {menu.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
