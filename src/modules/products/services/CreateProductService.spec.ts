import AppError from '@shared/errors/AppError';
import FakeProductRepository from '../repositories/fakes/FakeProductRepository';
import CreateProductService from './CreateProductService';

let fakeProductRepository: FakeProductRepository;
let createProductService: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    createProductService = new CreateProductService(fakeProductRepository);
  });

  it('Should be able to create a new product', async () => {
    const product = await createProductService.execute({
      name: 'Panettone 500gr',
      price: 18.5,
      quantity: 500,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toEqual('Panettone 500gr');
    expect(product.price).toEqual(18.5);
    expect(product.quantity).toEqual(500);
  });

  it('Should not be able to create two products with the same name', async () => {
    await createProductService.execute({
      name: 'Panettone 500gr',
      price: 18.5,
      quantity: 500,
    });

    await expect(
      createProductService.execute({
        name: 'Panettone 500gr',
        price: 18.5,
        quantity: 500,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
