import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export interface IFormActions {
  onSubmit(): void
}

export abstract class Form<T> extends Component<T> {
  protected submitElement: HTMLButtonElement
  protected formElement: HTMLFormElement
  protected errorsElement: HTMLSpanElement

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
    protected actions?: IFormActions,
  ) {
    super(container)

    this.submitElement = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    )
    this.errorsElement = ensureElement<HTMLSpanElement>(
      '.form__errors',
      this.container,
    )
    this.formElement = this.container as HTMLFormElement
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.actions?.onSubmit()
    this.errorsElement.textContent = ''
    this.setSubmitState(true)
  }

  setSubmitState(isDisabled: boolean) {
    this.submitElement.disabled = isDisabled
  }

  setError(errors: string[]) {
    this.errorsElement.textContent = errors
      .map((error) => error.toString())
      .join('; ')
  }
}
