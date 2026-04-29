import { Api } from './components/base/Api'
import { EventEmitter, EventEnum } from './components/base/Events'
import { Basket } from './components/models/basket'
import { Catalog } from './components/models/catalog'
import { EndUser } from './components/models/enduser'
import { ServerAPI } from './components/models/serverapi'
import { BasketForm } from './components/views/BasketForm'
import { CardBasket } from './components/views/CardBasket'
import { CardCatalog } from './components/views/CardCatalog'
import { CardPreview } from './components/views/CardPreview'
import { ContactsForm } from './components/views/ContactsForm'
import { Gallery } from './components/views/Gallery'
import { Header } from './components/views/Header'
import { ModalWindow } from './components/views/ModalWindow'
import { OrderForm } from './components/views/OrderForm'
import { PreviewForm } from './components/views/PreviewForm'
import { SuccessForm } from './components/views/SuccsesForm'
import './scss/styles.scss'
import { IItem } from './types'
import { API_URL, CDN_URL } from './utils/constants'
import { cloneTemplate, ensureElement } from './utils/utils'

// const endUser = new EndUser()
// endUser.saveUserData({
//   address: 'Spb Vosstania 1',
//   payment: 'card',
//   email: 'test@test.ru',
//   phone: '+71234567890',
// })
// console.log(`User ${JSON.stringify(endUser.getUserData(), null, 2)}`)
// endUser.saveUserData({ address: 'Ekt Vosstania 2', phone: '+78437654321' })
// console.log(`Change user ${JSON.stringify(endUser.getUserData(), null, 2)}`)
// endUser.clearUserData()
// console.log(`Clear user ${JSON.stringify(endUser.getUserData(), null, 2)}`)
// endUser.saveUserData({
//   address: 'Spb Vosstania 1',
//   payment: 'card',
//   email: 'test@test.ru',
//   phone: '+71234567890',
// })
// const endUser2 = new EndUser()
// endUser2.saveUserData({ address: 'test@test.ru' })
// const checkUser = endUser2.checkUserData()
// console.log(`Check user ${JSON.stringify(checkUser)}`)
// endUser2.saveUserData({ address: '' })
// console.log(`User with no data ${JSON.stringify(endUser2.getUserData())}`)

// const frontPage = new Catalog()
// frontPage.setItemsList(apiProducts.items)
// console.log(
//   `Массив из каталога ${JSON.stringify(frontPage.getItemList(), null, 2)}`,
// )
// const itemsFront = frontPage.getItemList()
// console.log(`Main storage ${JSON.stringify(itemsFront)}`)
// const item = frontPage.getItem('854cef69-976d-4c2a-a18c-2aa45046c390')
// console.log(
//   `Item 854cef69-976d-4c2a-a18c-2aa45046c390: ${JSON.stringify(item)}`,
// )
// console.log(
//   `Before selected item ${JSON.stringify(frontPage.getSelectedItem())}`,
// )
// if (item) frontPage.setSelectedItem(item)
// console.log(`Selected Item ${JSON.stringify(frontPage.getSelectedItem())}`)
// export const apiProducts2 = {
//   total: 10,
//   items: [
//     {
//       id: '854cef69-976d-4c2a-a18c-2aa45046c390',
//       description: 'Если планируете решать задачи в тренажёре, берите два.',
//       image: '/5_Dots.svg',
//       title: '+1 час в сутках',
//       category: 'софт-скил',
//       price: 750,
//     },
//     {
//       id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
//       description:
//         'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
//       image: '/Shell.svg',
//       title: 'HEX-леденец',
//       category: 'другое',
//       price: 1450,
//     },
//   ],
// }
// frontPage.setItemsList(apiProducts2.items)
// const itemsFront2 = frontPage.getItemList()
// console.log(`Main storage new ${JSON.stringify(itemsFront2)}`)

// const frontPage2 = new Catalog()
// frontPage2.setItemsList(apiProducts.items)
// const basket = new Basket()
// const firstItem = frontPage2.getItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7')
// if (firstItem) {
//   basket.addItem(firstItem)
// } else {
//   console.log('Item is nullish')
// }
// const secondItem = frontPage2.getItem('b06cde61-912f-4663-9751-09956c0eed67')
// if (secondItem) {
//   basket.addItem(secondItem)
// }
// const items = basket.getItemsList()
// console.log(`Basket ${JSON.stringify(items, null, 2)}`)
// const itemsCount = basket.itemsCount()
// console.log(`Items count ${itemsCount}`)
// const itemsAmount = basket.itemsAmount()
// console.log(`Items amount ${itemsAmount}`)

