import { BuySaleItem } from "./buySaleItem"

export type BuySaleRequestDto =  {
    paymentMethod: string,
    locationId: number,
    items: BuySaleItem[]
} 