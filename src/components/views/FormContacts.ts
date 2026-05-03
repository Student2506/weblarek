import { ensureElement } from '../../utils/utils'
import { EventEnum, IEvents } from '../base/Events'
import { Form } from './Form'

interface IFormContacts {
  phone: string
  email: string
}

interface IOrderActions {
  onEdit(fieldName: string, value: string): void
  onSubmit(): void
}

export class FormContacts extends Form<IFormContacts> {
  protected emailElement: HTMLInputElement
  protected phoneElement: HTMLInputElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    protected actions?: IOrderActions,
  ) {
    super(events, container, actions)
    this.emailElement = ensureElement<HTMLInputElement>(
      "input[name='email']",
      this.container,
    )
    this.phoneElement = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      this.container,
    )
    if (actions?.onSubmit) {
      this.formElement.addEventListener('submit', (event) => {
        super.onSubmit(event)
        this.emailElement.value = ''
        this.phoneElement.value = ''
        this.events.emit(EventEnum.OrderFinish)
      })
    }
    if (actions?.onEdit) {
      this.emailElement.addEventListener('input', () =>
        actions.onEdit('email', this.emailElement.value),
      )
    }
    if (actions?.onEdit) {
      this.phoneElement.addEventListener('input', () =>
        actions.onEdit('phone', this.phoneElement.value),
      )
    }
  }

  set email(value: string) {
    this.emailElement.value = value
  }

  set phone(value: string) {
    this.phoneElement.value = value
  }
}
