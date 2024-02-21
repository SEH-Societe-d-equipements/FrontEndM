import { Menu } from './menu.model'; 

export const menuItems = [ 
    new Menu (10, 'ADMIN_NAV.DASHBOARD', '/admin', null, 'dashboard', null, false, 0),
    new Menu (20, 'ADMIN_NAV.MENU_ITEMS', null, null, 'grid_on', null, true, 0),  
    new Menu (21, 'ADMIN_NAV.CATEGORIES', '/admin/menu-items/categories', null, 'category', null, false, 20), 
    new Menu (22, 'ADMIN_NAV.MENU_ITEMS_LIST', '/admin/menu-items/list', null, 'list', null, false, 20), 
    new Menu (24, 'ADMIN_NAV.ADD_MENU_ITEM', '/admin/menu-items/add', null, 'add_circle_outline', null, false, 20), 
  
]