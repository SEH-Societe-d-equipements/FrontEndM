import { Menu } from './menu.model';

export const horizontalMenuItems = [ 
    new Menu (1, 'NAV.HOME', '/', null, null, false, 0),
    new Menu (2, 'MENU', '/menu', null, null, false, 0), 
    new Menu (11, 'RESERVATION', '/reservation', null, null, false, 10), 
    new Menu (20, 'ACCOUNT', null, null, null, true, 10), 
    new Menu (21, 'LOGIN', '/login', null, null, false, 20), 
    new Menu (40, 'NAV.SHOP', null, null, null, true, 10), 
    new Menu (41, 'NAV.SINGLE_MENU', '/menu/17', null, null, false, 40), 
    new Menu (42, 'NAV.CART', '/cart', null, null, false, 40), 
    new Menu (43, 'NAV.CHECKOUT', '/checkout', null, null, false, 40),  
    new Menu (60, 'FAQs', '/faq', null, null, false, 10), 
    new Menu (62, 'NAV.TERMS_CONDITIONS', '/terms-conditions', null, null, false, 10), 
    new Menu (70, 'NAV.CONTACT', '/contact', null, null, false, 0),  
    new Menu (80, 'NAV.ABOUT_US', '/about', null, null, false, 0),  
    /*new Menu (90, 'NAV.ADMIN', '/admin', null, null, false, 0),  */
    new Menu (142, 'NAV.MENU_ITEM', null, '/', '_blank', false, 140),
    new Menu (143, 'NAV.MENU_ITEM', null,'/', '_blank', false, 140),
    new Menu (144, 'NAV.MENU_ITEM', null,'/', '_blank', false, 140)    
]

export const verticalMenuItems = [ 
    new Menu (1, 'NAV.HOME', '/', null, null, false, 0),
    new Menu (2, 'MENU', '/menu', null, null, false, 0), 
    new Menu (11, 'RESERVATION', '/reservation', null, null, false, 10), 
    new Menu (20, 'ACCOUNT', null, null, null, true, 10), 
    new Menu (21, 'LOGIN', '/login', null, null, false, 20), 
    new Menu (41, 'NAV.SINGLE_MENU', '/menu/17', null, null, false, 40), 
    new Menu (70, 'NAV.CONTACT', '/contact', null, null, false, 0),  
    new Menu (80, 'NAV.ABOUT_US', '/about', null, null, false, 0),  
 
]