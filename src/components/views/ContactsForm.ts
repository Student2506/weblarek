import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

interface IContactsForm {}

interface IOrderActions {
  onEdit(fieldName: string, value: string): void
  onSubmit(event: SubmitEvent): void
}

export class ContactsForm extends Component<IContactsForm> {
  protected emailElement: HTMLInputElement
  protected phoneElement: HTMLInputElement
  protected submitElement: HTMLButtonElement
  protected formElement: HTMLFormElement
  protected errorsElement: HTMLSpanElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    actions?: IOrderActions,
  ) {
    super(container)
    this.emailElement = ensureElement<HTMLInputElement>(
      "input[name='email']",
      this.container,
    )
    this.phoneElement = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      this.container,
    )
    this.submitElement = ensureElement<HTMLButtonElement>(
      "button[type='submit']",
      this.container,
    )
    this.errorsElement = ensureElement<HTMLSpanElement>(
      '.form__errors',
      this.container,
    )
    this.formElement = this.container as HTMLFormElement

    if (actions?.onSubmit) {
      this.formElement.addEventListener('submit', actions.onSubmit)
    }
    if (actions?.onEdit) {
        this.emailElement.addEventListener('input', () => actions.onEdit('email', this.emailElement.value))
    }
    if (actions?.onEdit) {
        this.phoneElement.addEventListener('input', () => actions.onEdit('phone', this.phoneElement.value))
    }

  }

  
  enableSubmit() {
    this.submitElement.disabled = false
  }
}
