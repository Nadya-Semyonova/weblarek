import { IApi } from "../../types";
import { IProduct, IOrderRequest, IOrderResponse } from "../../types";

export class WebLarekAPI {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // GET /product - возвращает IProduct[] через IProductListResponse
  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<{ items: IProduct[] }>("/product");
      return response.items;
    } catch (error) {
      console.error("Ошибка при получении списка товаров:", error);
      throw error;
    }
  }

  async sendOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>("/order", orderData);
  }
}
