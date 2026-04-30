import { categoryMap } from '../../utils/constants'
import { ensureElement } from '../../utils/utils'
import { Card, ICard } from './Card'

interface ICardActions {
  onClick(): void
}

export type TCardCatalog = Pick<ICard, 'image' | 'category' | 'title' | 'price'>

export class CardCatalog extends Card<TCardCatalog> {
  protected imageElement: HTMLImageElement
  protected categoryElement: HTMLSpanElement

  constructor(
    protected conatiner: HTMLElement,
    actions?: ICardActions,
  ) {
    super(conatiner)

    this.categoryElement = ensureElement<HTMLSpanElement>(
      '.card__category',
      this.container,
    )
    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container,
    )

    if (actions?.onClick) {
      this.conatiner.addEventListener('click', actions.onClick)
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value
    const currentClassList = ['card__category']
    const className = categoryMap[value as keyof typeof categoryMap]
    this.categoryElement.classList = [...currentClassList, className].join(' ')
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, `Image for ${this.title}`)
  }
}
