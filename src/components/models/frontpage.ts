import { IItem } from '../../types'

export class FrontPage {
  itemsList: IItem[]
  currentItem: IItem | null = null

  constructor(itemList: IItem[]) {
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
  getSelectedItem(): IItem | undefined {
    if (this.currentItem) {
      return this.currentItem
    }
  }
  loadItemsList(items: IItem[]) {
    this.itemsList = items
  }

  getItemList(): IItem[] {
    return this.itemsList
  }
  getItem(itemId: string): IItem | undefined {
    return this.itemsList.find((item) => item.id === itemId)
  }
}
