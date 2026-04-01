import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  buildUrl: (page: number) => string;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  buildUrl,
}: AppPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;

          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(pageNumber - currentPage) <= 1
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={buildUrl(pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          }

          if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return null;
        })}

        {/* Next */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}