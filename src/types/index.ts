export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface Rating {
  rate: number;
  count: number;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface IOrderItem {
  sn: number;
  xid: string;
  item_id: string;
  name: string;
  image: string;
  image_url: string;
  x_tax_id: string;
  discount_rate: number;
  total_discount: number;
  total_tax: number;
  unit_price: number;
  single_unit_price: number;
  subtotal: number;
  quantity: number;
  tax_rate: number;
  tax_type: string;
  x_unit_id: string;
  unit: IUnit;
  stock_quantity: number;
  unit_short_name: string;
}

export interface IUnit {
  company_id: number;
  name: string;
  short_name: string;
  base_unit?: any;
  operator: string;
  operator_value: string;
  is_deletable: number;
  created_at?: any;
  updated_at?: any;
  xid: string;
}

export interface IOrder {
  unique_id: string;
  invoice_number: string;
  order_type: string;
  order_date: string;
  tax_amount: number;
  discount: number;
  shipping: number;
  subtotal: number;
  paid_amount: number;
  due_amount: number;
  order_status: string;
  payment_status: string;
  total: number;
  tax_rate: number;
  cancelled: number;
  terms_condition?: any;
  xid: string;
  x_warehouse_id: string;
  x_from_warehouse_id?: any;
  x_staff_user_id: string;
  x_user_id: string;
  warehouse: Warehouse;
  from_warehouse?: any;
  staff_member: Staffmember;
  user: User;
  order_payments: Orderpayment[];
  items: Item[];
  shipping_address?: any;
}

interface Item {
  single_unit_price: number;
  unit_price: number;
  quantity: number;
  tax_rate: number;
  total_tax: number;
  tax_type: string;
  total_discount: number;
  subtotal: number;
  xid: string;
  x_product_id: string;
  product: OrderProduct;
  order_item_taxes: any[];
}

interface OrderProduct {
  name: string;
  image: string;
  xid: string;
  x_unit_id: string;
  image_url: string;
  unit: Unit;
  details: ProductDetails;
}

interface ProductDetails {
  current_stock: number;
  xid: string;
  x_warehouse_id: string;
  x_product_id: string;
  x_tax_id?: string;
}

interface Unit {
  name: string;
  short_name: string;
  xid: string;
}

interface Orderpayment {
  amount: number;
  xid: string;
  x_payment_id: string;
  payment: Payment;
}

interface Payment {
  amount: number;
  date: string;
  notes?: any;
  xid: string;
  x_payment_mode_id: string;
  payment_mode: OrderWarehouse;
}

interface User {
  user_type: string;
  name: string;
  profile_image?: any;
  phone: string;
  xid: string;
  profile_image_url: string;
}

interface Staffmember {
  name: string;
  profile_image?: any;
  user_type: string;
  xid: string;
  profile_image_url: string;
}

interface OrderWarehouse {
  name: string;
  xid: string;
}
export interface IProduct {
  name: string;
  slug: string;
  product_type: string;
  barcode_symbology: string;
  item_code: string;
  image?: any;
  description?: any;
  xid: string;
  image_url: string;
  x_category_id: string;
  x_brand_id: string;
  x_unit_id: string;
  x_warehouse_id: string;
  category: Category;
  brand: Category;
  unit: Unit;
  details: Details;
  custom_fields: any[];
  warehouse: Warehouse2;
}

interface Warehouse2 {
  xid: string;
}

interface Details {
  stock_quantitiy_alert: number;
  opening_stock: number;
  opening_stock_date?: any;
  wholesale_price?: any;
  wholesale_quantity?: any;
  mrp: number;
  purchase_price: number;
  sales_price: number;
  purchase_tax_type: string;
  sales_tax_type: string;
  current_stock: number;
  status: string;
  x_warehouse_id: string;
  x_tax_id: string;
  tax: Tax;
  warehouse: Warehouse;
}

interface Warehouse {
  name: string;
  xid: string;
  x_company_id?: any;
  logo_url: string;
  dark_logo_url: string;
  signature_url?: any;
}

interface Tax {
  name: string;
  rate: number;
  xid: string;
  x_parent_id?: any;
}

interface Category {
  name: string;
  xid: string;
}
