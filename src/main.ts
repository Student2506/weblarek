import './scss/styles.scss'
import { API } from './types/api'
import { Basket } from './types/basket'
import { EndUser } from './types/enduser'
import { FrontPage } from './types/frontpage'
import { Order } from './types/order'
import { ServerAPI } from './types/serverapi'
import { API_URL } from './utils/constants'
import { apiProducts } from './utils/data'

const endUser = new EndUser()
endUser.address = 'Spb Vosstania 1'
endUser.email = 'test@test.ru'
endUser.payment = 'card'
endUser.phone = '+71234567890'
endUser.orders = []
console.log(`End User ${JSON.stringify(endUser, null, 2)}`)

const frontPage = new FrontPage(apiProducts.items)
console.log(
  `Массив из каталога ${JSON.stringify(frontPage.itemsList, null, 2)}`,
)

const basket = new Basket()
const firstItem = frontPage.getItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7')
if (firstItem) {
  basket.addItem(firstItem)
}
const items = basket.getItemsList()
console.log(`Basket ${JSON.stringify(items, null, 2)}`)

const api = new API()
const serverAPI = new ServerAPI(API_URL, api)
serverAPI.getProductList().then((result) => {
  // frontPage = new FrontPage(result.data);
  console.log(`Raw data for product list ${result.data}`)
  if (result.data) {
    const front = new FrontPage(JSON.parse(result.data))
    console.log(`Response for Product list ${front.itemsList}`)
  }
})

serverAPI
  .getProductItem('854cef69-976d-4c2a-a18c-2aa45046c390')
  .then((result) => {
    console.log(`Response for Product Item ${result.data}`)
    if (result.data) {
      console.log(`Data for product Item ${JSON.parse(result.data)}`)
    }
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
const order = new Order(basket, endUser)
console.log(`Request order: ${JSON.stringify(order)}`)
serverAPI.postOrder(order).then((result) => {
  console.log(`Result for order: ${JSON.stringify(result)}`)
})
