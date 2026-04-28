import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEnum, IEvents } from "../base/Events";

interface IBasketForm {
    basket: HTMLElement[],
    total: number
}

export class BasketForm extends Component<IBasketForm> {
    protected basketElement: HTMLDivElement
    protected sumbitButtonElement: HTMLButtonElement
    protected totalPriceElement: HTMLSpanElement

    constructor(protected events: IEvents, protected container: HTMLElement) {
        super(container)

        this.basketElement = ensureElement<HTMLDivElement>(".basket__list", this.container)
        this.sumbitButtonElement = ensureElement<HTMLButtonElement>(".basket__button", this.container)
        this.totalPriceElement = ensureElement<HTMLSpanElement>(".basket__price", this.container)

        this.sumbitButtonElement.addEventListener('click', () => {
            this.events.emit(EventEnum.OrderStart)
        })
    }

    set basket(items: HTMLElement[]) {
        this.basketElement.replaceChildren();
        items.forEach((item) => this.basketElement.appendChild(item));
    }

    set total(value: string) {
        this.totalPriceElement.textContent = `${value} синапсов`
    }
}