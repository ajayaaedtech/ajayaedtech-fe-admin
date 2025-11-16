"use client";

import Link from "next/link";
import { Dashboard, People, Logout } from "@mui/icons-material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // 🔥 Detect current page

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    router.push("/login");
  };

  const menu = [
    // { label: "Home", icon: <HomeIcon />, href: "/" },
    { label: "Dashboard", icon: <Dashboard />, href: "/dashboard" },
    { label: "Users", icon: <People />, href: "/users" },
    { label: "Courses", icon: <LibraryBooksIcon />, href: "/courses" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-xl p-6 flex flex-col justify-between">
      
      {/* Top Menu */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Ajayaa Admin</h1>

        <nav className="space-y-3">
          {menu.map((item, i) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all 
                  ${isActive ? "text-red-600 bg-red-50 border-l-4 border-red-600" : "hover:bg-gray-100"}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-600 mt-10 p-3 rounded-lg hover:bg-red-50 cursor-pointer transition-all"
      >
        <Logout />
        <span>Logout</span>
      </button>
    </aside>
  );
}
