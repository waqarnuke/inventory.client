export class Register {
    id: number;
    cash: number;
    card: number;
    lastUpdated: string;
    userId: string;
    locationId: number;
    location: any;

    constructor() {
        this.id = 0;
        this.cash = 0;
        this.card = 0;
        this.lastUpdated = '';
        this.userId = '';
        this.locationId = 0;
        this.location = {};
    }
}