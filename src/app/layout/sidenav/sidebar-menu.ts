export const  MENU_ITEMS =  [
    { 
        route: 'dashboard', 
        icon: 'dashboard', 
        label:'Dashboard',
        roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 
    },
    { 
        route: 'company', 
        icon: 'Dashboard', 
        label:'Organization',
        roles: ['Admin','SuperAdmin'] 
    },
    {
        route: null, 
        icon: 'shopping_bag', 
        label:'inventory',
        roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'],
        children: [
                {
                    route: 'inventory/add-product', icon: 'shopping_cart ', label:'Add Product',
                    roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 
                },
                {
                    route: 'inventory/product-list', icon: 'shopping_cart ', label:'Products',
                    roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 
                },
        ]
    }, 
    {
        route: null, 
        icon: 'shopping_bag', 
        label:'Buy',
        roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] ,
        children: [
                {
                    route: 'buy/add-buy', icon: 'shopping_cart ', label:'Create Buying',
                    roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 

                },
                {   
                    route: 'buy/buy-list', icon: 'shopping_cart ', label:'Buying List',
                    roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 
                },
        ]
    }, 
    {
        route: null, 
        icon: 'shopping_bag', 
        label:'Sale',
        roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] ,
        children: [
                {
                    route: 'sale/add-sale', icon: 'shopping_cart ', label:'Add Sale',
                    roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 
                },
                {
                    route: 'sale/sale-list', icon: 'shopping_cart ', label:'Sale List',
                    roles: ['Admin', 'Employee', 'Manager', 'SuperAdmin'] 
                },
        ]
    }, 
    
    {route: 'Employee', icon: 'people' , label:'Employee'},
    {route: 'Integrations', icon: 'extension' , label:'Integrations'},
    {route: 'reports', icon: 'bar_chart' , label:'Reports'},
    {route: 'Settings', icon: 'settings' , label:'Settings'}
];