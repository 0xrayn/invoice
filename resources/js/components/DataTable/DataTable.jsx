// Components/DataTable/DataTable.jsx
export default function DataTable({
  columns,
  data,
  actions,
  onRowClick,
  emptyMessage = "Belum ada data",
}) {
  return (
    <table className="table w-full min-w-[900px]">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions && <th className="text-right">Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {data && data.length ? (
          data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="transition-colors duration-200 hover:bg-primary/10"
            >
              {columns.map((col) => {
                let content;

                if (col.render) {
                  // full row custom render
                  content = col.render(row, idx);
                } else if (col.format) {
                  // formatter untuk single field
                  content = col.format(row[col.key], row, idx);
                } else {
                  // default value (support nested key)
                  const keys = col.key.split(".");
                  let value = row;
                  for (const k of keys) value = value?.[k];
                  content =
                    typeof value === "object" ? JSON.stringify(value) : value ?? "-";
                }

                return (
                  <td
                    key={col.key}
                    className={`${col.tdClassName || ""} ${
                      col.clickable ? "cursor-pointer" : ""
                    }`}
                    onClick={col.clickable ? () => onRowClick?.(row) : undefined}
                    title={
                      col.clickable ? "Klik untuk melihat lengkap" : undefined
                    }
                  >
                    {content}
                  </td>
                );
              })}
              {actions && (
                <td className="flex justify-end gap-2">{actions(row)}</td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length + (actions ? 1 : 0)}
              className="py-6 text-center text-gray-400"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
