import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

interface IGallery {
  catalog: HTMLElement[]
}

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container)

    this.catalogElement = this.container
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren()
    items.forEach((item) => this.catalogElement.appendChild(item))
  }
}
