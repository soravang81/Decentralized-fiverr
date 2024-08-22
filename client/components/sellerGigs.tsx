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
export const GigList = ({ gigs }: { gigs: IGetGigs[] }) => {
  const [selectedGigIds, setSelectedGigIds] = useState<string[]>([]);
  const [editingGig, setEditingGig] = useState<IGetGigs | null>(null);

  const handleDelete = async () => {
    const res = await deleteGig(selectedGigIds);
    if (res) window.location.reload();
    setSelectedGigIds([]);
  };

  const handleCheckboxChange = (gigId: string) => {
    setSelectedGigIds((prev) =>
      prev.includes(gigId) ? prev.filter((id) => id !== gigId) : [...prev, gigId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Gigs</h2>
        <Button
          variant={"destructive"}
          onClick={handleDelete}
          disabled={selectedGigIds.length === 0}
          className={`px-4 py-2 rounded ${
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
          <div key={gig.id} className="bg-white rounded-lg shadow-md border overflow-hidden flex">
            <div className="px-6 flex-grow flex items-center justify-between">
              <div className="flex items-center p-4 gap-6">
                <input
                  type="checkbox"
                  checked={selectedGigIds.includes(gig.id)}
                  onChange={() => handleCheckboxChange(gig.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 mr-4"
                />
                <div className="relative w-24 h-20 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={gig.picture || ""}
                    alt={gig.title}
                    className="w-[80%] h-[80%] rounded-md border"
                  />
                </div>
                <h3 className="font-bold text-lg">{gig.title}</h3>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                     className="text-white px-3 py-1 rounded"
                    onClick={() => setEditingGig(gig)}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] flex justify-center overflow-y-scroll">
                    <Tabs defaultValue="Gig" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="Gig">Gig</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                      </TabsList>
                      <TabsContent value="Gig">          
                        <DialogHeader>
                        <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <CreateGig gig={editingGig as IGetGigs} />
                      </TabsContent>
                      <TabsContent value="password">
                        <Card>
                          <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                              Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="space-y-1">
                              <Label htmlFor="current">Current password</Label>
                              <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="new">New password</Label>
                              <Input id="new" type="password" />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button>Save password</Button>
                          </CardFooter>
                        </Card>
                      </TabsContent>
                    </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

