import { buyingItem } from "./buyingItem"

export type buyingRequestDto =  {
    paymentMethod: string,
    locationId: number,
    Items: buyingItem[]
}  