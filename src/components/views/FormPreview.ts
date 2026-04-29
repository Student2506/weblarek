import { Component } from '../base/Component'

interface IFormPreview {
  card: HTMLElement
}

export class FormPreview extends Component<IFormPreview> {
  constructor(protected container: HTMLElement) {
    super(container)
  }

  set card(value: HTMLElement) {
    this.container.replaceChildren(value)
  }
}
