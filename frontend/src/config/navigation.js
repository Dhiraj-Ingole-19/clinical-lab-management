import { 
    Home, 
    Calendar, 
    FileText, 
    User, 
    LayoutDashboard, 
    ClipboardList,
    Utensils 
} from 'lucide-react';

export const NAV_ITEMS = [
    // --- PUBLIC / GUEST ---
    { 
        label: 'Home', 
        path: '/', 
        icon: Home, 
        roles: ['GUEST'], 
        mobile: true, 
        desktop: true 
    },
    { 
        label: 'Services', 
        path: '/menu', 
        icon: Utensils, // Or ClipboardList/List if 'Services' implies a list
        roles: ['GUEST'], 
        mobile: true, 
        desktop: true 
    },

    // --- USER (PATIENT) ---
    { 
        label: 'Dashboard', 
        path: '/dashboard', 
        icon: LayoutDashboard, 
        roles: ['USER'], 
        mobile: true, 
        desktop: false // Hidden on desktop topbar (users usually have Book Test/Appts there)
    },
    { 
        label: 'Book Test', 
        path: '/book-test', 
        icon: Calendar, 
        roles: ['USER'], 
        mobile: true, 
        desktop: true 
    },
    { 
        label: 'My Appts', 
        path: '/my-appointments', 
        icon: FileText, 
        roles: ['USER'], 
        mobile: true, 
        desktop: true 
    },

    // --- ADMIN ---
    { 
        label: 'Dashboard', 
        path: '/admin/dashboard', 
        icon: LayoutDashboard, 
        roles: ['ADMIN'], 
        mobile: true, 
        desktop: true 
    },
    { 
        label: 'All Appts', 
        path: '/admin/appointments', 
        icon: ClipboardList, 
        roles: ['ADMIN'], 
        mobile: true, 
        desktop: true 
    },

    // --- SHARED / COMMON ---
    { 
        label: 'Profile', 
        path: '/profile', 
        icon: User, 
        roles: ['USER', 'ADMIN'], 
        mobile: true, 
        desktop: false // Usually in dropdown on desktop
    }
];

export const getNavItems = (user) => {
    const userRoles = user?.roles || ['GUEST'];
    // Admin check: if user has ROLE_ADMIN, they see ADMIN items + SHARED items
    // User check: if user has ROLE_USER, they see USER items + SHARED items
    // Guest check: if no user, they see GUEST items

    return NAV_ITEMS.filter(item => {
        const isGuest = !user;
        if (isGuest) return item.roles.includes('GUEST');

        // Check if item role matches any of user's roles
        // We handle simple 'USER'/'ADMIN' checks here. 
        // Logic: specific roles shouldn't see GUEST items usually, unless specified.
        const hasMatchingRole = item.roles.some(r => userRoles.some(ur => ur.includes(r)));
        return hasMatchingRole;
    });
};
