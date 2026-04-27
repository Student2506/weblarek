import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICard {
    category: string
    name: string
    image: string
    price: string
}

export class Card extends Component<ICard> {
  protected categoryElement: HTMLSpanElement
  protected nameElement: HTMLHeadElement
  protected imageElement: HTMLImageElement
  protected priceElement: HTMLSpanElement

  constructor(protected container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLSpanElement>(".card__category", this.container);
    this.nameElement = ensureElement<HTMLHeadElement>(".card__title", this.container);
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.priceElement = ensureElement<HTMLSpanElement>(".card__price", this.container);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  }

  set name(value: string) {
    this.nameElement.textContent = value;
  }
  
  set price(value: string) {
    this.priceElement.textContent = value;
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, `Image for ${this.name}`);
  }
}
