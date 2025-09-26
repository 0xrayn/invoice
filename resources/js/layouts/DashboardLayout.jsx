"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../components/auth/Navbar/Navbar";
import HeaderBreadcrumb from "../components/auth/HeaderBreadcrumb";
import { Home, Users, BarChart3, Settings, BookOpen, HelpCircle, LogOut } from "lucide-react";

import { useAppearance } from "@/hooks/use-appearance";
import { usePage } from "@inertiajs/react";
import MobileSidebar from "../components/auth/Sidebar/MobileSidebar";
import Sidebar from "../components/auth/Sidebar/Sidebar";

export default function ModernDashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [notifOpen, setNotifOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const { url } = usePage();
    const { auth } = usePage().props || {};
    const user = auth?.user || null;
    const userRole = user?.role;

    const { appearance, updateAppearance } = useAppearance();

    // Menu definition
    const menuItems = [
        { icon: <Home size={22} />, label: "Dashboard", key: "dashboard", url: route("dashboard"), roles: ["admin", "finance"] },
        { icon: <BookOpen size={22} />, label: "Invoices", key: "invoices", url: route("invoices.index"), roles: ["finance","admin"] },
        { icon: <BookOpen size={22} />, label: "Client", key: "customers", url: route("customers.index"), roles: ["finance"] },
        { icon: <BarChart3 size={22} />, label: "Produk", key: "product", url: route("products.index"), roles: ["admin"] },
        { icon: <BarChart3 size={22} />, label: "Perusahaan", key: "company", url: route("companies.index"), roles: ["admin"] },
        { icon: <Settings size={22} />, label: "Settings", key: "settings", url: route("profile.edit"), roles: ["admin", "finance"], pattern: /^\/settings/, },
        { icon: <HelpCircle size={22} />, label: "Help", key: "help", url: route("help"), roles: ["admin", "finance"] },
        { icon: <LogOut size={22} />, label: "Logout", key: "logout", url: route("logout"), roles: ["admin", "finance"] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

    useEffect(() => {
        if (!url) return;

        const activeMenu = filteredMenu.find(item => {
            if (item.pattern) {
                return item.pattern.test(url); // ✅ match regex
            }
            const itemPath = new URL(item.url, window.location.origin).pathname;
            return url.startsWith(itemPath);
        });

        setCurrentPage(activeMenu ? activeMenu.key : null);
    }, [url, filteredMenu]);



    return (
        <div className="relative min-h-screen bg-base-200">
            <Navbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
                notifOpen={notifOpen}
                setNotifOpen={setNotifOpen}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                profileOpen={profileOpen}
                setProfileOpen={setProfileOpen}
                appearance={appearance}
                updateAppearance={updateAppearance}
            />

            <Sidebar
                sidebarOpen={sidebarOpen}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                menuItems={filteredMenu}
            />

            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <MobileSidebar
                open={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                menuItems={filteredMenu}
            />

            <main className={`pt-16 transition-[margin] duration-300 ease-out ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
                <div className="p-4 mx-auto max-w-7xl md:p-6">
                    <HeaderBreadcrumb current={currentPage} menuItems={filteredMenu} />
                    {children}
                </div>
            </main>
        </div>
    );
}
