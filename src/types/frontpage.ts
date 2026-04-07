import { Item } from './item'

export class FrontPage {
  itemsList: Item[]
  currentItem: Item | null = null

  constructor(itemList: Item[]) {
    this.itemsList = itemList
  }

  removeItem(itemId: string) {
    const itemIndex = this.itemsList.findIndex((item) => item.id === itemId)
    if (itemIndex !== -1) {
      this.itemsList.splice(itemIndex, 1)
    }
  }

  setSelectedItem(itemId: string) {
    const itemIndex = this.itemsList.findIndex((el) => el.id === itemId)
    if (itemIndex !== 1) {
      this.currentItem = this.itemsList[itemIndex]
    }
  }
  getSelectedItem(): Item | undefined {
    if (this.currentItem) {
      return this.currentItem
    }
  }
  loadItemsList(items: Item[]) {
    this.itemsList = items
  }
  getItem(itemId: string): Item | undefined {
    return this.itemsList.find((item) => item.id === itemId)
  }
}
