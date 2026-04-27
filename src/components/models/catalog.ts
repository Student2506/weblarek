import { IItem } from '../../types'
import { EventEnum, IEvents } from '../base/Events'

export class Catalog {
  private itemsList: IItem[] = []
  private currentItem: IItem | null = null

  constructor(private events: IEvents) {}

  setSelectedItem(item: IItem) {
    this.currentItem = item
    this.events.emit(EventEnum.CatalogLoaded);
  }
  getSelectedItem(): IItem | undefined {
    if (this.currentItem) {
      return this.currentItem
    }
  }
  setItemsList(items: IItem[]) {
    this.itemsList = items
    this.events.emit(EventEnum.CatalogLoaded);
  }

  getItemList(): IItem[] {
    return this.itemsList
  }
  getItem(itemId: string): IItem | undefined {
    return this.itemsList.find((item) => item.id === itemId)
  }
}
