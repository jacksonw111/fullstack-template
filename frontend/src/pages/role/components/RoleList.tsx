import { useQuery } from "@tanstack/react-query";
import { message, Space, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listRoles } from "~api/role";
import RoleAdd from "./RoleAdd";
import RoleDelete from "./RoleDelete";
import RoleUpdate from "./RoleUpdate";

const RoleList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["roles", page, pageSize],
    queryFn: () => listRoles({ skip: page, limit: pageSize }),
  });

  if (error) {
    message.error("获取角色列表失败");
  }

  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <RoleUpdate roleId={record.id} />
          <RoleDelete roleId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <RoleAdd />
      <Table
        columns={columns}
        dataSource={data?.data.items}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page + 1,
          pageSize: pageSize,
          total: data?.data.total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default RoleList;
