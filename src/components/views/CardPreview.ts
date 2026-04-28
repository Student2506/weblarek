import { ensureElement } from '../../utils/utils'
import { IEvents } from '../base/Events'
import { Card, ICard } from './Card'

export type TCardPreview = Pick<
  ICard,
  'category' | 'title' | 'image' | 'price' | 'description'
>

interface ICardActions {
  onClick(): void
}

export class CardPreview extends Card<TCardPreview> {
  protected categoryElement: HTMLSpanElement
  protected imageElement: HTMLImageElement
  protected descriptionElement: HTMLParagraphElement
  protected addButtonElement: HTMLButtonElement

  constructor(
    protected container: HTMLElement,
    protected events: IEvents,
    protected actions?: ICardActions,
  ) {
    super(container)

    this.categoryElement = ensureElement<HTMLSpanElement>(
      '.card__category',
      this.container,
    )
    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container,
    )
    this.descriptionElement = ensureElement<HTMLParagraphElement>(
      '.card__text',
      this.container,
    )
    this.addButtonElement = ensureElement<HTMLButtonElement>(
      '.card__button',
      this.container,
    )

    if (actions?.onClick) {
      this.addButtonElement.addEventListener('click', actions.onClick)
    }
  }
}
