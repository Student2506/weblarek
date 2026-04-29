import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { EventEnum, IEvents } from '../base/Events'

interface IViewHeader {
  counter: number
}

export class ViewHeader extends Component<IViewHeader> {
  protected counterElement: HTMLElement
  protected basketButton: HTMLButtonElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container)
    this.counterElement = ensureElement<HTMLElement>(
      '.header__basket-counter',
      this.container,
    )
    this.basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      this.container,
    )

    this.basketButton.addEventListener('click', () => {
      this.events.emit(EventEnum.BasketOpen)
    })
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value)
  }
}
