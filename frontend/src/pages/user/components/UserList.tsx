import { UserResponse } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { queryUserList, userLoader } from "../loader";

const UserList = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof userLoader>>
  >;
  const [params] = useSearchParams();
  const { data, isLoading } = useQuery({
    ...queryUserList(params),
    initialData,
  });
  if (isLoading) return <div>Loading...</div>;

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
    ],
    []
  );
  const table = useReactTable({
    data: (data?.users ?? []) as UserResponse[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <div>
      <div className="h-[calc(100vh-10rem)] shadow bg-white p-2 rounded overflow-scroll">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-2 bg-gray-100">
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
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data?.total === 0 && <p className="text-center mt-4">暂无账户数据</p>}
      </div>
    </div>
  );
};
export default UserList;
