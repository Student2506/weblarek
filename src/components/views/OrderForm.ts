import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

interface IOrderForm {}

interface IOrderActions {
  onCash(): void
  onCard(): void
  onEdit(address: string): void
  onSubmit(event: SubmitEvent): void
}

export class OrderForm extends Component<IOrderForm> {
  protected onlinePayElement: HTMLButtonElement
  protected cashPayElement: HTMLButtonElement
  protected addressElement: HTMLInputElement
  protected submitElement: HTMLButtonElement
  protected formElement: HTMLFormElement
  protected errorsElement: HTMLSpanElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    actions?: IOrderActions,
  ) {
    super(container)
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
    this.submitElement = ensureElement<HTMLButtonElement>(
      '.order__button',
      this.container,
    )
    this.errorsElement = ensureElement<HTMLSpanElement>(
      '.form__errors',
      this.container,
    )
    this.formElement = this.container as HTMLFormElement

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
      this.formElement.addEventListener('submit', actions.onSubmit)
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

  enableSubmit() {
    this.submitElement.disabled = false
  }
}
