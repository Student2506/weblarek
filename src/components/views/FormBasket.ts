import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

interface ICardActions {
  onClick(): void
}

interface IBasketForm {
  basket: HTMLElement[]
  total: number
}

export class BasketForm extends Component<IBasketForm> {
  protected basketElement: HTMLDivElement
  protected sumbitButtonElement: HTMLButtonElement
  protected totalPriceElement: HTMLSpanElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    protected actions?: ICardActions,
  ) {
    super(container)

    this.basketElement = ensureElement<HTMLDivElement>(
      '.basket__list',
      this.container,
    )
    this.sumbitButtonElement = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container,
    )
    this.totalPriceElement = ensureElement<HTMLSpanElement>(
      '.basket__price',
      this.container,
    )

    if (actions?.onClick) {
      this.sumbitButtonElement.addEventListener('click', actions.onClick)
    }
  }

  set basket(items: HTMLElement[]) {
    this.basketElement.replaceChildren()
    items.forEach((item) => this.basketElement.appendChild(item))
  }

  set total(value: string) {
    this.totalPriceElement.textContent = `${value} синапсов`
  }

  setButtonState(isDisabled: boolean) {
    this.sumbitButtonElement.disabled = isDisabled
  }
}
