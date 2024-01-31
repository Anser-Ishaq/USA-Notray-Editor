import {
  Button,
  Form,
  FormInstance,
  Image,
  Input,
  InputRef,
  Select,
  Table,
  Typography,
} from 'antd';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IOrderItem } from '@/types';
import APP_ROUTES from '@/utils/routes';
import { orderItemsData, productsData } from '@/utils/static';

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const defaultColumns: (ColumnTypes[number] & {
  editable?: boolean;
  dataIndex?: string;
})[] = [
  {
    title: 'ID',
    render: (_, order) => order.xid,
  },
  {
    title: '',
    render: (_, order) => (
      <Image src={order.image_url} width={50} height={50} />
    ),
  },
  {
    title: 'Product Name',
    render: (_, order) => order.name,
  },
  {
    title: 'Unit Price',
    dataIndex: 'unit_price',
    editable: true,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    editable: true,
  },
  {
    title: 'Discount',
    render: (_, order) => order.total_discount,
  },
];

const EditableContext = createContext<FormInstance<any> | null>(null);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof IOrderItem;
  record: IOrderItem;
  handleSave: (record: IOrderItem) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index: _idx, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditOrder = () => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<IOrderItem[]>(orderItemsData);

  const handleSave = (row: IOrderItem) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.xid === item.xid);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IOrderItem) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const onProductAdd = (productId: string) => {
    const product = productsData.find((p) => p.xid === productId)!;
    const orderProduct: IOrderItem = {
      sn: dataSource?.length,
      xid: Math.random().toString(),
      item_id: product.xid,
      name: product.name,
      image: product.image ?? '',
      image_url: product.image_url,
      x_tax_id: '',
      discount_rate: 0,
      total_discount: 0,
      total_tax: 0,
      unit_price: product.details.sales_price,
      single_unit_price: product.details.sales_price,
      subtotal: product.details.sales_price,
      quantity: 1,
      tax_rate: 0,
      tax_type: 'exclusive',
      x_unit_id: product.x_unit_id,
      unit: {
        company_id: 1,
        operator: 'multiply',
        operator_value: '1',
        is_deletable: 0,
        ...product.unit,
      },
      stock_quantity: product.details.current_stock,
      unit_short_name: 'pc',
    };
    setDataSource((prev) => [...prev, orderProduct]);
  };

  const onSave = () => {
    navigate(APP_ROUTES.ORDERS);
  };

  return (
    <>
      <div className="mb-4">
        <Typography.Title level={4}>Edit Order</Typography.Title>
      </div>
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())
        }
        placeholder="Add product"
        className="w-1/3 mb-5"
        options={productsData.map((p) => ({ label: p.name, value: p.xid }))}
        onChange={onProductAdd}
      />
      <Table
        bordered
        components={components}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        rowKey="id"
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Typography.Title level={5}>Total</Typography.Title>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2} />
              <Table.Summary.Cell index={3} />
              <Table.Summary.Cell index={4} />
              <Table.Summary.Cell index={5}>
                <Typography.Title level={5}>
                  {dataSource?.reduce(
                    (o, acc) => +acc.unit_price * +acc.quantity + o,
                    0,
                  )}
                </Typography.Title>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      <Button type="primary" onClick={onSave}>
        Save
      </Button>
    </>
  );
};

export default EditOrder;
