import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IPreviewForm {
    card: HTMLElement
}

export class PreviewForm extends Component<IPreviewForm> {
    protected cardElement: HTMLDivElement

    constructor(protected container: HTMLElement) {
        super(container)

        this.cardElement = ensureElement<HTMLDivElement>(".card_full", this.container)
    }

    set card(value: HTMLElement) {
        this.cardElement.appendChild(value)
    }
}