import { v4 as uuid } from 'uuid';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create(data: ICreateProductDTO): Promise<Product> {
    const product = new Product();
    Object.assign(product, { id: uuid() }, data);

    this.products.push(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.products.find(product => product.name === name);
  }

  public async findAllById(
    productsToFind: IFindProducts[],
  ): Promise<Product[]> {
    const findById = (id: string): Product | undefined => {
      return this.products.find(product => product.id === id);
    };

    const foundProducts: Product[] = [];

    productsToFind.forEach(productToFind => {
      const product = findById(productToFind.id);

      if (product) {
        foundProducts.push(product);
      }
    });

    return foundProducts;
  }

  public async updateQuantity(
    updateProductQuantity: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const updatedProducts: Product[] = [];

    updateProductQuantity.forEach(updateQty => {
      const index = this.products.findIndex(
        product => product.id === updateQty.id,
      );

      this.products[index].quantity = updateQty.quantity;

      updatedProducts.push(this.products[index]);
    });

    return updatedProducts;
  }
}

export default ProductsRepository;
