import { Api } from './components/base/Api'
import { EventEmitter, EventEnum } from './components/base/Events'
import { Basket } from './components/models/basket'
import { Catalog } from './components/models/catalog'
import { EndUser } from './components/models/enduser'
import { ServerAPI } from './components/models/serverapi'
import { CardBasket } from './components/views/CardBasket'
import { CardCatalog } from './components/views/CardCatalog'
import { CardPreview } from './components/views/CardPreview'
import { FormBasket } from './components/views/FormBasket'
import { FormContacts } from './components/views/FormContacts'
import { FormOrder } from './components/views/FormOrder'
import { FormPreview } from './components/views/FormPreview'
import { FormSuccess } from './components/views/FormSuccses'
import { ViewGallery } from './components/views/ViewGallery'
import { ViewHeader } from './components/views/ViewHeader'
import { ModalWindow } from './components/views/ViewModal'
import './scss/styles.scss'
import { IBuyer, IItem, ValidationErrors } from './types'
import { API_URL, CDN_URL } from './utils/constants'
import { cloneTemplate, ensureElement } from './utils/utils'

export class Presenter {
  private headerView: ViewHeader
  private galleryView: ViewGallery
  private basket: Basket
  private endUser: EndUser
  private modal: HTMLDivElement
  private modalWindow: ModalWindow
  private events: EventEmitter
  private header: HTMLElement
  private catalog: Catalog
  private gallery: HTMLElement
  private api: Api
  private serverAPI: ServerAPI

