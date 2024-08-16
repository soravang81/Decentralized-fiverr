"use client"
import { Gig } from '@prisma/client';
import React, { useState } from 'react';
import Image from 'next/image';

interface GigListProps {
  gigs: Gig[]
}

const GigList: React.FC<GigListProps> = ({ gigs }) => {
  const [selectedGigs, setSelectedGigs] = useState<string[]>([]);

  const handleCheckboxChange = (gigId: string) => {
    setSelectedGigs(prev => 
      prev.includes(gigId) 
        ? prev.filter(id => id !== gigId)
        : [...prev, gigId]
    );
  };

  const handleDelete = () => {
    console.log('Delete gigs', selectedGigs);
    // Implement delete functionality here
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
      <div className="space-y-4">
        {gigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
            
            <div className="p-4 flex-grow flex items-center justify-between">
                <div className='flex items-center'>
                    <input
                        type="checkbox"
                        checked={selectedGigs.includes(gig.id)}
                        onChange={() => handleCheckboxChange(gig.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 mr-4"
                    />
                    <div className="relative w-28 h-24 flex-shrink-0">
                        <Image
                            src={gig.picture || ""} // Replace with actual image URL or use a placeholder
                            alt={gig.title}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <h3 className="font-bold text-lg">{gig.title}</h3>
                </div>
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {/* Implement edit functionality */}}
                >
                  Edit
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GigList;