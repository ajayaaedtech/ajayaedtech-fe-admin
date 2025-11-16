"use client"

import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
export const  Metadata = {
  title: "AjayaaEdTech - Admin",
  description: "Created by AjayaaEdTech",
};



export default function RootLayout({ children }) {
  const pathname = usePathname();

  const noSidebarRoutes = ["/login"];

  const hideSidebar = noSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="flex bg-gray-50">
        <Provider store={store}>
          {!hideSidebar && <Sidebar />}

          <main className={`flex-1 p-10 ${hideSidebar ? "p-0" : ""}`}>
            {children}
            <ToastContainer position="top-center" autoClose={3000} />
          </main>
        </Provider>
      </body>
    </html>
  );
}