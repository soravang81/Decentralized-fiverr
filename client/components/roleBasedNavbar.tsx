"use client"
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export const SellerNavbar = () => {

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
    
    const pathname = usePathname();
    return pathname.startsWith("/seller_dashboard") ? (
        <nav className="bg-white ">
            <div className="items-center flex sm:space-x-8">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                    >
                        <Button variant={"ghost"}>{item.name}</Button>
                    </Link>
                ))}
            </div>
        </nav>
    ) : null
};
export const BuyerNavbar = () => {

    const navItems = [
        { 
            name: 'Orders',
            path: '/orders' 
        }
    ];
    
    const pathname = usePathname();
    console.log(pathname)
    return !pathname.startsWith("/seller_dashboard") ? (
        <nav className="bg-white flex items-center">
            <div className="sm:ml-6 flex items-center sm:space-x-8">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                    >
                        <Button variant={"ghost"}>{item.name}</Button>
                    </Link>
                ))}
            </div>
        </nav>
    ) : null
}