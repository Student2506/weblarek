import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { EventEnum, IEvents } from '../base/Events'

interface IModalWindow {
  content: HTMLElement
}

interface IModalActions {
  onClose(event: MouseEvent): void
}

export class ModalWindow extends Component<IModalWindow> {
  protected contentElement: HTMLDivElement
  protected closeButton: HTMLButtonElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    protected actions?: IModalActions,
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

    this.container.addEventListener('click', (event) => {
      if (event.target === event.currentTarget)
        this.events.emit(EventEnum.ModalClose)
    })

    this.closeButton.addEventListener('click', () => {
        this.events.emit(EventEnum.ModalClose)
    })
  }

  set content(item: HTMLElement | '') {
    if (item instanceof HTMLElement) {
      this.contentElement.replaceChildren(item)
      this.container.classList.add('modal_active')
    } else {
      this.contentElement.innerHTML = ''
      this.container.classList.remove('modal_active')
    }
  }

  close() {
    this.content = ''
  }
}
