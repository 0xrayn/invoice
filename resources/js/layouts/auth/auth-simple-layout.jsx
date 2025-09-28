import { Link } from "@inertiajs/react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useAppearance } from "@/hooks/use-appearance"

export default function AuthSimpleLayout({ children, title, description }) {
  const { appearance, updateAppearance } = useAppearance()

  return (
    <div className="relative flex items-center justify-center min-h-screen px-3 py-6 overflow-hidden transition-colors duration-300 bg-base-200 sm:px-6 lg:px-8 sm:py-10">
      {/* Background animated shapes */}
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 rounded-full top-10 left-5 sm:left-10 sm:h-40 sm:w-40 bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-48 h-48 rounded-full bottom-16 right-5 sm:right-10 sm:h-60 sm:w-60 bg-secondary/20 blur-3xl"
      />

      {/* Card container responsif */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm p-5 border shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl bg-base-100 border-base-300 sm:p-8 lg:p-10"
      >
        {/* Theme toggle (pojok kanan atas) */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() =>
              updateAppearance(appearance === "light" ? "dark" : "light")
            }
            className="p-2 btn btn-ghost btn-sm"
          >
            {appearance === "light" && <Sun size={18} />}
            {appearance === "dark" && <Moon size={18} />}
          </button>
        </div>

        {/* Logo + title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href={route("home")}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md sm:h-14 sm:w-14 bg-gradient-to-br from-primary to-secondary">
              <span className="text-sm font-bold text-white sm:text-lg">CV</span>
            </div>
          </Link>

          <div>
            <h1 className="text-xl font-bold text-transparent sm:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text">
              {title}
            </h1>
            <p className="text-xs sm:text-sm opacity-70">{description}</p>
          </div>
        </div>

        {/* Form content */}
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  )
}
