"use client";
import { Order } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TOrderStatus } from "@/lib/types";

type ordersToShow = Omit<TOrderStatus, "DISPUTED" >
type OrderStatusKeys = keyof ordersToShow;

const reducedOrderStatus: ordersToShow = {
    PENDING : "PENDING",
    PROCESSING: "PROCESSING",
    CANCELLED: "CANCELLED",
    DELIVERED: "DELIVERED",
};

export const Orders = ({ orders }: { orders: Order[] }) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatusKeys>("PENDING");
    console.log(orders)

    const handleStatusChange = (newStatus: string) => {
        if (Object.keys(reducedOrderStatus).includes(newStatus)) {
            setSelectedStatus(newStatus as OrderStatusKeys);
        }
    };

    const getOrdersByStatus = (status: OrderStatusKeys) => orders.filter(order => order.status === reducedOrderStatus[status])

    const ordersByStatus = {
        PENDING: getOrdersByStatus("PENDING"),
        PROCESSING: getOrdersByStatus("PROCESSING"),
        DELIVERED: getOrdersByStatus("DELIVERED"),
        CANCELLED: getOrdersByStatus("CANCELLED"),
    }

    const totalOrdersAmount = ordersByStatus[selectedStatus].reduce((totalAmount, order) => totalAmount + order.amount * order.quantity, 0);

    return (
        <Card className="p-4">
            <CardContent className="flex md:flex-row flex-col justify-between items-center">
                <h3 className="flex w-fit gap-2 p-3">
                    {<><span>{ordersByStatus[selectedStatus].length}</span> <span>(${totalOrdersAmount})</span></>}
                </h3>
                <Select onValueChange={handleStatusChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={selectedStatus} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.entries(reducedOrderStatus).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    );
};
