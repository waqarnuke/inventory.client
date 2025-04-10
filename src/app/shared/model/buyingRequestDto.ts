import { buyingItem } from "./buyingItem"

export type buyingRequestDto =  {
    paymentMethod: string
    Items: buyingItem[]
}  