"use client"
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export const SellerNavbar = ({sellerId}: {sellerId : string}) => {
    const pathname = usePathname();

    const navItems = [
        { 
            name: 'Dashboard',
            path: '/seller_dashboard' 
        },{ 
            name: 'Gigs',
            path: `/seller_dashboard/gigs` 
        },{ 
            name: 'Orders',
            path: '/seller_dashboard/orders' 
        },{ 
            name: 'Profile',
            path: '/seller_dashboard/profile' 
        }
    ];

    return pathname.startsWith("/seller_dashboard") ? <nav className="bg-white ">
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.path}
                >
                    <Button variant={"ghost"}>{item.name}</Button>
                </Link>
            ))}
        </div>
    </nav> : null
};