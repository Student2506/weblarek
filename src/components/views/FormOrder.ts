import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { EventEnum, IEvents } from '../base/Events'

interface IFormOrder {} // eslint-disable-line @typescript-eslint/no-empty-object-type

interface IOrderActions {
  onCash(): void
  onCard(): void
  onEdit(address: string): void
  onSubmit(): void
}

export class FormOrder extends Component<IFormOrder> {
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
      this.formElement.addEventListener('submit', (event) => {
        event.preventDefault()
        actions.onSubmit()
        this.onlinePayElement.classList.remove('button_alt-active')
        this.cashPayElement.classList.remove('button_alt-active')
        this.submitElement.disabled = true
        this.errorsElement.textContent = ''
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

  enableSubmit() {
    this.submitElement.disabled = false
  }

  setError(errors: string[]) {
    this.errorsElement.textContent = errors
      .map((error) => error.toString())
      .join('; ')
  }
}
