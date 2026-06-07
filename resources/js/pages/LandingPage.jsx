import { LazyMotion, domAnimation, m } from "framer-motion";
import Navbar from "../components/landingpage/Navbar";
import Footer from "../components/landingpage/Footer";

const steps = [
    {
        step: "1",
        title: "Buat Invoice",
        desc: "Hanya beberapa klik untuk membuat invoice dengan template profesional.",
    },
    {
        step: "2",
        title: "Kirim & Lacak",
        desc: "Kirim langsung ke email klien dan pantau status secara real-time.",
    },
    {
        step: "3",
        title: "Terima Pembayaran",
        desc: "Klien membayar dengan aman secara online, Anda dapat notifikasi instan.",
    },
    {
        step: "4",
        title: "Atur Data",
        desc: "Simpan dan kelola semua invoice dalam dashboard yang rapi.",
    },
    {
        step: "5",
        title: "Analisis Bisnis",
        desc: "Lihat laporan keuangan dan tren pembayaran untuk pengambilan keputusan lebih baik.",
    },
];

const LandingPage = () => {
    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
                {/* Navbar */}
                <Navbar />

                <section className="relative z-10 bg-base-100 rounded-b-[60px] md:rounded-b-[120px] overflow-hidden pt-24 pb-16 md:py-0 md:min-h-screen md:flex md:items-center">
                    {/* Gradient Ornaments (subtle glow) */}
                    <m.div
                        className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary opacity-40 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"
                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <m.div
                        className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary opacity-30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"
                        animate={{ opacity: [0.2, 0.45, 0.2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />



                    <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-12 relative z-10">
                        {/* Text */}
                        <div className="flex flex-col max-w-lg text-center md:text-left order-1">
                            {/* Title */}
                            <m.h1
                                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7 }}
                            >
                                Membangun{" "}
                                <m.span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]"
                                    animate={{ backgroundPosition: ["0% center", "200% center"] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                >
                                    Solusi Invoice
                                </m.span>{" "}
                                Digital Profesional
                            </m.h1>

                            {/* Image (MOBILE only) */}
                            <m.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="md:hidden mt-6 flex justify-center"
                            >
                                <m.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-64 h-64 drop-shadow-2xl rounded-2xl overflow-hidden border border-base-300/40"
                                >
                                    <img
                                        src="/assets/mahila.png"
                                        alt="Hero"
                                        className="object-cover w-full h-full scale-105 hover:scale-110 transition-transform duration-700"
                                    />
                                </m.div>
                            </m.div>

                            {/* Description + Buttons */}
                            <div className="mt-6 space-y-6">
                                <m.p
                                    className="text-base sm:text-lg md:text-xl opacity-80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                >
                                    Menghadirkan sistem invoice digital yang modern, aman, dan mudah digunakan untuk mendukung pertumbuhan bisnis
                                </m.p>

                                <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                                    <m.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn btn-primary rounded-full px-8 shadow-lg"
                                    >
                                        Mulai Sekarang
                                    </m.button>
                                    <m.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn btn-outline rounded-full px-8"
                                    >
                                        Lihat Portofolio
                                    </m.button>
                                </div>
                            </div>
                        </div>

                        {/* Image (DESKTOP only) */}
                        <m.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden md:flex justify-center md:justify-end order-2"
                        >
                            <m.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-[350px] h-[350px] drop-shadow-2xl rounded-2xl overflow-hidden border border-base-300/40"
                            >
                                <img
                                    src="/assets/mahila.png"
                                    alt="Hero"
                                    className="object-cover w-full h-full scale-105 hover:scale-110 transition-transform duration-700"
                                />
                            </m.div>
                        </m.div>
                    </div>
                </section>
                {/* Features Section */}
                <section className="relative py-20 px-6 md:px-20 flex flex-col items-center gap-12 bg-base-100 rounded-t-[60px] md:rounded-t-[120px] rounded-b-[60px] overflow-hidden">

                    {/* Glow ornaments */}
                    <m.div
                        className="absolute top-10 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px]"
                        animate={{ opacity: [0.25, 0.45, 0.25] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <m.div
                        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-[150px]"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />

                    {/* Heading */}
                    <div className="max-w-2xl text-center space-y-4 relative z-10">
                        <m.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-5xl font-bold"
                        >
                            Fitur Canggih untuk Invoice Anda
                        </m.h2>
                        <m.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="opacity-70 text-lg"
                        >
                            Alat yang memudahkan alur kerja Anda dan membantu pembayaran lebih cepat.
                        </m.p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl relative z-10">
                        {[
                            {
                                title: "Pengingat Otomatis",
                                desc: "Kirim pengingat pembayaran otomatis ke klien agar lebih cepat dibayar.",
                                icon: "⏰",
                            },
                            {
                                title: "Pembayaran Aman",
                                desc: "Terima pembayaran dengan keamanan tinggi dan banyak metode.",
                                icon: "🔒",
                            },
                            {
                                title: "Ekspor ke PDF",
                                desc: "Buat invoice PDF profesional hanya dengan sekali klik.",
                                icon: "📄",
                            },
                            {
                                title: "Pelacakan Real-Time",
                                desc: "Pantau status setiap invoice dengan notifikasi langsung.",
                                icon: "📊",
                            },
                        ].map((f, i) => (
                            <m.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                whileHover={{ scale: 1.05 }}
                                className="card bg-base-200/80 shadow-xl hover:shadow-2xl transition rounded-2xl border border-base-300/40"
                            >
                                <div className="card-body p-6 flex flex-col items-center gap-3 text-center">
                                    <div className="text-4xl">{f.icon}</div>
                                    <h3 className="text-xl font-semibold text-primary">{f.title}</h3>
                                    <p className="opacity-70">{f.desc}</p>
                                </div>
                            </m.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center space-y-4 relative z-10"
                    >
                        <p className="text-lg opacity-70">
                            Join hundreds of businesses already growing with us.
                        </p>
                        <button className="btn btn-primary rounded-full px-8 shadow-lg">
                            Get Started Today
                        </button>
                    </m.div>
                </section>

                <section className="relative py-16 px-4 sm:px-6 md:px-20 bg-base-100 rounded-t-[60px] md:rounded-t-[120px] rounded-b-[60px] md:rounded-b-[120px] overflow-hidden">
                    {/* Glow ornaments */}
                    <m.div
                        className="absolute -top-20 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl rounded-full"
                        animate={{ opacity: [0.25, 0.5, 0.25] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <m.div
                        className="absolute bottom-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-tl from-secondary/30 to-primary/30 blur-3xl rounded-full"
                        animate={{ opacity: [0.2, 0.45, 0.2] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />

                    <div className="container mx-auto max-w-4xl md:max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
                        {/* Text Content */}
                        <div className="space-y-3 text-center md:text-left order-1 md:order-2">
                            <m.h2
                                className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug sm:leading-tight"
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                Kelola{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    Invoices
                                </span>{" "}
                                Anda dengan Mudah
                            </m.h2>

                            <m.p className="text-base sm:text-lg opacity-80 max-w-md sm:max-w-xl mx-auto md:mx-0">
                                Buat, lacak, dan kelola faktur dengan mudah. Platform kami memastikan
                                templat profesional, transaksi aman, dan pelacakan waktu nyata untuk semua
                                kebutuhan bisnis Anda.
                            </m.p>

                        </div>

                        {/* Invoice Mockup */}
                        <m.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                            className="relative flex justify-center order-2 md:order-1 mt-8 md:mt-0"
                        >
                            <div className="card w-72 sm:w-[350px] shadow-2xl rounded-2xl overflow-hidden border border-base-300/40 bg-base-200">
                                <div className="card-body p-5 sm:p-6 space-y-3 sm:space-y-4">
                                    <h3 className="text-lg sm:text-xl font-bold text-primary">Invoice #INV-2025</h3>
                                    <p className="text-sm opacity-70">Issued to: PT. Tech Solution</p>
                                    <div className="divider my-2" />
                                    <div className="flex justify-between text-sm">
                                        <span>Design Services</span>
                                        <span>$1,200</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Hosting</span>
                                        <span>$300</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Maintenance</span>
                                        <span>$150</span>
                                    </div>
                                    <div className="divider my-2" />
                                    <div className="flex justify-between font-bold text-base sm:text-lg">
                                        <span>Total</span>
                                        <span>$1,650</span>
                                    </div>
                                    <button className="btn btn-success w-full rounded-full mt-3 sm:mt-4 py-2 sm:py-3">
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    </div>
                </section>



                <section className="relative py-24 px-6 md:px-20 bg-base-100 rounded-tr-[60px] md:rounded-tr-[120px] rounded-b-[60px] md:rounded-b-[120px] overflow-hidden">
                    {/* Gradient konsisten dengan Invoice Section */}
                    <m.div
                        className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl"
                        animate={{ opacity: [0.25, 0.5, 0.25] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <m.div
                        className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-secondary/30 to-primary/30 blur-3xl"
                        animate={{ opacity: [0.2, 0.45, 0.2] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />

                    <div className="container mx-auto max-w-6xl text-center space-y-16 relative z-10">
                        <m.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold"
                        >
                            Cara Kerjanya
                        </m.h2>

                        <div className="relative flex flex-col md:flex-row justify-between">
                            {/* Garis utama */}
                            <div className="hidden md:block absolute top-8 left-0 w-full border-t-2 border-primary/60" />

                            {steps.map((w, i) => (
                                <m.div
                                    key={i}
                                    className="relative flex flex-col items-center text-center w-full md:w-1/5"
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2, duration: 0.6 }}
                                    viewport={{ once: true }}
                                >
                                    {/* Lingkaran Step DaisyUI */}
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full text-white font-bold text-xl shadow-lg z-10 bg-primary">
                                        {w.step}
                                    </div>

                                    {/* Teks */}
                                    <div className="mt-6 px-4">
                                        <h3 className="text-lg font-semibold">{w.title}</h3>
                                        <p className="opacity-70 text-sm mt-1">{w.desc}</p>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="relative py-24 px-6 md:px-20 bg-base-200 rounded-t-[50px] overflow-hidden">
                    {/* Gradient dekorasi */}
                    <div className="absolute -top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-10 w-72 h-72 bg-gradient-to-tl from-secondary/20 to-primary/20 blur-3xl rounded-full pointer-events-none" />

                    <div className="container mx-auto max-w-6xl text-center space-y-12 relative z-10">
                        <m.h2
                            className="text-3xl md:text-5xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            What Our Clients Say
                        </m.h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Andi Pratama",
                                    role: "CEO, Kreatifindo",
                                    text: "Sistem invoice ini telah menyederhanakan proses pembayaran kami. Cepat, aman, dan profesional!",
                                },
                                {
                                    name: "Sarah Wijaya",
                                    role: "Manajer Keuangan, GlobalTech",
                                    text: "Dengan pengingat otomatis dan ekspor PDF, kami menghemat banyak waktu setiap minggu. Benar-benar mengubah cara kerja kami.",
                                },
                                {
                                    name: "Michael Tan",
                                    role: "Freelancer",
                                    text: "Mengelola klien di seluruh dunia tidak pernah semudah ini berkat dukungan multi-mata uang.",
                                },

                            ].map((t, i) => (
                                <m.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="card bg-base-100 shadow-lg rounded-2xl p-8 space-y-4 hover:shadow-2xl transition"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        {/* Avatar anonim (huruf awal nama) */}
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg mb-4 shadow-md">
                                            {t.name.charAt(0)}
                                        </div>
                                        <p className="italic opacity-80">“{t.text}”</p>
                                        <h3 className="mt-4 font-semibold text-primary">{t.name}</h3>
                                        <p className="text-sm opacity-60">{t.role}</p>
                                    </div>
                                </m.div>
                            ))}

                        </div>
                    </div>
                </section>
                {/* Footer */}
                <Footer />
            </div>
        </LazyMotion>
    );
};

export default LandingPage;
