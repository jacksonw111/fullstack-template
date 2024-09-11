import { UserResponse } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  Row,
  Updater,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { queryUserList } from "../loader";
import UserDelete from "./UserDelete";
import UserUpdate from "./UserUpdate";

const UserList = () => {
  // const [params] = useSearchParams();
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
  });
  const { data, isLoading } = useQuery({
    ...queryUserList(pagination),
  });

  // const [skip, setSkip] = useState(0);
  // const [limit, setLimit] = useState(10);

  const columns = useMemo(
    () => [
      {
        header: "姓名",
        accessorKey: "name",
      },
      {
        header: "邮箱",
        accessorKey: "email",
      },
      {
        header: "角色",
        accessorKey: "role",
        cell: ({ getValue }: { getValue: () => { name: string } }) =>
          getValue().name,
      },
      {
        header: "状态",
        accessorKey: "status",
      },
      {
        header: "最后活跃时间",
        accessorKey: "last_active_at",
        cell: ({ getValue }: { getValue: () => string }) =>
          new Date(getValue()).toLocaleString(),
      },
      {
        header: "操作",
        cell: ({ row }: { row: Row<UserResponse> }) => (
          <div className="space-x-2">
            <UserUpdate userId={row.original.id} initialData={row.original} />
            <UserDelete userId={row.original.id} />
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: (data?.users ?? []) as UserResponse[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: pagination.skip,
        pageSize: pagination.limit,
      },
    },
    manualPagination: true,
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const newPagination = typeof updater === 'function'
        ? updater({
            pageIndex: pagination.skip,
            pageSize: pagination.limit,
          })
        : updater;
      setPagination({
        skip: newPagination.pageIndex,
        limit: newPagination.pageSize,
      });
    },
    pageCount: Math.ceil((data?.total ?? 0) / pagination.limit),
  });

  if (isLoading) return <div>加载中...</div>;

  return (
    <div className="space-y-4 overflow-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full  border">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.total === 0 && <p className="text-center mt-4">暂无账户数据</p>}
      <div className="flex justify-end mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="text-sm text-gray-700">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
