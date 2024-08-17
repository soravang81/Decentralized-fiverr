"use client"
import { Gig } from '@prisma/client';
import React, { useState } from 'react';
import Image from 'next/image';
import { deleteGig } from '@/app/actions/seller/gigs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CreateGig } from './createGig';

export const GigList = ({ gigs }:{gigs : Gig[]}) => {
  const [selectedGigs, setSelectedGigs] = useState<string[]>([]);
  const [editingGig, setEditingGig] = useState<Gig | null>(null);

  const handleCheckboxChange = (gigId: string) => {
    setSelectedGigs(prev => 
      prev.includes(gigId) 
        ? prev.filter(id => id !== gigId)
        : [...prev, gigId]
    );
  };

  const handleDelete = async () => {
    console.log('Delete gigs', selectedGigs);
    const res = await deleteGig(selectedGigs)
    if (res) window.location.reload();
    setSelectedGigs([]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Gigs</h2>
        <button 
          onClick={handleDelete}
          disabled={selectedGigs.length === 0}
          className={`px-4 py-2 rounded ${
            selectedGigs.length > 0 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Delete Selected ({selectedGigs.length})
        </button>
      </div>
      <div className="space-y-4 overflow-y-auto p-4">
        {gigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-lg shadow-md border overflow-hidden flex">
            
            <div className="px-6 flex-grow flex items-center justify-between">
                <div className='flex items-center p-4 gap-6'>
                    <input
                        type="checkbox"
                        checked={selectedGigs.includes(gig.id)}
                        onChange={() => handleCheckboxChange(gig.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 mr-4"
                    />
                    <div className="relative w-24 h-20 flex-shrink-0 flex items-center justify-center">
                        <img
                            src={gig.picture || ""} 
                            alt={gig.title}
                            className='w-[80%] h-[80%] rounded-md border'
                        />
                    </div>
                    <h3 className="font-bold text-lg">{gig.title}</h3>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => setEditingGig(gig)}
                    >
                      Edit
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Gig</DialogTitle>
                    </DialogHeader>
                    <CreateGig gig={editingGig as Gig} />
                  </DialogContent>
                </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};