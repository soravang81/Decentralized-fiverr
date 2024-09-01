"use client"
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { raiseDispute } from "@/app/actions/others/dispute";
import { toast } from "sonner";

export default function RaiseDispute({
    orderId
}:{
    orderId : string,
}) { // TODO : Send email to admin that new dispute occurs
    const [reason, setReason] = useState<string>("")

    const handleSubmit = async(e:any) => {
        e.preventDefault()
        try {
            await raiseDispute({
                orderId,
                reason : reason
            })
            toast.success("Dispute raised successfully")
        } catch (e) {
            console.error("Error raising dispute:", e);
            toast.error("An error occurred while raising dispute."+e);     
        }
    }
    return <Dialog>
        <DialogTrigger asChild>
            <Button>Raise Dispute</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogTitle>Raise Dispute</DialogTitle>
            <DialogDescription>
                <p className="mb-4">Please provide a reason for raising this dispute</p>
            </DialogDescription>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Reason"
                    onChange={(e) => setReason(e.target.value)}
                />
                <Button className="w-fit " disabled={!reason} type="submit">Submit</Button>
            </form>
        </DialogContent>
    </Dialog>
}