import { Component } from '../base/Component'

interface IPreviewForm {
  card: HTMLElement
}

export class PreviewForm extends Component<IPreviewForm> {
  constructor(protected container: HTMLElement) {
    super(container)
  }

  set card(value: HTMLElement) {
    this.container.replaceChildren(value)
  }
}
