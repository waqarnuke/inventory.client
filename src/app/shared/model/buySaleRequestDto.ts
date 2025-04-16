import { BuySaleItem } from "./buySaleItem"

export type BuySaleRequestDto =  {
    paymentMethod: string
    items: BuySaleItem[]
} 