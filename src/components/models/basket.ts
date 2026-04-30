import { IItem } from '../../types'
import { EventEnum, IEvents } from '../base/Events'

export class Basket {
  private listItems: IItem[] = []

  constructor(protected events: IEvents) {}

  addItem(item: IItem) {
    this.listItems.push(item)
    this.events.emit(EventEnum.BasketChange)
  }
  removeItem(item: IItem) {
    const itemIndex = this.listItems.findIndex((el) => el.id === item.id)
    if (itemIndex !== -1) {
      this.listItems.splice(itemIndex, 1)
    }
    this.events.emit(EventEnum.BasketChange)
  }
  itemsCount(): number {
    return this.listItems.length
  }
  getItemsList(): IItem[] {
    return this.listItems
  }
  itemsAmount(): number {
    return this.listItems.reduce((sum, item) => {
      return item.price != null ? sum + item.price : sum
    }, 0)
  }

  clearBasket() {
    this.listItems = []
    this.events.emit(EventEnum.BasketChange)
  }
  checkIfItemInList(itemId: string): boolean {
    return this.listItems.some((el) => itemId === el.id)
  }
}
