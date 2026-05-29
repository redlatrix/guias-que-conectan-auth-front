interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-sm font-public font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-copper hover:text-copper transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
      >
        Anterior
      </button>

      <span className="text-sm text-gray-500 font-public">
        {page} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-sm font-public font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-copper hover:text-copper transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
      >
        Siguiente
      </button>
    </div>
  );
};
