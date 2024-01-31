import { ColumnType } from 'rc-table';

import AsyncTable from '@/components/ui/AsyncTable';
import { useProductQuery } from '@/service/product';
import { Product } from '@/types';

const columns: ColumnType<Product>[] = [
  {
    title: 'ID',
    className: 'cursor-pointer',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    className: 'cursor-pointer',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Price',
    className: 'cursor-pointer',
    dataIndex: 'price',
    key: 'price',
  },
];

const Products = () => {
  const { products, isLoading } = useProductQuery();
  return (
    <>
      <AsyncTable<Product>
        isLoading={isLoading}
        columns={columns}
        data={products}
        rowKey="id"
      />
    </>
  );
};

export default Products;
