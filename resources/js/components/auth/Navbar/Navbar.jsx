"use client";
import React, { useEffect, useRef } from "react";
import {
    Bell,
    Grid,
    Menu,
    Sun,
    Moon,
    Home,
    Info,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import AnimatedDropdown from "./AnimatedDropdown";
import QuickAction from "./QuickAction";

export default function Navbar({
    sidebarOpen,
    setSidebarOpen,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    notifOpen,
    setNotifOpen,
    menuOpen,
    setMenuOpen,
    profileOpen,
    setProfileOpen,
    appearance,
    updateAppearance,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const notifications = auth.notifications ?? [];
    const unread = auth.unread_count ?? 0;
    const notifRef = useRef(null);
    const menuRef = useRef(null);
    const profileRef = useRef(null);


    const handleNotificationClick = (notif) => {
        window.location.href = route("notifications.read", notif.id);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifOpen && notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
            if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifOpen, menuOpen, profileOpen, setNotifOpen, setMenuOpen, setProfileOpen]);

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["auth"] });
        }, 3400);

        return () => clearInterval(interval);
    }, []);
    return (
        <div
            className={`
        fixed top-0 z-40 border-b border-base-300/70
        bg-base-100 backdrop-blur-xl px-4
        transition-all transition-colors duration-300 ease-in-out
        h-16
        ${sidebarOpen ? "md:left-64 md:w-[calc(100%-16rem)]" : "md:left-16 md:w-[calc(100%-4rem)]"}
        left-0 w-full
      `}
        >
            <div className="flex items-center justify-between h-16">
                {/* Left */}
                <div className="flex items-center flex-1 gap-2">
                    <button
                        aria-label="Toggle sidebar"
                        className="btn btn-ghost btn-circle"
                        onClick={() =>
                            window.innerWidth < 768
                                ? setMobileSidebarOpen((p) => !p)
                                : setSidebarOpen(!sidebarOpen)
                        }
                    >
                        <Menu size={22} />
                    </button>
                    <span className="hidden text-sm font-medium text-base-content/70 md:inline">
                        Welcome back <b>{user?.name ?? "User"}</b> 👋
                    </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1.5">
                    {/* Notifications */}
                    <div ref={notifRef} className="relative">
                        <button
                            aria-haspopup
                            aria-expanded={notifOpen}
                            onClick={() => {
                                setNotifOpen((p) => !p);
                                setMenuOpen(false);
                                setProfileOpen(false);
                            }}
                            className="relative btn btn-ghost btn-circle"
                        >
                            <Bell size={22} />

                            {unread > 0 && (
                                <span className="absolute badge badge-error badge-sm -top-1 -right-1">
                                    {unread}
                                </span>
                            )}
                        </button>

                        <AnimatedDropdown
                            isOpen={notifOpen}
                            onClose={() => setNotifOpen(false)}
                            width="w-80"
                        >
                            {/* Header */}
                            <div className="relative px-3 pt-3 pb-5 font-semibold text-base-100 text-center rounded-t-2xl bg-info border-b border-base-300">
                                <span className="text-sm sm:text-base">Notifications</span>
                                {unread > 0 && (
                                    <button
                                        className="absolute bottom-2 right-3 text-[10px] sm:text-xs text-base-300 hover:text-base-100"
                                        onClick={() =>
                                            router.post(route("notifications.readAll"), {}, {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    router.reload({ only: ["auth"] });
                                                },
                                            })
                                        }
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>




                            {/* Notifications List */}
                            <ul className="divide-y divide-base-300">
                                {notifications.length === 0 && (
                                    <li className="p-3 text-sm text-center text-base-content/60">
                                        Tidak ada notifikasi.
                                    </li>
                                )}
                                {notifications.slice(0, 5).map((n) => (
                                    <li
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className="p-3 text-sm cursor-pointer hover:bg-base-300/60"
                                    >
                                        <div className="font-semibold">{n.data.title}</div>
                                        <div className="text-xs text-base-content/70">{n.data.message}</div>
                                        <div className="mt-1 text-xs text-base-content/50">
                                            {new Date(n.created_at).toLocaleString()}
                                        </div>
                                    </li>
                                ))}

                                {/* View All */}
                                <li
                                    onClick={() => router.visit(route("notifications.index"))}
                                    className="flex items-center justify-center p-3 text-sm font-semibold cursor-pointer rounded-b-2xl hover:bg-info/80 hover:text-base-100"
                                >
                                    View All
                                </li>
                            </ul>
                        </AnimatedDropdown>

                    </div>

                    {/* Quick Menu */}
                    <div ref={menuRef} className="relative">
                        <button
                            aria-haspopup
                            aria-expanded={menuOpen}
                            onClick={() => {
                                setMenuOpen((p) => !p);
                                setNotifOpen(false);
                                setProfileOpen(false);
                            }}
                            className="btn btn-ghost btn-circle"
                        >
                            <Grid size={22} />
                        </button>
                        <AnimatedDropdown
                            isOpen={menuOpen}
                            onClose={() => setMenuOpen(false)}
                            width="w-80"
                        >
                            <div className="p-3 font-semibold text-center border-b text-base-100 rounded-t-2xl border-base-300 bg-info">
                                Quick Actions
                            </div>
                            <div className="grid grid-cols-2 gap-4 p-4">
                                <QuickAction icon={<Home size={24} />} label="Dashboard" href={route('dashboard')} />
                                <QuickAction icon={<BarChart3 size={24} />} label="Invoices" href={route('invoices.index')} />
                                <QuickAction icon={<Info size={24} />} label="Help" href={route('help')} />
                                <button
                                    className="flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer hover:bg-base-200"
                                    onClick={() =>
                                        updateAppearance(appearance === "light" ? "dark" : "light")
                                    }
                                >
                                    {appearance === "light" ? <Sun size={24} /> : <Moon size={24} />}
                                    <span className="text-xs">
                                        {appearance === "light" ? "Light" : "Dark"}
                                    </span>
                                </button>
                                <QuickAction icon={<Settings size={24} />} label="Settings" href={route('profile.edit')} />
                            </div>
                        </AnimatedDropdown>
                    </div>

                    <div ref={profileRef} className="relative">
                        <button
                            aria-haspopup
                            aria-expanded={profileOpen}
                            onClick={() => {
                                setProfileOpen((p) => !p);
                                setNotifOpen(false);
                                setMenuOpen(false);
                            }}
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    alt={user?.name || "User Avatar"}
                                    src={user?.profile_photo || "/images/default-avatar.png"}
                                />
                            </div>
                        </button>

                        <AnimatedDropdown
                            isOpen={profileOpen}
                            onClose={() => setProfileOpen(false)}
                            width="w-60"
                        >
                            {/* Header */}
                            <div className="p-3 font-semibold text-center border-b text-base-100 rounded-t-2xl border-base-300 bg-info">
                                My Account
                            </div>

                            {/* User Info */}
                            {user && (
                                <div className="px-3 py-2 text-sm">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-base-content/70">{user.email}</div>
                                </div>
                            )}

                            <ul className="divide-y divide-base-300">
                                <li>
                                    <Link
                                        className="flex items-center w-full gap-2 p-3 text-sm hover:bg-base-300/60"
                                        href={route("profile.edit")}
                                        as="button"
                                        prefetch
                                    >
                                        <Settings size={16} /> Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="flex items-center w-full gap-2 p-3 text-sm hover:bg-info/80 hover:text-base-100"
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                    >
                                        <LogOut size={16} /> Logout
                                    </Link>
                                </li>
                            </ul>
                        </AnimatedDropdown>
                    </div>

                </div>
            </div>
        </div>
    );
}
