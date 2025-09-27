import { AnimatePresence, motion } from "framer-motion";

export default function AddressModal({ address, onClose }) {
  if (!address) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md p-6 rounded-lg shadow-lg bg-base-100"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h2 className="mb-4 text-lg font-bold">Alamat Lengkap</h2>
          <p className="break-words">{address}</p>
          <button className="mt-4 btn btn-sm btn-primary" onClick={onClose}>
            Tutup
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
