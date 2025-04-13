export type buyingItem =  {
    itemId: number
    title: string
    quantity: number
    pricePerUnit: number
    totalPrice: number
    paymentMethod: string
    userId: string
    transactionId: string
    locationId: number
}

export type buyingItemDto = {
    itemId: number
    title: string
    quantity: number
    pricePerUnit: number
    totalPrice: number
    paymentMethod: string
    locationName: string
    transactionId: string
}