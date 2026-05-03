import { ensureElement } from '../../utils/utils'
import { EventEnum, IEvents } from '../base/Events'
import { Form } from './Form'

interface IFormOrder {
  address: string
}

interface IOrderActions {
  onEdit(fleldName: string, value: string): void
  onSubmit(): void
}

export class FormOrder extends Form<IFormOrder> {
  protected onlinePayElement: HTMLButtonElement
  protected cashPayElement: HTMLButtonElement
  protected addressElement: HTMLInputElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    protected actions?: IOrderActions,
  ) {
    super(events, container, actions)

    this.onlinePayElement = ensureElement<HTMLButtonElement>(
      "button[name='card']",
      this.container,
    )
    this.cashPayElement = ensureElement<HTMLButtonElement>(
      "button[name='cash']",
      this.container,
    )
    this.addressElement = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    )

    if (actions?.onEdit) {
      this.addressElement.addEventListener('input', () => {
        actions.onEdit('address', this.addressElement.value)
      })
      this.cashPayElement.addEventListener('click', () => {
        actions.onEdit('payment', 'cash')
      })
      this.onlinePayElement.addEventListener('click', () => {
        actions.onEdit('payment', 'card')
      })
    }
    if (actions?.onSubmit) {
      this.formElement.addEventListener('submit', (event) => {
        super.onSubmit(event)
        this.onlinePayElement.classList.remove('button_alt-active')
        this.cashPayElement.classList.remove('button_alt-active')
        this.addressElement.value = ''
        this.events.emit(EventEnum.OrderContinue)
      })
    }
  }

  chooseCash() {
    this.onlinePayElement.classList.remove('button_alt-active')
    this.cashPayElement.classList.add('button_alt-active')
  }

  chooseCard() {
    this.cashPayElement.classList.remove('button_alt-active')
    this.onlinePayElement.classList.add('button_alt-active')
  }

  set address(value: string) {
    this.addressElement.value = value
  }
}
