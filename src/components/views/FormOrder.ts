import { ensureElement } from '../../utils/utils'
import { EventEnum, IEvents } from '../base/Events'
import { Form } from './Form'

interface IFormOrder {} // eslint-disable-line @typescript-eslint/no-empty-object-type

interface IOrderActions {
  onCash(): void
  onCard(): void
  onEdit(address: string): void
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

    if (actions?.onCard) {
      this.onlinePayElement.addEventListener('click', actions.onCard)
    }
    if (actions?.onCash) {
      this.cashPayElement.addEventListener('click', actions.onCash)
    }
    if (actions?.onEdit) {
      this.addressElement.addEventListener('input', () => {
        actions.onEdit(this.addressElement.value)
      })
    }
    if (actions?.onSubmit) {
      this.formElement.addEventListener('submit', (event) => {
        super.onsubmit(event)
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
}
