const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-end items-center gap-2 mt-6 flex-wrap">
      {/* PREV */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
      >
        &lt;
      </button>

      {/* NUMBER */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md ${
            currentPage === page
              ? "bg-emerald-600 text-white"
              : "border hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
