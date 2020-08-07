import Order from '@modules/orders/infra/typeorm/entities/Order';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import { v4 as uuid } from 'uuid';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import IOrdersRepository from '../IOrdersRepository';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  async create(data: ICreateOrderDTO): Promise<Order> {
    const order = new Order();
    const order_id = uuid();

    const order_products = data.products.map(productRequest => {
      const orderProduct = new OrdersProducts();

      Object.assign(orderProduct, {
        id: uuid(),
        product_id: productRequest.product_id,
        order_id,
        price: productRequest.price,
        quantity: productRequest.quantity,
      });

      return orderProduct;
    });

    Object.assign(order, {
      id: order_id,
      customer: data.customer,
      order_products,
    });

    this.orders.push(order);

    return order;
  }

  async findById(id: string): Promise<Order | undefined> {
    return this.orders.find(order => order.id === id);
  }
}

export default FakeOrdersRepository;
