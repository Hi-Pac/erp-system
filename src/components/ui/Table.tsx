import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Input } from './Input';

interface TableProps {
  columns: any[];
  data: any[];
  onRowClick?: (row: any) => void;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  onRowClick,
  className = ''
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    { 
      columns, 
      data,
      initialState: { pageIndex: 0, pageSize: 10 } 
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="w-60">
          <Input
            placeholder="بحث..."
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            الصفحة{' '}
            <strong>
              {pageIndex + 1} من {pageOptions.length}
            </strong>{' '}
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded p-1 ml-2"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                عرض {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table 
          {...getTableProps()} 
          className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg"
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center justify-end">
                      {column.render('Header')}
                      <span className="ml-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUp className="h-3 w-3" />
                          )
                        ) : null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr 
                  {...row.getRowProps()}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className={`p-1 rounded ${!canPreviousPage ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`p-1 rounded ${!canPreviousPage ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            انتقال إلى:
          </span>
          <input
            type="number"
            min={1}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="w-14 p-1 text-sm mx-2 border border-gray-300 rounded"
          />
          <span className="text-sm text-gray-500">
            من {pageOptions.length}
          </span>
        </div>
        
        <div>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`p-1 rounded ${!canNextPage ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={`p-1 rounded ${!canNextPage ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};