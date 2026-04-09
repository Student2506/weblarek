import './scss/styles.scss'
import { Basket } from './components/models/basket'
import { EndUser } from './components/models/enduser'
import { Catalog } from './components/models/catalog'
import { Order } from './types/order'
import { ServerAPI } from './components/models/serverapi'
import { API_URL } from './utils/constants'
import { apiProducts } from './utils/data'
import { Api } from './components/base/Api'

const endUser = new EndUser()
endUser.saveUserData({
  address: 'Spb Vosstania 1',
  payment: 'card',
  email: 'test@test.ru',
  phone: '+71234567890',
})
console.log(`User ${JSON.stringify(endUser.getUserData(), null, 2)}`)
endUser.saveUserData({address: 'Ekt Vosstania 2', phone: '+78437654321'})
console.log(`Change user ${JSON.stringify(endUser.getUserData(), null, 2)}`)
endUser.clearUserData()
console.log(`Clear user ${JSON.stringify(endUser.getUserData(), null, 2)}`)
endUser.saveUserData({address: 'Spb Vosstania 1', payment: 'card', email: 'test@test.ru', phone: '+71234567890'})
const endUser2 = new EndUser()
endUser2.saveUserData({address: 'test@test.ru'})
const checkUser = endUser2.checkUserData()
console.log(`Check user ${JSON.stringify(checkUser)}`)
endUser2.saveUserData({address: ""})
console.log(`User with no data ${JSON.stringify(endUser2.getUserData())}`)

const frontPage = new Catalog()
frontPage.loadItemsList(apiProducts.items)
console.log(
  `Массив из каталога ${JSON.stringify(frontPage.getItemList(), null, 2)}`,
)
const itemsFront = frontPage.getItemList()
console.log(`Main storage ${JSON.stringify(itemsFront)}`)
const item = frontPage.getItem('854cef69-976d-4c2a-a18c-2aa45046c390')
console.log(
  `Item 854cef69-976d-4c2a-a18c-2aa45046c390: ${JSON.stringify(item)}`,
)
console.log(
  `Before selected item ${JSON.stringify(frontPage.getSelectedItem())}`,
)
if (item) frontPage.setSelectedItem(item)
console.log(`Selected Item ${JSON.stringify(frontPage.getSelectedItem())}`)
export const apiProducts2 = {
  total: 10,
  items: [
    {
      id: '854cef69-976d-4c2a-a18c-2aa45046c390',
      description: 'Если планируете решать задачи в тренажёре, берите два.',
      image: '/5_Dots.svg',
      title: '+1 час в сутках',
      category: 'софт-скил',
      price: 750,
    },
    {
      id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
      description:
        'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
      image: '/Shell.svg',
      title: 'HEX-леденец',
      category: 'другое',
      price: 1450,
    },
  ],
}
frontPage.loadItemsList(apiProducts2.items)
const itemsFront2 = frontPage.getItemList()
console.log(`Main storage new ${JSON.stringify(itemsFront2)}`)

const frontPage2 = new Catalog()
frontPage2.loadItemsList(apiProducts.items)
const basket = new Basket()
const firstItem = frontPage2.getItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7')
if (firstItem) {
  basket.addItem(firstItem)
} else {
  console.log('Item is nullish')
}
const secondItem = frontPage2.getItem('b06cde61-912f-4663-9751-09956c0eed67')
if (secondItem) {
  basket.addItem(secondItem)
}
const items = basket.getItemsList()
console.log(`Basket ${JSON.stringify(items, null, 2)}`)
const itemsCount = basket.itemsCount()
console.log(`Items count ${itemsCount}`)
const itemsAmount = basket.itemsAmount()
console.log(`Items amount ${itemsAmount}`)

if (firstItem) {
  const isInBasket = basket.checkIfItemInList(firstItem.id)
  console.log(`Item ${firstItem.id} is in basket: ${isInBasket}`)
}
if (firstItem) {
  basket.removeItem(firstItem)
  console.log(`Basket items removal ${JSON.stringify(basket.getItemsList())}`)
}
basket.clearBasket()
console.log(`Clear basket ${basket.getItemsList()}`)
if (basket.getItemsList().length === 0) {
  console.log('Basket is empty')
} else {
  console.log(`Basket is not empty ${basket.getItemsList()}`)
}

const api = new Api(API_URL)
const serverAPI = new ServerAPI(api)
serverAPI.getProductList().then((result) => {

  console.log(`Raw data for product list ${result}`)
  if (result && result.items) {
    try {
      const front = new Catalog()
      front.loadItemsList(result.items)
      console.log(`Response for Product list ${JSON.stringify(front.getItemList())}`)
    } catch (parsingError) {
      console.error(`Has parsing error ${parsingError}`)
    }
  } else {
    console.error('No valuable data');
  }
}).catch((error) => {
  console.error(`Server failed ${error}`)
})

const basket2 = new Basket()
const item1 = frontPage.getItem('854cef69-976d-4c2a-a18c-2aa45046c390')
if (item1) {
  basket2.addItem(item1)
}
const item2 = frontPage.getItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9')
if (item2) {
  basket2.addItem(item2)
}
const order = new Order(basket2, endUser.getUserData(), 'cash')
console.log(`Request order: ${JSON.stringify(order)}`)
serverAPI.postOrder(order).then((result) => {
  console.log(`Result for order: ${JSON.stringify(result)}`)
}).catch(error => {
  console.error(`Post Order error ${error}`)
})
