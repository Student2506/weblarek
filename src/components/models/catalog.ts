import { IItem } from '../../types'

export class Catalog {
  private itemsList: IItem[] = []
  private currentItem: IItem | null = null

  constructor() {}

  setSelectedItem(item: IItem) {
    this.currentItem = item
  }
  getSelectedItem(): IItem | undefined {
    if (this.currentItem) {
      return this.currentItem
    }
  }
  setItemsList(items: IItem[]) {
    this.itemsList = items
  }

  getItemList(): IItem[] {
    return this.itemsList
  }
  getItem(itemId: string): IItem | undefined {
    return this.itemsList.find((item) => item.id === itemId)
  }
}
