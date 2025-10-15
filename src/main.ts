import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { WebLarekAPI } from "./components/WebLarekAPI/WebLarekAPI";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { EventEmitter } from './components/base/Events';
import { Header } from "./components/views/Header";
import { Gallery } from './components/views/Gallery';
import { ModalView } from "./components/views/ModalView";
import { Presenter } from "./Presenter/Presenter";


// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', async () => {
  async function bootstrapApp() {
    // Инициализация моделей
    const cartModel = new Cart();
    const buyerModel = new Buyer();
    const productsModel = new Products();

    // Инициализация API
    const api = new Api(API_URL);
    const larekApi = new WebLarekAPI(api);

    // Инициализация событий
    const events = new EventEmitter();

    // Проверка и инициализация DOM компонентов
    const galleryElement = document.querySelector('.gallery');
    const headerElement = document.querySelector('.header__basket');
    const modalContainer = document.getElementById('modal-container');
    const pageContainer = document.querySelector('.page');

    if (!galleryElement) throw new Error('Element .gallery not found');
    if (!headerElement) throw new Error('Element .header__basket not found');
    if (!modalContainer) throw new Error('Element #modal-container not found');
    if (!pageContainer) throw new Error('Element .page not found');

    const gallery = new Gallery(galleryElement as HTMLElement);
    const header = new Header(events, headerElement as HTMLElement);
    const modal = new ModalView(modalContainer, events);


    // Создание презентера
    const presenter = new Presenter(
      events,
      productsModel,
      cartModel,
      buyerModel,
      larekApi,
      gallery,
      header,
      modal,
  
    );

    // ЗАГРУЗКА ДАННЫХ ЧЕРЕЗ PRESENTER
    try {
      await presenter.Products();
    } catch (error) {
      console.error('Не удалось загрузить товары, используем тестовые данные');
      
    }
    console.log('Приложение успешно запущено');
    return true;
  }

  // Запуск приложения
  try {
    await bootstrapApp();
  } catch (error) {
    console.error('Ошибка запуска приложения:', error);
  }
});