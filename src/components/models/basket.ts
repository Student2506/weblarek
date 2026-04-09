import { IItem } from '../../types'

export class Basket {
  listItems: IItem[] = []

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
  checkItemAvailablity(item: IItem): boolean {
    return item.price !== null
  }
  clearBasket() {
    this.listItems.length = 0
  }
  checkIfItemInList(itemId: string): boolean {
    const itemIndex = this.listItems.findIndex((el) => itemId === el.id)
    return itemIndex !== -1
  }
}
