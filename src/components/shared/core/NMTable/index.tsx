"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface NMTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function NMTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: NMTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Create skeleton rows (same number as columns)
  const skeletonRows = Array.from({ length: 5 }); // Show 5 skeleton rows

  return (
    <div className="my-5">
      <Table>
        <TableHeader>
          {table?.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-gray-300/60 hover:bg-gray-300/60"
            >
              {headerGroup.headers.map((header) => (
                <TableHead className="font-bold text-gray-600" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // ==================== SKELETON LOADING ====================
            <>
              {skeletonRows.map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  className="bg-gray-100/40"
                >
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      className="py-4"
                    >
                      <Skeleton className="h-6 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : table.getRowModel().rows?.length ? (
            // ==================== ACTUAL DATA ====================
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="bg-gray-100/40 hover:bg-gray-200/40"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // ==================== NO DATA ====================
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
