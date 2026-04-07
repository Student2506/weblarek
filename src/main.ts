import './scss/styles.scss';
import { Basket } from './types/basket';
import { EndUser } from './types/enduser';
import { FrontPage } from './types/frontpage';
import { Item } from './types/item';
import { Order } from './types/order';
import { apiProducts } from './utils/data';

let endUser = new EndUser();
endUser.address = 'Novy Arbat 24';
endUser.email = 'some@exampl.com';
endUser.payment = 'cash';
endUser.phone = '+74951111111';
endUser.orders = [];
console.log(`End User ${JSON.stringify(endUser, null, 2)}`);


let item = new Item(
  "007",
  "some useful stuff",
  "/photo.jpg",
  "The Stuff",
  "Books",
  100.0,
);

let order = new Order([item,], endUser);

let frontPage = new FrontPage(apiProducts.items);
console.log(`Массив из каталога ${JSON.stringify(frontPage.itemsList, null, 2)}`);

let basket = new Basket();
const firstItem = frontPage.getItem("412bcf81-7e75-4e70-bdb9-d3c73c9803b7");
if (firstItem){
  basket.addItem(firstItem);
}
const items = basket.getItemsList();
console.log(`Basket ${JSON.stringify(items, null, 2)}`);

