import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card, ICard } from "./Card";

export type TCardBasket = Pick<ICard, 'index' | 'title' | 'price'>

export class CardBasket extends Card<TCardBasket> {
  protected deleteButtonElement: HTMLButtonElement
  protected indexElement: HTMLSpanElement

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container)

    this.deleteButtonElement = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container)
    this.indexElement = ensureElement<HTMLSpanElement>(".basket__item-index", this.container)
  }

  set index(value: number) {
    this.indexElement.textContent = String(value)
  }

}