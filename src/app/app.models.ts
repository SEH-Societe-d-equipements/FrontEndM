export class Restaurant {
    constructor(public id: number,
                public name: string,
                public address: string,
                public phone: string){}
}

export class Employee {
    constructor(public id: number,
                public image: string,
                public firstName: string,
                public lastName: string,
                public middleName: string,
                public email: string,
                public phone: string,
                public addresses: Address[], 
                public position: Position){}
}

//['General Manager','Assistant Manager'] ... https://aptito.com/blog/restaurant-positions-and-descriptions
export class Position {
    constructor(public id: number,
                public name: string){}
}

export class Address {
    constructor(public id: number,
                public country: Country, 
                public city: string,
                public place: string,
                public postalCode: string,
                public addressLine: string){}
}

export class Country {
    constructor(public name: string,
                public code: string){}
}

export class Customer {
    constructor(public id: number,
                public fullName: string, 
                public email: string,
                public phoneNumber: string,
                public address: string){}
}

export class Reservation {
    constructor(public id: number,
                public date: string,
                public time: string,
                public customer: Customer,
                public guests: number,
                public tableNumber: number,
                public status: ReservationStatus){}
} 

// Approved, Cancelled, Pending
export class ReservationStatus {
    constructor(public id: number,
                public name: string){}
}
 

export class Order {
    constructor(public id: number,
                public date: string,
                public items: MenuItem[],
                public quantity: number,
                public amount: number,
                public status: OrderStatus){}
}  

//Completed, Processing, On Hold, Refunded, Pending
export class OrderStatus {
    constructor(public id: number,
                public name: string){}
}

export class MenuItem {
    constructor(
      public _id: string,
      public Reference: string,
      public Designation: string,
      public Photo?: string,
      public Categorie?: {
        _id: string;
        Libelle : string,
        description: string
      },
    
    ) {}
  }
  

export class MenuItemImage {
    constructor(public small: string,
                public medium: string,
                public big: string){ }
}

export class Category {
    constructor(
      public _id?: string ,
      public Libelle?: string,
      public description?: string
    ) {}
  }

  export class Category1 {
    constructor(
      public _id?: string ,
      public Libelle?: string,
      public description?: string
    ) {}
  }

  
    

export class Pagination {
    constructor(public page: number,
                public perPage: number,
                public prePage: number | null,
                public nextPage: number | null,
                public total: number,
                public totalPages: number){ }
}

