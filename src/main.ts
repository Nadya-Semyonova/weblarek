import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { WebLarekAPI } from "./components/WebLarekAPI/WebLarekAPI";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";

const cartModel = new Cart();
const buyerModel = new Buyer();
const productsModel = new Products();
const api = new Api(API_URL);
const larekApi = new WebLarekAPI(api);

// проверка методов локально

productsModel.setItems(apiProducts.items);
console.log(`Массив товаров из каталога: `, productsModel.getItems());
const productById = productsModel.getItemById(
  "854cef69-976d-4c2a-a18c-2aa45046c390"
);
console.log("Найденный товар:", productById);

//  Добавление товаров в корзину

const product1 = productsModel.getItemById(
  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
);
const product2 = productsModel.getItemById(
  "854cef69-976d-4c2a-a18c-2aa45046c390"
);
const product3 = productsModel.getItemById(
  "b06cde61-912f-4663-9751-09956c0eed67"
);

if (product1) cartModel.addToCart(product1);
if (product2) cartModel.addToCart(product2);
if (product3) cartModel.addToCart(product3);
if (product1) cartModel.addToCart(product1); // Добавляем дубликат

console.log("Товары добавлены в корзину");

// Тест 2: Получение товаров из корзины
const cartItems = cartModel.getCartItems();
console.log("Товары в корзине:", cartItems);

// Тест 3: Получение количества товаров
const itemsCount = cartModel.getItemsCount();
console.log("Количество товаров:", itemsCount);

// Тест 4: Получение общей стоимости
const totalPrice = cartModel.getTotalPrice();
console.log("Общая стоимость:", totalPrice);

// Тест 5: Проверка наличия товара
console.log(
  'Товар с ID "b06cde61-912f-4663-9751-09956c0eed67" в корзине:',
  cartModel.isInCart("b06cde61-912f-4663-9751-09956c0eed67")
);

// Тест 6: Удаление товара

cartModel.removeFromCart("b06cde61-912f-4663-9751-09956c0eed67");
console.log("Количество после удаления:", cartModel.getItemsCount());
console.log(
  'Товар с ID "b06cde61-912f-4663-9751-09956c0eed67" в корзине:',
  cartModel.isInCart("b06cde61-912f-4663-9751-09956c0eed67")
);

// Тест 7: Очистка корзины

cartModel.clearCart();
console.log("Количество после очистки:", cartModel.getItemsCount());

// Тест 1: Сохранение данных покупателя

buyerModel.setBuyerData({
  payment: "card",
  address: "ул. Примерная, д. 123, кв. 45",
  phone: "+7 (999) 123-45-67",
  email: "test@example.ru",
});
console.log("Данные покупателя сохранены");

// Тест 2: Получение данных покупателя

const buyerData = buyerModel.getBuyerData();
console.log("Данные покупателя:", buyerData);

// Тест 3: Валидация данных

const isValid = buyerModel.validate();
console.log("Данные валидны:", isValid);

// Тест 4: Тестирование с неполными данными

const incompleteBuyer = new Buyer();
incompleteBuyer.setBuyerData({
  payment: "card",
  email: "test@test.ru",
  // address и phone не заполнены
});
console.log("Данные валидны:", incompleteBuyer.validate());
console.log("Данные покупателя:", incompleteBuyer.getBuyerData()); // Должен вернуть null

// Тест 5: Очистка данных

buyerModel.clearData();
console.log("Данные после очистки:", buyerModel.getBuyerData());

// проверка методов с сервером
// Получение списка товаров

larekApi
  .getProductList()
  .then((products) => {
    console.log("Получено товаров с сервера:", products.length);

    //         // Сохраняем в модель
    productsModel.setItems(products);
    console.log("Каталог сохранён в ProductsModel");

    //         // Проверяем содержимое модели
    const storedProducts = productsModel.getItems();
    console.log("Товары в каталоге после загрузки:", storedProducts);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке товаров:", err);
  });
