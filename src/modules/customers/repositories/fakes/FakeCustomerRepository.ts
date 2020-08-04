import { v4 as uuid } from 'uuid';
import ICustomersRepository from '../ICustomersRepository';
import ICreateCustomerDTO from '../../dtos/ICreateCustomerDTO';
import Customer from '../../infra/typeorm/entities/Customer';

export default class FakeCustomerRepository implements ICustomersRepository {
  private costumers: Customer[] = [];

  async create(data: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, { id: uuid() }, data);

    this.costumers.push(customer);

    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    const customerFound = this.costumers.find(
      customer => customer.email === email,
    );

    return customerFound;
  }

  async findById(id: string): Promise<Customer | undefined> {
    const customerFound = this.costumers.find(customer => customer.id === id);

    return customerFound;
  }
}
