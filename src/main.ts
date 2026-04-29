import { Api } from './components/base/Api'
import { EventEmitter, EventEnum } from './components/base/Events'
import { Basket } from './components/models/basket'
import { Catalog } from './components/models/catalog'
import { EndUser } from './components/models/enduser'
import { ServerAPI } from './components/models/serverapi'
import { CardBasket } from './components/views/CardBasket'
import { CardCatalog } from './components/views/CardCatalog'
import { CardPreview } from './components/views/CardPreview'
import { BasketForm } from './components/views/FormBasket'
import { ContactsForm } from './components/views/FormContacts'
import { OrderForm } from './components/views/FormOrder'
import { PreviewForm } from './components/views/FormPreview'
import { SuccessForm } from './components/views/FormSuccses'
import { Gallery } from './components/views/ViewGallery'
import { Header } from './components/views/ViewHeader'
import { ModalWindow } from './components/views/ViewModal'
import './scss/styles.scss'
import { IBuyer, IItem, ValidationErrors } from './types'
import { API_URL, CDN_URL } from './utils/constants'
import { cloneTemplate, ensureElement } from './utils/utils'

export class Presenter {
  private headerView: Header
  private galleryView: Gallery
  private basket: Basket
  private endUser: EndUser

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
    this.endUser = new EndUser()
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
      const actions = {
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault()
          modalWindow.content = ''
          events.emit(EventEnum.OrderContinue)
        },
        onCash: () => {
          this.endUser.saveUserData({ payment: 'cash' })
          orderForm.chooseCash()
          const errors = this.validateInput(['payment', 'address'])
          if (!errors.length) {
            orderForm.setError([])
            orderForm.enableSubmit()
          } else orderForm.setError(errors)
        },
        onCard: () => {
          this.endUser.saveUserData({ payment: 'card' })
          orderForm.chooseCard()
          const errors = this.validateInput(['payment', 'address'])
          if (!errors.length) {
            orderForm.setError([])
            orderForm.enableSubmit()
          } else orderForm.setError(errors)
        },
        onEdit: (address: string) => {
          this.endUser.saveUserData({ address: address })
          const errors = this.validateInput(['payment', 'address'])
          if (!errors.length) {
            orderForm.setError([])
            orderForm.enableSubmit()
          } else orderForm.setError(errors)
        },
      }
      const orderForm = new OrderForm(events, orderTemplate, actions)
      modalWindow.content = orderForm.render()
    })
    events.on(EventEnum.OrderContinue, () => {
      const contactsTemplate = cloneTemplate('#contacts')
      const actions = {
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault()
          modalWindow.content = ''
          events.emit(EventEnum.OrderFinish)
        },
        onEdit: (fieldName: string, value: string) => {
          if (fieldName === 'email') {
            this.endUser.saveUserData({ email: value })
          }
          if (fieldName === 'phone') {
            this.endUser.saveUserData({ phone: value })
          }
          const errors = this.validateInput(['phone', 'email'])
          if (!errors.length) {
            contactsForm.setError([])
            contactsForm.enableSubmit()
          } else contactsForm.setError(errors)
        },
      }
      const contactsForm = new ContactsForm(events, contactsTemplate, actions)
      modalWindow.content = contactsForm.render()
    })

    events.on(EventEnum.OrderFinish, () => {
      const success = cloneTemplate('#success')
      const successForm = new SuccessForm(events, success)
      serverAPI
        .postOrder({
          ...this.endUser.getUserData(),
          total: this.basket.itemsAmount(),
          items: this.basket.getItemsList().map((item) => item.id),
        })
        .then((result) => {
          console.log('Order success!')
          this.headerView.counter = 0
          modalWindow.content = successForm.render({
            finalAmount: result.total,
          })
        })
        .catch((error) => {
          console.error(`Post Order error ${error}`)
        })
    })

    events.on(EventEnum.ProductRemove, (item: { index: number }) => {
      const currentList = this.basket.getItemsList()
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

  private validateInput(fields: Array<keyof IBuyer>) {
    const errors: ValidationErrors = this.endUser.checkUserData()
    const targetErrors: Array<keyof IBuyer> = fields
    return targetErrors
      .map((field) => errors[field])
      .filter((value): value is string => typeof value === 'string')
  }
}

const presenter = new Presenter()
presenter.init()
