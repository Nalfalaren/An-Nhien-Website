export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    thumbnailImage: File | null,
    categoryId: number,
    material: string,
    width: Number,
    height: Number,
    publishYear: Number,
    status: string,
  }

  export interface ProductGet {
    id: number,
    name: string,
    description: string,
    price: number,
    thumbnail: string | null ,
    categoryId: number,
    material: string,
    width: Number,
    height: Number,
    publishYear: Number,
    status: string
  }

  export enum Status{
    AVAILABLE ="AVAILABLE", STOCKOUT = "STOCKOUT", ORDERED ="ORDERED"
  }

  export interface ProductShortInfo {
    id: number,
    name: string,
    thumbnail: string | null,
    thumbnailImage: string | null
  }

