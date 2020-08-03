import FakeCustomerRepository from '@modules/customers/repositories/fakes/FakeCustomerRepository';
import AppError from '@shared/errors/AppError';
import CreateCustomerService from './CreateCustomerService';

let createCustomerService: CreateCustomerService;
let fakeCustomerRepository: FakeCustomerRepository;

describe('CreateCostumer', () => {
  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepository();
    createCustomerService = new CreateCustomerService(fakeCustomerRepository);
  });

  it('Should be able to create a customer', async () => {
    const name = 'Gabriel';
    const email = 'gabriel@email.com';

    const customer = await createCustomerService.execute({
      name,
      email,
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe(name);
    expect(customer.email).toBe(email);
  });

  it('Should not be able to create two customers with the same e-mail', async () => {
    await createCustomerService.execute({
      name: 'userName',
      email: 'user@email.com',
    });

    await expect(
      createCustomerService.execute({
        name: 'userName',
        email: 'user@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
