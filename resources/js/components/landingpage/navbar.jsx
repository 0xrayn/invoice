"use client";

import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppearance } from "@/hooks/use-appearance";
import { Link } from "@inertiajs/react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [lang, setLang] = useState("id");
    const [openDropdownProduk, setOpenDropdownProduk] = useState(false);
    const [openDropdownLang, setOpenDropdownLang] = useState(false);
    const closeTimeout = useRef(null);
    const buttonRef = useRef(null);

    const { appearance, updateAppearance } = useAppearance();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const baseExpanded = scrolled;
    const isExpanded = mobileMenu || baseExpanded;

    const produkItems = [
        { divider: true, label: "Tagih Klien Anda Kapan Saja dan Dimana Saja" },
        { icon: "📄", title: "Invoice Penjualan", desc: "Buat invoice tanpa batas hanya dengan 1 klik!", href: route("invoice-penjualan") },
        { icon: "✉️", title: "Kirim Invoice", desc: "Kirim invoice gratis & tanpa batas via Whatsapp, Email atau SMS.", href: route("kirim-invoice") },
    ];


    return (
        <>
            <motion.nav
                initial={false}
                animate={{
                    borderRadius: isExpanded ? 0 : 40,
                    marginTop: baseExpanded ? 0 : 16,
                    width: isExpanded ? "100%" : "85%",
                    scale: isExpanded ? 1 : 0.98,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed top-0 z-50 flex flex-col -translate-x-1/2 shadow-lg left-1/2 bg-base-100 backdrop-blur-lg"
            >
                {/* Bar atas */}
                <div className="flex items-center justify-between px-6 py-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 font-bold rounded-full bg-primary text-primary-content">
                            CV
                        </span>
                        <h1 className="text-xl font-bold text-primary">Mata Timur Nusantara</h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="items-center hidden gap-6 font-semibold md:flex">

                        <Link href={route('home')} className="text-base-content hover:text-primary">
                            Beranda
                        </Link>

                        {/* Produk dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => {
                                if (closeTimeout.current) clearTimeout(closeTimeout.current)
                                setOpenDropdownProduk(true)
                            }}
                            onMouseLeave={() => {
                                closeTimeout.current = setTimeout(
                                    () => setOpenDropdownProduk(false),
                                    150
                                )
                            }}
                        >
                            <button
                                onClick={() => setOpenDropdownProduk((prev) => !prev)}
                                className="flex items-center gap-1 text-base-content hover:text-primary"
                            >
                                Produk
                                <motion.span
                                    animate={{ rotate: openDropdownProduk ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="inline-block"
                                >
                                    <ChevronDown size={16} />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openDropdownProduk && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`absolute left-1/2 -translate-x-1/2 mt-8
                ${produkItems.length <= 4
                                                ? "w-[400px] flex flex-col"
                                                : "w-[700px] grid grid-cols-2"
                                            }
                bg-base-200 shadow-lg rounded-xl p-4 gap-3 z-50`}
                                    >
                                        {produkItems.map((item, idx) =>
                                            item.divider ? (
                                                <div
                                                    key={idx}
                                                    className="text-[13px] font-semibold text-base-content/70 p-2 cursor-default col-span-2"
                                                >
                                                    {item.label}
                                                </div>
                                            ) : (
                                                <Link
                                                    key={idx}
                                                    href={item.href}
                                                    className="flex gap-3 items-start p-2 hover:bg-base-300 rounded-lg text-[13px] transition-transform hover:scale-[1.02]"
                                                >
                                                    <span className="text-2xl">{item.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium break-words">{item.title}</p>
                                                        <p className="text-sm break-words text-base-content/70">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </Link>
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Link biasa */}
                        <Link
                            href={route('cara-kerja')}
                            className="text-base-content hover:text-primary whitespace-nowrap"
                        >
                            Cara Kerja
                        </Link>
                        <Link href={route('about-us')} className="text-base-content hover:text-primary">
                            Tentang Kami
                        </Link>


                        {/* Tema desktop */}
                        <button
                            onClick={() =>
                                updateAppearance(appearance === "light" ? "dark" : "light")
                            }
                            className="p-2 btn btn-ghost btn-sm"
                        >
                            {appearance === "light" && <Sun size={20} />}
                            {appearance === "dark" && <Moon size={20} />}
                        </button>

                        <Link className="font-bold btn btn-primary" href={route("login")}>
                            Log in
                        </Link>
                    </div>

                    {/* Mobile Button */}
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden btn btn-ghost btn-sm">
                        {mobileMenu ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="font-semibold flex flex-col md:hidden px-6 pb-6 space-y-4 border-t border-base-300 max-h-[60vh] overflow-y-auto"
                        >
                            <Link href={route('home')} onClick={() => setMobileMenu(false)} className="mt-3 text-base-content hover:text-primary">Beranda</Link>
                            {/* Produk mobile */}
                            <div>
                                <button
                                    onClick={() => setOpenDropdownProduk(!openDropdownProduk)}
                                    className="flex items-center w-full gap-1 text-left text-base-content hover:text-primary"
                                >
                                    Produk
                                    <motion.span
                                        animate={{ rotate: openDropdownProduk ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-block"
                                    >
                                        <ChevronDown size={16} />
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {openDropdownProduk && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex flex-col gap-2 p-2 mt-3 rounded-lg bg-base-200"
                                        >
                                            {produkItems.map((item, idx) =>
                                                item.divider ? (
                                                    <div
                                                        key={idx}
                                                        className="pt-2 text-sm font-bold text-base-content/70"
                                                    >
                                                        {item.label}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        key={idx}
                                                        href={item.href}
                                                        onClick={() => setMobileMenu(false)}
                                                        className="flex gap-3 p-2 rounded-lg hover:bg-base-300"
                                                    >
                                                        <span className="text-xl">{item.icon}</span>
                                                        <div>
                                                            <p className="font-medium">{item.title}</p>
                                                            <p className="text-sm text-base-content/70">{item.desc}</p>
                                                        </div>
                                                    </Link>
                                                )
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>


                            {/* Link mobile */}
                            <Link href={route('cara-kerja')} onClick={() => setMobileMenu(false)} className="text-base-content hover:text-primary whitespace-nowrap">Cara Kerja</Link>
                            <Link href={route('about-us')} onClick={() => setMobileMenu(false)} className="text-base-content hover:text-primary">Tentang Kami</Link>

                            {/* Bendera + Tema + Login mobile */}
                            <div className="flex flex-row items-center justify-between gap-2 mt-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateAppearance(appearance === "light" ? "dark" : "light")} className="p-2 btn btn-ghost btn-sm">
                                        {appearance === "light" && <Sun size={20} />}
                                        {appearance === "dark" && <Moon size={20} />}
                                    </button>
                                </div>
                                <Link className="flex-1 font-bold btn btn-primary" href={route('login')}>Log in</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>


        </>
    );
}
