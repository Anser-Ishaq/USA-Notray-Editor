import { Table, TableColumnType, Typography } from 'antd';

import { useProductQuery } from '@/service/product';
import { Product } from '@/types';

const columns: TableColumnType<Product>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
];

const Products = () => {
  const { products, isLoading } = useProductQuery();
  return (
    <>
      <div className="mb-4">
        <Typography.Title level={4}>Products</Typography.Title>
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={products}
        rowKey="id"
      />
    </>
  );
};

export default Products;
