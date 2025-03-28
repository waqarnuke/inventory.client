import { image } from "./image"

export type product =  {
    id: number
    title: string
    description: string
    price: number
    stock: number
    emi: any
    isSingle: boolean
    imageUrl: string
    brandId: number
    modelId: number
    brand: string
    model: string
    createdTime: string
    updatedTime: string
    createdUser: any
    updatedUser: any
    status: boolean
    color: any
    condition: any
    itemTypeId: number
    itemType: any
    locationId: number
    location: string
    mobileNetworkId: number
    mobileNetwork: string
    storageId: number
    storage: string
    images : image[]
}  