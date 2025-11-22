import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import AnimatedCard from "@/Components/DataTable/AnimatedCard";
import {
    FileText,
    Box,
    Building,
    Settings,
    Users,
    Activity
} from "lucide-react";

export default function Index() {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    // =======================================
    // ANIMATIONS
    // =======================================

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerChildren = {
        visible: {
            transition: { staggerChildren: 0.18 }
        }
    };

    const stepItem = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.45 }
        }
    };

    // =======================================
    // ICON GRADIENT WRAPPER
    // =======================================

    const GradientIcon = ({ children }) => (
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
            {children}
        </div>
    );



    // =======================================
    // IMAGE COMPONENT
    // =======================================

    const Image = ({ src }) => (
        <motion.img
            src={src}
            alt="img"
            className="w-full h-auto border shadow-lg rounded-xl border-base-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        />
    );

    // =======================================
    // SECTION WRAPPER WITH ANIMATION
    // =======================================

    // =======================================
    // SECTION WRAPPER WITH ANIMATION
    // =======================================

    const Section = ({ icon, title, children }) => (
        <AnimatedCard className="p-6 border shadow-xl bg-base-100/60 rounded-2xl border-base-300 backdrop-blur-xl">

            {/* Title */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 mb-2"
            >
                <GradientIcon>{icon}</GradientIcon>
                <h2 className="text-xl font-bold tracking-wide">{title}</h2>
            </motion.div>

            {/* SEMI-FULL DIVIDER */}
            <div className="w-[95%] mx-auto h-px bg-base-300/70 mb-4"></div>

            {/* Step-by-step text */}
            <motion.div
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
                className="space-y-3 text-sm opacity-90"
            >
                {React.Children.map(children, (child) => (
                    <motion.div variants={stepItem}>{child}</motion.div>
                ))}
            </motion.div>

        </AnimatedCard>
    );


    // =======================================
    // PAGE START
    // =======================================

    return (
        <ModernDashboardLayout>
            <Head title="Help" />

            <div className="p-4 mx-auto space-y-8 max-w-7xl">

                {/* Header */}
                <AnimatedCard className="flex items-center justify-between px-6 py-4 mb-6">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500">
                        ✨ Bantuan Sistem — {user?.role === "admin" ? "Admin" : "Finance"}
                    </h1>
                </AnimatedCard>

                {/* ============================= ADMIN ============================= */}
                {user?.role === "admin" && (
                    <div className="space-y-10">

                        <Section icon={<Activity size={22} />} title="Dashboard">
                            <Image src="/images/dashboard-admin.png" />
                            <p>
                                Dashboard menyajikan gambaran menyeluruh mengenai aktivitas dan performa sistem.
                                Informasi utama seperti total penjualan bulan ini, jumlah invoice yang telah dibuat,
                                total pelanggan aktif, serta ketersediaan produk ditampilkan dalam bentuk visual yang
                                interaktif. Semua elemen bergerak secara dinamis sehingga memudahkan admin memahami
                                kondisi sistem secara sekilas.
                            </p>
                            <p>
                                Sistem juga menampilkan indikator produk yang hampir habis dan daftar invoice draft
                                yang belum diselesaikan, membantu admin melakukan pengawasan lebih cepat dan akurat.
                            </p>
                        </Section>

                        <Section icon={<FileText size={22} />} title="Invoice (Admin)">
                            <Image src="/images/invoice-admin.png" />
                            <p>
                                Admin dapat melihat seluruh invoice yang dibuat oleh tim finance. Tampilan daftar invoice
                                dibuat modern dengan animasi halus saat membuka detailnya. Meskipun demikian, admin tidak
                                dapat mencetak atau mengirim invoice tersebut.
                            </p>
                        </Section>

                        <Section icon={<Box size={22} />} title="Produk (Admin)">
                            <Image src="/images/produk-admin.png" />
                            <p>
                                Admin memiliki kebebasan penuh mengelola seluruh data produk. Setiap perubahan pada stok,
                                deskripsi, atau atribut produk ditampilkan dengan animasi framer-motion yang membuat interaksi
                                terasa mulus dan responsif.
                            </p>
                        </Section>

                        <Section icon={<Building size={22} />} title="Perusahaan (Admin)">
                            <Image src="/images/perusahaan-admin.png" />
                            <p>
                                Halaman perusahaan dilengkapi transisi visual yang membuat proses pengeditan data menjadi
                                lebih nyaman. Admin dapat memperbarui informasi perusahaan, namun tidak dapat membuat data baru.
                            </p>
                        </Section>

                        <Section icon={<Settings size={22} />} title="Pengaturan (Admin)">
                            <Image src="/images/settings-admin.png" />
                            <p>
                                Halaman pengaturan memberikan pengalaman visual modern dengan efek hover, transisi warna tema,
                                serta animasi lembut saat pengguna memperbarui profil mereka.
                            </p>
                        </Section>

                    </div>
                )}

                {/* ============================= FINANCE ============================= */}
                {user?.role === "finance" && (
                    <div className="space-y-10">

                        <Section icon={<Activity size={22} />} title="Dashboard">
                            <Image src="/images/dashboard-finance.png" />
                            <p>
                                Dashboard finance menampilkan visualisasi data penjualan dan aktivitas transaksi secara real-time,
                                dengan animasi grafik serta elemen UI yang responsif. Tampilan ini membantu finance memonitor
                                performa secara cepat dan efisien.
                            </p>
                        </Section>

                        <Section icon={<FileText size={22} />} title="Invoice (Finance)">
                            <Image src="/images/invoice-finance.png" />
                            <p>
                                Pembuatan invoice dirancang dengan pengalaman antarmuka yang profesional. Setiap elemen seperti
                                pengisian data pelanggan, pemilihan produk, penentuan diskon, hingga penambahan pajak memiliki
                                animasi kecil yang membuat proses terasa lebih hidup.
                            </p>
                            <p>
                                Setelah selesai, finance dapat mencetak atau mengirim invoice secara langsung. Sistem juga otomatis
                                memperbarui stok dengan transisi halus pada UI sehingga perubahan data terasa nyata.
                            </p>
                        </Section>

                        <Section icon={<Users size={22} />} title="Pelanggan (Finance)">
                            <Image src="/images/client-finance.png" />
                            <p>
                                Halaman pelanggan dibuat lebih intuitif dengan efek transisi saat menambah data baru. Form input tampil
                                lebih modern dan responsif sehingga membantu finance mengisi data secara cepat.
                            </p>
                        </Section>

                        <Section icon={<Settings size={22} />} title="Pengaturan (Finance)">
                            <Image src="/images/settings-finance.png" />
                            <p>
                                Pengguna dapat memperbarui profil dan preferensi tema aplikasi. Animasi switching antara mode terang
                                dan gelap dibuat lebih halus untuk memberikan pengalaman yang premium.
                            </p>
                        </Section>

                    </div>
                )}

            </div>
        </ModernDashboardLayout>
    );
}
