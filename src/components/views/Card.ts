import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICard {
    category?: string
    title: string
    image?: string
    price?: string
    index?: string
    decription?: string
}

export class Card<T> extends Component<T> {
  protected titleElement: HTMLHeadElement
  protected priceElement: HTMLSpanElement

  constructor(protected container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLHeadElement>(".card__title", this.container);
    this.priceElement = ensureElement<HTMLSpanElement>(".card__price", this.container);
  }


  set title(value: string) {
    this.titleElement.textContent = value;
  }
  
  set price(value: string) {
    this.priceElement.textContent = `${value} синапсов`;
  }

}
