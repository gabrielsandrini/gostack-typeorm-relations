import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface ICreateOrderProduct {
  product_id: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const productsFound = await this.productsRepository.findAllById(products);

    const hasInvalidProducts = productsFound.filter(product => !product);

    if (hasInvalidProducts.length > 0 || productsFound.length === 0) {
      throw new AppError('One of the products does not exist');
    }

    const parsedProductsToUpdateQuantity = products.map(receivedProduct => {
      const foundProduct = productsFound.find(
        p => p.id === receivedProduct.id,
      ) as Product;

      if (receivedProduct.quantity > foundProduct.quantity) {
        throw new AppError(`Out of stock for ${foundProduct.name}`);
      }

      return {
        id: receivedProduct.id,
        quantity: foundProduct.quantity - receivedProduct.quantity,
      };
    });

    const parsedProductsToCreateOrder = products.map(receivedProduct => {
      const foundProduct = productsFound.find(
        p => p.id === receivedProduct.id,
      ) as Product;

      return {
        product_id: receivedProduct.id,
        quantity: receivedProduct.quantity,
        price: foundProduct.price,
      };
    });

    await this.productsRepository.updateQuantity(
      parsedProductsToUpdateQuantity,
    );

    const order = await this.ordersRepository.create({
      products: parsedProductsToCreateOrder,
      customer,
    });

    return order;
  }
}

export default CreateOrderService;
