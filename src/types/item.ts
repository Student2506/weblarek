import { ICategory, IItem } from ".";

export class Item implements IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ICategory[];
  price: number | null;

  constructor (id: string, description: string, image: string, title: string, categories: ICategory[], price: number | null) {
    this.id = id;
    this.description = description;
    this.image = image;
    this.title = title;
    this.category = categories;
    this.price = price;
  }
}