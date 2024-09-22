"use client"
import React, { useState } from 'react';
import { deleteGig } from '@/app/actions/seller/gigs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CreateGig } from './createGig';
import { IGetGigs } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import CreatePricingPage from '@/app/seller_dashboard/gigs/(create)/create-pricing/page';
import { editPricingPackage } from '@/app/actions/seller/pricingPackage';
import { toast } from 'sonner';
import { Trash, Trash2 } from 'lucide-react'; // Add this import
import { ScrollArea } from "./ui/scroll-area";

export const GigList = ({ gigs }: { gigs: IGetGigs[] }) => {
  const [selectedGigIds, setSelectedGigIds] = useState<string[]>([]);
  const [editingGig, setEditingGig] = useState<IGetGigs | null>(null);

  const handleDelete = async (gigId: string) => {
    const res = await deleteGig([gigId]);
    if (res) window.location.reload();
  };

  const handleCheckboxChange = (gigId: string) => {
    setSelectedGigIds((prev) =>
      prev.includes(gigId) ? prev.filter((id) => id !== gigId) : [...prev, gigId]
    );
  };

  return (
    <div className="container bg-background/40 rounded-xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <Button
          variant={"destructive"}
          onClick={() => handleDelete(selectedGigIds[0])}
          disabled={selectedGigIds.length === 0}
          className={`px-4 py-2 rounded w-full sm:w-auto hidden sm:block ${
            selectedGigIds.length > 0
              ? "text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Delete Selected ({selectedGigIds.length})
        </Button>
      </div>
      <div className="space-y-4 overflow-y-auto p-4">
        {gigs.map((gig) => (
          <div key={gig.id} className="rounded-lg shadow-md border overflow-hidden relative">
            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex sm:items-center items-start gap-4 w-full sm:flex-row flex-col sm:w-auto">
                <input
                  type="checkbox"
                  checked={selectedGigIds.includes(gig.id)}
                  onChange={() => handleCheckboxChange(gig.id)}
                  className="form-checkbox sm:h-5 sm:w-5 h-3 w-3 text-blue-600 hidden sm:block"
                />
                <div className="relative w-full sm:w-24 sm:h-20 aspect-video sm:aspect-square flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={gig.picture || ""}
                    alt={gig.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <h3 className="font-bold text-base sm:text-lg">{gig.title}</h3>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="px-3 py-1 rounded w-full sm:w-auto"
                    onClick={() => setEditingGig(gig)}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh]">
                  <ScrollArea className="h-[80vh] pr-4">
                    <Tabs defaultValue="Gig" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="Gig">Gig</TabsTrigger>
                        <TabsTrigger value="pricing">Pricings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="Gig">          
                        <DialogHeader>
                          <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <CreateGig gig={editingGig as IGetGigs} />
                      </TabsContent>
                      <TabsContent value="pricing">
                        <EditPricing pricing={editingGig?.pricing || []}/>
                      </TabsContent>
                    </Tabs>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <button
              className="absolute top-2 right-2 p-2 rounded-full z-10 sm:hidden transition-all duration-300 hover:scale-105 hover:text-red-500"
              onClick={() => handleDelete(gig.id)}
            >
              <Trash size={20} className='hover:scale-110'/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditPricing = ({ pricing }: { pricing: IGetGigs["pricing"] }) => {
  const [selectedPricing, setSelectedPricing] = useState(pricing[0].id);
  const [pricings, setPricings] = useState(
    pricing.map(p => ({
      ...p,
      featuresString: p.features.join(", ")
    }))
  );

  const handleChange = (index: number, newPricing: typeof pricings[number]) => {
    setPricings((prev) => {
      return prev.map((p, i) => {
        if (i === index) {
          return newPricing;
        }
        return p;
      });
    });
  };

  const handleUpdate = async () => {
    const updatedPricing = pricings.find(p => p.id === selectedPricing);
    if (updatedPricing) {
      try {
        console.log(updatedPricing);
        await editPricingPackage({...updatedPricing, features: updatedPricing.featuresString.split(",")});
        toast.success("Pricing package updated successfully");
      } catch (e) {
        toast.error("Error updating pricing package");
        console.error(e);
      }
    }
  };

  return (
    <Tabs value={selectedPricing} className=''>
      <TabsList className='w-full'>
        {pricings.map((pricing) => (
          <TabsTrigger key={pricing.id} value={pricing.id} className='w-full'>
            {pricing.name.charAt(0).toUpperCase() + pricing.name.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedPricing}>
        {pricings.map((pricing, index) => (
          <div key={pricing.id} className="flex flex-col gap-4">
            <Label>Name</Label>
            <Input value={pricing.name} onChange={(e) => handleChange(index, { ...pricing, name: e.target.value })} />
            <Label>Price</Label>
            <Input value={pricing.price} type="number" onChange={(e) => handleChange(index, { ...pricing, price: Number(e.target.value) })} />
            <Label>Delivery Time</Label>
            <Input value={pricing.deliveryTime} type="number" onChange={(e) => handleChange(index, { ...pricing, deliveryTime: Number(e.target.value) })} />
            <Label>Features</Label>
            <Input 
              value={pricing.featuresString} 
              onChange={(e) => handleChange(index, { ...pricing, featuresString: e.target.value })} 
            />
            <Button 
              className="space-y-0 "
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  )
}
