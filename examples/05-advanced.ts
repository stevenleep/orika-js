import { MapperFactory, createMapperBuilder } from '../src';

const factory = MapperFactory.getInstance();
factory.enableStatistics(true);

class Order {
  orderId: string;
  items: { name: string; price: number }[];
  status: 'pending' | 'paid' | 'shipped';
  
  constructor() {
    this.orderId = '';
    this.items = [];
    this.status = 'pending';
  }
}

class OrderDTO {
  orderId: string;
  itemCount: number;
  total: number;
  statusText: string;
  
  constructor() {
    this.orderId = '';
    this.itemCount = 0;
    this.total = 0;
    this.statusText = '';
  }
}

const statusMap: Record<string, string> = {
  pending: 'Pending Payment',
  paid: 'Paid',
  shipped: 'Shipped'
};

createMapperBuilder<Order, OrderDTO>()
  .from(Order)
  .to(OrderDTO)
  .mapField('orderId', 'orderId')
  .forMember('itemCount', (s) => s.items.length)
  .forMember('total', (s) => s.items.reduce((sum, item) => sum + item.price, 0))
  .forMember('statusText', (s) => statusMap[s.status])
  .register();

const order = new Order();
order.orderId = 'ORD-001';
order.items = [
  { name: 'Book', price: 29.99 },
  { name: 'Pen', price: 9.99 }
];
order.status = 'paid';

const dto = factory.map(order, Order, OrderDTO);
console.log('Order:', order);
console.log('DTO:', dto);

const stats = factory.getStats(Order, OrderDTO);
console.log('Stats:', {
  totalMappings: stats.totalMappings,
  avgTime: stats.averageTime.toFixed(3) + 'ms'
});

