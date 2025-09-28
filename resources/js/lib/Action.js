import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export const confirmAction = (message, callback) => {
    if (confirm(message)) {
        callback();
    }
};

export const deleteInvoice = (id) => {
    confirmAction("Yakin ingin menghapus invoice ini?", () => {
        router.delete(route("invoices.destroy", id), {
            onSuccess: () => router.visit(route("invoices.index")),
            onError: () => alert("Gagal menghapus invoice."),
        });
    });
};

export const markInvoicePrinted = (id) => {
    confirmAction("Tandai invoice ini sebagai Printed?", () => {
        router.patch(route("invoices.markPrinted", id), {}, {
            onSuccess: () => router.reload(),
            onError: () => alert("Gagal menandai Printed."),
        });
    });
};

export const markInvoiceSent = (id) => {
    confirmAction("Tandai invoice ini sebagai Sent?", () => {
        router.patch(route("invoices.markSent", id), {}, {
            onSuccess: () => router.reload(),
            onError: () => alert("Gagal menandai Sent."),
        });
    });
};
