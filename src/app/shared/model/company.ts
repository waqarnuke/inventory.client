import { Location } from './location';
export type Company = {
    id: number;
    companyName: string;
    locations: Location[];
    userId? :string
}