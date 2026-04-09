import { IItem } from '../../types'

export class Basket {
  private listItems: IItem[] = []

  constructor() {}

  addItem(item: IItem) {
    this.listItems.push(item)
  }
  removeItem(item: IItem) {
    const itemIndex = this.listItems.findIndex((el) => el.id === item.id)
    if (itemIndex !== -1) {
      this.listItems.splice(itemIndex, 1)
    }
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
    this.listItems.length = 0
  }
  checkIfItemInList(itemId: string): boolean {
    return this.listItems.some((el) => itemId === el.id)
  }
}
