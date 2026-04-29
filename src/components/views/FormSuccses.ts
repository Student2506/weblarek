import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { EventEnum, IEvents } from '../base/Events'

interface ISuccessForm {
  finalAmount: number
}

export class SuccessForm extends Component<ISuccessForm> {
  protected descriptionElement: HTMLParagraphElement
  protected newPurchaseButton: HTMLButtonElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container)

    this.descriptionElement = ensureElement<HTMLParagraphElement>(
      '.order-success__description',
      this.container,
    )
    this.newPurchaseButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container,
    )

    this.newPurchaseButton.addEventListener('click', () => {
      this.events.emit(EventEnum.BasketEmpty)
      this.events.emit(EventEnum.ModalClose)
    })
  }

  set finalAmount(value: string) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`
  }
}
