"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} passHref>
            <motion.div
                className={`relative overflow-hidden group px-4 py-2 rounded-md cursor-pointer ${
                    isActive ? 'text-foreground' : 'text-foreground'
                } transition-colors duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative z-10">{children}</span>
                <span className={`absolute inset-0 bg-foreground/30 opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-md ${
                    isActive ? 'scale-x-100' : ''
                }`} />
            </motion.div>
        </Link>
    )
}

export const SellerNavbar: React.FC = () => {
    const navItems = [
        { name: 'Dashboard', path: '/seller_dashboard' },
        { name: 'Gigs', path: `/seller_dashboard/gigs` },
        { name: 'Orders', path: '/seller_dashboard/orders' },
        { name: 'Messages', path: '/seller_dashboard/messages' }
    ];
    
    const pathname = usePathname();
    return pathname.startsWith("/seller_dashboard") ? (
        <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
                <NavLink key={item.name} href={item.path}>
                    {item.name}
                </NavLink>
            ))}
        </nav>
    ) : null
};

export const BuyerNavbar: React.FC = () => {
    const navItems = [
        { name: 'Orders', path: '/orders' },
        { name: 'Messages', path: '/messages' }
    ];
    
    const pathname = usePathname();
    return !(pathname.startsWith("/seller_dashboard") || pathname.startsWith("/admin") || pathname === "/") ? (
        <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
                <NavLink key={item.name} href={item.path}>
                    {item.name}
                </NavLink>
            ))}
        </nav>
    ) : null
}
