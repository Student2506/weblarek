import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { EventEnum, IEvents } from '../base/Events'

interface IModalWindow {
  content: HTMLElement
}

export class ModalWindow extends Component<IModalWindow> {
  protected contentElement: HTMLDivElement
  protected closeButton: HTMLButtonElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container)

    this.contentElement = ensureElement<HTMLDivElement>(
      '.modal__content',
      this.container,
    )
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container,
    )

    this.closeButton.addEventListener('click', () => {
      this.events.emit(EventEnum.ModalClose)
    })
  }

  set content(item: HTMLElement | '') {
    if (item instanceof HTMLElement) {
      this.contentElement.appendChild(item)
    } else {
      this.contentElement.innerHTML = ''
    }
  }
}