// if (firstItem) {
//   const isInBasket = basket.checkIfItemInList(firstItem.id)
//   console.log(`Item ${firstItem.id} is in basket: ${isInBasket}`)
// }
// if (firstItem) {
//   basket.removeItem(firstItem)
//   console.log(`Basket items removal ${JSON.stringify(basket.getItemsList())}`)
// }
// basket.clearBasket()
// console.log(`Clear basket ${basket.getItemsList()}`)
// if (basket.getItemsList().length === 0) {
//   console.log('Basket is empty')
// } else {
//   console.log(`Basket is not empty ${basket.getItemsList()}`)
// }

// const basket2 = new Basket()
// const item1 = frontPage.getItem('854cef69-976d-4c2a-a18c-2aa45046c390')
// if (item1) {
//   basket2.addItem(item1)
// }
// const item2 = frontPage.getItem('c101ab44-ed99-4a54-990d-47aa2bb4e7d9')
// if (item2) {
//   basket2.addItem(item2)
// }
// endUser.saveUserData({ payment: 'cash' })
// serverAPI
//   .postOrder({
//     ...endUser.getUserData(),
//     total: basket2.itemsAmount(),
//     items: basket2.getItemsList().map((item) => item.id),
//   })
//   .then((result) => {
//     console.log(`Result for order: ${JSON.stringify(result)}`)
//   })
//   .catch((error) => {
//     console.error(`Post Order error ${error}`)
//   })

export class Presenter {
  private headerView: Header
  private galleryView: Gallery
  private basket: Basket
  private endUserPresenter: EndUser

