import { EditFilled } from '@ant-design/icons';
import {
  Button,
  Table,
  TableColumnsType,
  TableColumnType,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IOrder } from '@/types';
import APP_ROUTES from '@/utils/routes';
import { ordersData } from '@/utils/static';

const Orders = () => {
  const navigate = useNavigate();

  const onEdit = useCallback(
    (order: IOrder) => {
      navigate(`${APP_ROUTES.ORDERS}/${order.xid}`);
    },
    [navigate],
  );

  const columns: TableColumnType<IOrder>[] = useMemo(
    () => [
      {
        title: 'ID',
        render: (_, order) => order.xid,
      },
      {
        title: 'Added By',
        render: (_, order) => order.staff_member.name,
      },
      {
        title: 'Total',
        render: (_, order) => order.total,
      },
      {
        title: 'Discount',
        render: (_, order) => order.discount,
      },
      {
        title: 'No. of products',
        render: (_, order) => order.items.length,
      },
      {
        title: 'Date',
        render: (_, order) => dayjs(order.order_date).format('DD/MM/YYYY'),
      },
      {
        title: 'Actions',
        render: (_, order) => (
          <Button
            type="primary"
            shape="circle"
            icon={<EditFilled />}
            onClick={() => onEdit(order)}
          />
        ),
      },
    ],
    [onEdit],
  );

  return (
    <>
      <div className="mb-4">
        <Typography.Title level={4}>Orders</Typography.Title>
      </div>
      <Table
        dataSource={ordersData}
        columns={columns as TableColumnsType<any>}
        bordered
        rowKey="id"
      />
    </>
  );
};

export default Orders;
