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
  private modalWindow: ModalWindow
  private events: EventEmitter
  private catalog: Catalog
  private api: Api
  private serverAPI: ServerAPI
  private basketForm: FormBasket
  private orderForm: FormOrder
  private orderContacts: FormContacts
  private successForm: FormSuccess

  constructor() {
    this.events = new EventEmitter()
    this.basket = new Basket(this.events)
    this.endUser = new EndUser()

    const header = ensureElement<HTMLElement>('.header__container')
    this.headerView = new ViewHeader(this.events, header)
    const modal = ensureElement<HTMLDivElement>('#modal-container')
    this.modalWindow = new ModalWindow(this.events, modal)
    const gallery = ensureElement<HTMLElement>('.gallery')
    this.galleryView = new ViewGallery(this.events, gallery)
    const basket = cloneTemplate('#basket')
    this.basketForm = new FormBasket(this.events, basket, {
      onClick: () => {
        this.events.emit(EventEnum.OrderStart)
      },
    })
    const orderTemplate = cloneTemplate('#order')
    const actionsOrder = {
      onSubmit: () => {
        this.modalWindow.content = ''
      },
      onCash: () => {
        this.endUser.saveUserData({ payment: 'cash' })
        this.orderForm.chooseCash()
        const errors = this.validateInput(['payment', 'address'])
        if (!errors.length) {
          this.orderForm.setError([])
          this.orderForm.enableSubmit()
        } else this.orderForm.setError(errors)
      },
      onCard: () => {
        this.endUser.saveUserData({ payment: 'card' })
        this.orderForm.chooseCard()
        const errors = this.validateInput(['payment', 'address'])
        if (!errors.length) {
          this.orderForm.setError([])
          this.orderForm.enableSubmit()
        } else this.orderForm.setError(errors)
      },
      onEdit: (address: string) => {
        this.endUser.saveUserData({ address: address })
        const errors = this.validateInput(['payment', 'address'])
        if (!errors.length) {
          this.orderForm.setError([])
          this.orderForm.enableSubmit()
        } else this.orderForm.setError(errors)
      },
    }
    this.orderForm = new FormOrder(this.events, orderTemplate, actionsOrder)

    const contactsTemplate = cloneTemplate('#contacts')
    const actionsContacts = {
      onSubmit: () => {
        this.modalWindow.content = ''
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
          this.orderContacts.setError([])
          this.orderContacts.enableSubmit()
        } else this.orderContacts.setError(errors)
      },
    }
    this.orderContacts = new FormContacts(
      this.events,
      contactsTemplate,
      actionsContacts,
    )

    const success = cloneTemplate('#success')
    this.successForm = new FormSuccess(this.events, success)
    const itemTemplate = cloneTemplate('#card-preview')
    const cardPreview = new CardPreview(itemTemplate, this.events, {
      onClick: () => {
        this.events.emit(EventEnum.ProudctAddRemove)
      },
    })

    this.api = new Api(API_URL)
    this.serverAPI = new ServerAPI(this.api)
    this.catalog = new Catalog(this.events)

    modal.addEventListener('click', (event: MouseEvent) => {
      if (event.target === event.currentTarget) this.modalWindow.content = ''
    })

    this.events.on(EventEnum.BasketChange, () => {
      this.basketForm.render({
        basket: this.basket.getItemsList().map((item, index) => {
          const cardTemplate = cloneTemplate('#card-basket')
          const cardBasket = new CardBasket(this.events, cardTemplate, {
            onClick: () => this.events.emit(EventEnum.ProductRemove, item),
          })
          const htmlBacket = cardBasket.render({
            index: String(index + 1),
            title: item.title,
            price: item.price,
          })
          return htmlBacket
        }),
        total: this.basket.itemsAmount(),
      })
      this.headerView.render({ counter: this.basket.itemsCount() })
    })

    this.events.on(EventEnum.CatalogLoaded, () => {
      this.galleryView.catalog = this.catalog.getItemList().map((item) => {
        const cardTemplate = cloneTemplate('#card-catalog')
        return new CardCatalog(cardTemplate, {
          onClick: () => this.events.emit(EventEnum.SaveProduct, item),
        }).render({
          category: item.category,
          title: item.title,
          price: item.price,
          image: CDN_URL + item.image,
        })
      })
    })

    this.events.on(EventEnum.SaveProduct, (item: IItem) => {
      this.catalog.setSelectedItem(item)
    })
    this.events.on(EventEnum.ShowProduct, () => {
      const item = this.catalog.getSelectedItem()
      if (item === undefined) return
      const isAdded = this.basket.checkIfItemInList(item.id)
      const card = cardPreview.render({
        title: item.title,
        price: item.price,
        category: item.category,
        image: CDN_URL + item.image,
        description: item.description,
        added: isAdded,
      })

      this.modalWindow.render({ content: card })
    })
    this.events.on(EventEnum.ProductBuy, (itemData) => {
      this.basket.addItem(itemData as IItem)
      this.modalWindow.content = ''
    })
    this.events.on(EventEnum.BasketOpen, () => {
      this.modalWindow.render({ content: this.basketForm.render() })
    })

    this.events.on(EventEnum.OrderStart, () => {
      this.modalWindow.render({ content: this.orderForm.render() })
    })
    this.events.on(EventEnum.OrderContinue, () => {
      this.modalWindow.render({ content: this.orderContacts.render() })
    })

    this.events.on(EventEnum.OrderFinish, () => {
      this.serverAPI
        .postOrder({
          ...this.endUser.getUserData(),
          total: this.basket.itemsAmount(),
          items: this.basket.getItemsList().map((item) => item.id),
        })
        .then((result) => {
          console.log('Order success!')
          this.modalWindow.render({
            content: this.successForm.render({
              finalAmount: result.total,
            }),
          })
          this.basket.clearBasket()
        })
        .catch((error) => {
          console.error(`Post Order error ${error}`)
        })
    })

    this.events.on(EventEnum.ProductRemove, (itemInBasket: IItem) => {
      this.basket.removeItem(itemInBasket)
    })

    this.events.on(EventEnum.ProudctAddRemove, () => {
      this.modalWindow.content = ''
      const item = this.catalog.getSelectedItem()!
      const isAdded = this.basket.checkIfItemInList(item.id)
      if (isAdded) {
        this.basket.removeItem(item)
      } else {
        this.basket.addItem(item)
      }
    })

    this.serverAPI
      .getProductList()
      .then((result) => {
        try {
          this.catalog.setItemsList(result.items)
        } catch (parsingError) {
          console.error(`Has parsing error ${parsingError}`)
        }
      })
      .catch((error) => {
        console.error(`Server failed ${error}`)
      })
    this.events.on(EventEnum.ModalClose, () => (this.modalWindow.content = ''))
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
