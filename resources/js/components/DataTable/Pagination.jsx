import { router } from "@inertiajs/react";

export default function Pagination({ links }) {
  if (!links || !links.length) return null;

  return (
    <div className="flex justify-center gap-2 mt-6">
      {links.map((link, idx) => (
        <button
          key={idx}
          disabled={!link.url}
          onClick={() => link.url && router.get(link.url)}
          className={`btn btn-sm ${link.active ? "btn-primary" : "btn-outline btn-secondary"}`}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
}
