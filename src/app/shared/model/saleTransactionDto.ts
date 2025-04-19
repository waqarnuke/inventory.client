import { product } from "./product"

export type SaleTransactionDto =  {
    itemId: number
    title: any
    quantity: number
    pricePerUnit: number
    totalPrice: number
    paymentMethod: string
    userId: any
    transactionId: string
    locationId: any
    saleDate: string
    items:product[]
    showDetails: false
}