  constructor() {
    this.modal = ensureElement<HTMLDivElement>('#modal-container')
    this.header = ensureElement<HTMLElement>('.header__container')
    this.gallery = ensureElement<HTMLElement>('.gallery')

    this.events = new EventEmitter()
    this.basket = new Basket()
    this.endUser = new EndUser()

    this.headerView = new ViewHeader(this.events, this.header)
    this.modalWindow = new ModalWindow(this.events, this.modal)
    this.galleryView = new ViewGallery(this.events, this.gallery)

    this.api = new Api(API_URL)
    this.serverAPI = new ServerAPI(this.api)
    this.catalog = new Catalog(this.events)

    
    this.modal.addEventListener('click', () => this.modalClose)

    this.events.on(EventEnum.CatalogLoaded, () => {
      this.galleryView.catalog = this.catalog.getItemList().map((item) => {
        const cardTemplate = cloneTemplate('#card-catalog')
        return new CardCatalog(cardTemplate, {
          onClick: () => this.events.emit(EventEnum.CardOpen, item),
        }).render({
          category: item.category,
          title: item.title,
          price: String(item.price),
          image: CDN_URL + item.image,
        })
      })
    })
    this.events.on(EventEnum.CardOpen, (itemData) => {
      const itemTemplate = cloneTemplate('#card-preview')
      const cardPreview = new CardPreview(itemTemplate, this.events, {
        onClick: () => {
          this.modalClose()
          this.events.emit(EventEnum.ProductBuy, itemData)
        },
      })
      const itemForm = new FormPreview(
        cardPreview.render({
          title: (itemData as IItem).title,
          price: String((itemData as IItem).price),
          category: (itemData as IItem).category,
          image: CDN_URL + (itemData as IItem).image,
          description: (itemData as IItem).description,
        }),
      )
      this.modalOpen(itemForm.render())
    })
    this.events.on(EventEnum.ProductBuy, (itemData) => {
      this.basket.addItem(itemData as IItem)
      this.modalClose()
      this.headerView.counter = this.basket.itemsCount()
    })
    this.events.on(EventEnum.BasketOpen, () => {
      const basketTemplate = cloneTemplate('#basket')
      const basketForm = new FormBasket(this.events, basketTemplate, {
        onClick: () => {
          this.modalClose()
          this.events.emit(EventEnum.OrderStart, this.basket.getItemsList())
        },
      })
      basketForm.setButtonState(this.basket.itemsCount() === 0)
      this.modalOpen(
        basketForm.render({
          basket: this.basket.getItemsList().map((item, index) => {
            const cardTemplate = cloneTemplate('#card-basket')
            const cardBasket = new CardBasket(this.events, cardTemplate, {
              onClick: () =>
                this.events.emit(EventEnum.ProductRemove, { index: index }),
            })
            const htmlBacket = cardBasket.render({
              index: String(index + 1),
              title: item.title,
              price: String(item.price),
            })
            return htmlBacket
          }),
          total: this.basket.itemsAmount(),
        }),
      )
    })

    this.events.on(EventEnum.OrderStart, () => {
      const orderTemplate = cloneTemplate('#order')
      const actions = {
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault()
          this.modalClose()
          this.events.emit(EventEnum.OrderContinue)
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
      const orderForm = new FormOrder(this.events, orderTemplate, actions)
      this.modalOpen(orderForm.render())
    })
    this.events.on(EventEnum.OrderContinue, () => {
      const contactsTemplate = cloneTemplate('#contacts')
      const actions = {
        onSubmit: (event: SubmitEvent) => {
          event.preventDefault()
          this.modalClose()
          this.events.emit(EventEnum.OrderFinish)
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
      const contactsForm = new FormContacts(
        this.events,
        contactsTemplate,
        actions,
      )
      this.modalOpen(contactsForm.render())
    })

    this.events.on(EventEnum.OrderFinish, () => {
      const success = cloneTemplate('#success')
      const successForm = new FormSuccess(this.events, success)
      this.serverAPI
        .postOrder({
          ...this.endUser.getUserData(),
          total: this.basket.itemsAmount(),
          items: this.basket.getItemsList().map((item) => item.id),
        })
        .then((result) => {
          console.log('Order success!')
          this.headerView.counter = 0
          this.modalOpen(
            successForm.render({
              finalAmount: result.total,
            }),
          )
        })
        .catch((error) => {
          console.error(`Post Order error ${error}`)
        })
    })

    this.events.on(EventEnum.ProductRemove, (item: { index: number }) => {
      const currentList = this.basket.getItemsList()
      this.basket.removeItem(currentList[item.index])
      this.headerView.counter = this.basket.itemsCount()
      const basketTemplate = cloneTemplate('#basket')
      const basketForm = new FormBasket(this.events, basketTemplate, {
        onClick: () => {
          this.events.emit(EventEnum.OrderStart, this.basket.getItemsList())
        },
      })
      this.modalClose()
      basketForm.setButtonState(this.basket.itemsCount() === 0)
      this.modalOpen(
        basketForm.render({
          basket: this.basket.getItemsList().map((item, index) => {
            const cardTemplate = cloneTemplate('#card-basket')
            const cardBasket = new CardBasket(this.events, cardTemplate, {
              onClick: () =>
                this.events.emit(EventEnum.ProductRemove, { index: index }),
            })
            const htmlBacket = cardBasket.render({
              index: String(index + 1),
              title: item.title,
              price: String(item.price),
            })
            return htmlBacket
          }),
          total: this.basket.itemsAmount(),
        }),
      )
    })

    this.serverAPI
      .getProductList()
      .then((result) => {
        if (result && result.items) {
          try {
            this.catalog.setItemsList(result.items)
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
    this.events.on(EventEnum.ModalClose, () => this.modalClose())
    this.events.on(EventEnum.BasketEmpty, () => this.basket.clearBasket())
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

  private modalClose() {
    this.modal.classList.remove('modal_active')
    this.modalWindow = new ModalWindow(this.events, this.modal)
    this.modalWindow.content = ''
  }

  private modalOpen(window: HTMLElement) {
    this.modalWindow.content = window
    this.modalWindow.render()
    this.modal.classList.add('modal_active')
  }
}

const presenter = new Presenter()
presenter.init()