  constructor() {
    const events = new EventEmitter()
    const header = ensureElement<HTMLElement>('.header__container')
    const gallery = ensureElement<HTMLElement>('.gallery')
    const catalog = new Catalog(events)
    const api = new Api(API_URL)
    const serverAPI = new ServerAPI(api)
    const modal = ensureElement<HTMLDivElement>('#modal-container')
    const modalWindow = new ModalWindow(events, modal)

    this.basket = new Basket()
    this.endUserPresenter = new EndUser()
    this.headerView = new Header(events, header)
    this.galleryView = new Gallery(events, gallery)

    events.on(EventEnum.CatalogLoaded, () => {
      this.galleryView.catalog = catalog.getItemList().map((item) => {
        const cardTemplate = cloneTemplate('#card-catalog')
        return new CardCatalog(cardTemplate, {
          onClick: () => events.emit(EventEnum.CardOpen, item),
        }).render({
          category: item.category,
          title: item.title,
          price: String(item.price),
          image: CDN_URL + item.image,
        })
      })
    })
    events.on(EventEnum.CardOpen, (itemData) => {
      const itemTemplate = cloneTemplate('#card-preview')
      const cardPreview = new CardPreview(itemTemplate, events, {
        onClick: () => {
          modalWindow.content = ''
          events.emit(EventEnum.ProductBuy, itemData)
        },
      })
      const itemForm = new PreviewForm(
        cardPreview.render({
          title: (itemData as IItem).title,
          price: String((itemData as IItem).price),
          category: (itemData as IItem).category,
          image: CDN_URL + (itemData as IItem).image,
          description: (itemData as IItem).description,
        }),
      )
      modalWindow.content = itemForm.render()
      modalWindow.render()
      modal.classList.add('modal_active')
    })
    events.on(EventEnum.ProductBuy, (itemData) => {
      this.basket.addItem(itemData as IItem)
      modal.classList.remove('modal_active')
      modalWindow.render({ content: undefined })
      this.headerView.counter = this.basket.itemsCount()
    })
    events.on(EventEnum.BasketOpen, () => {
      const basketTemplate = cloneTemplate('#basket')
      const basketForm = new BasketForm(events, basketTemplate, {
        onClick: () => {
          modalWindow.content = ''
          events.emit(EventEnum.OrderStart, this.basket.getItemsList())
        },
      })
      modalWindow.content = basketForm.render({
        basket: this.basket.getItemsList().map((item, index) => {
          const cardTemplate = cloneTemplate('#card-basket')
          const cardBasket = new CardBasket(events, cardTemplate, {
            onClick: () =>
              events.emit(EventEnum.ProductRemove, { index: index }),
          })
          const htmlBacket = cardBasket.render({
            index: String(index + 1),
            title: item.title,
            price: String(item.price),
          })
          return htmlBacket
        }),
        total: this.basket.itemsAmount(),
      })
      modalWindow.render()
      modal.classList.add('modal_active')
    })

    events.on(EventEnum.OrderStart, () => {
      const orderTemplate = cloneTemplate('#order')
      const fields = ['payment', 'address']
      const actions = {
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault()
          modalWindow.content = ''
          events.emit(EventEnum.OrderContinue)
        },
        onCash: () => {
          this.endUserPresenter.saveUserData({ payment: 'cash' })
          orderForm.chooseCash()
          if (this.validateInput(fields)) orderForm.enableSubmit()
        },
        onCard: () => {
          this.endUserPresenter.saveUserData({ payment: 'card' })
          orderForm.chooseCard()
          if (this.validateInput(fields)) orderForm.enableSubmit()
        },
        onEdit: (address: string) => {
          this.endUserPresenter.saveUserData({ address: address })
          if (this.validateInput(fields)) orderForm.enableSubmit()
        },
      }
      const orderForm = new OrderForm(events, orderTemplate, actions)
      modalWindow.content = orderForm.render()
    })
    events.on(EventEnum.OrderContinue, () => {
      const contactsTemplate = cloneTemplate('#contacts')
      const fields = ['email', 'phone']
      const actions = {
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault()
          modalWindow.content = ''
          events.emit(EventEnum.OrderFinish)
        },
        onEdit: (fieldName: string, value: string) => {
          if (fieldName === 'email') {
            this.endUserPresenter.saveUserData({ email: value })
          }
          if (fieldName === 'phone') {
            this.endUserPresenter.saveUserData({ phone: value })
          }
          if (this.validateInput(fields)) contactsForm.enableSubmit()
        },
      }
      const contactsForm = new ContactsForm(events, contactsTemplate, actions)
      modalWindow.content = contactsForm.render()
    })

    events.on(EventEnum.OrderFinish, () => {
      const success = cloneTemplate('#success')
      const successForm = new SuccessForm(events, success)
      modalWindow.content = successForm.render({
        finalAmount: this.basket.itemsAmount(),
      })
    })

    events.on(EventEnum.ProductRemove, (item: { index: number }) => {
      const currentList = this.basket.getItemsList()
      console.log('Removing item ', currentList[item.index])
      this.basket.removeItem(currentList[item.index])
      this.headerView.counter = this.basket.itemsCount()
      const basketTemplate = cloneTemplate('#basket')
      const basketForm = new BasketForm(events, basketTemplate, {
        onClick: () =>
          events.emit(EventEnum.OrderStart, this.basket.getItemsList()),
      })
      modalWindow.content = ''
      modalWindow.content = basketForm.render({
        basket: this.basket.getItemsList().map((item, index) => {
          const cardTemplate = cloneTemplate('#card-basket')
          const cardBasket = new CardBasket(events, cardTemplate, {
            onClick: () =>
              events.emit(EventEnum.ProductRemove, { index: index }),
          })
          const htmlBacket = cardBasket.render({
            index: String(index + 1),
            title: item.title,
            price: String(item.price),
          })
          return htmlBacket
        }),
        total: this.basket.itemsAmount(),
      })
    })

    serverAPI
      .getProductList()
      .then((result) => {
        if (result && result.items) {
          try {
            catalog.setItemsList(result.items)
          } catch (parsingError) {
            console.error(`Has parsing error ${parsingError}`)
          }
        } else {
          console.error('No valuable data')
        }
      })
      .catch((error) => {
        console.error(`Server failed ${error}`)
      })
    events.on(EventEnum.ModalClose, () => {
      modal.classList.remove('modal_active')
      modalWindow.render({ content: undefined })
    })
    events.on(EventEnum.BasketEmpty, () => {
      this.basket.clearBasket()
    })
  }

  init(): void {
    this.headerView.render()
    this.galleryView.render()
  }

  private validateInput(fields: string[]) {
    const error = this.endUserPresenter.checkUserData()
    const isError = fields.some((field) => field in error)

    if (isError) return false
    return true
  }
}

const presenter = new Presenter()
presenter.init()
