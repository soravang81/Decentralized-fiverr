"use client"

import { useState, useCallback, useEffect } from 'react';
import { CreateGigInput, CreatePricingPackageInput, IGetGigs, PackageType, PricingPackageInput,  } from "@/lib/types";
import { toast } from "sonner";
import { useRecoilValue } from 'recoil';
import { gigform } from '@/lib/recoil/atoms';
import { createGig } from '@/app/actions/seller/gigs';
import { useRouter } from 'next/navigation';

export const CreatePricing = () => {
  const gig = useRecoilValue(gigform);
  const [pricingPackages, setPricingPackages] = useState<CreatePricingPackageInput[]>([]);
  const [formData, setFormData] = useState<Omit<CreateGigInput, "sellerId">>();
  const [imagePreview, setImagePreview] = useState<string>('');
  const router = useRouter();

  const handleAddPricingPackage = useCallback((newPackage: CreatePricingPackageInput) => {
    setPricingPackages((prevPackages) => [...prevPackages, newPackage]);
  }, []);

  const handleDeletePricingPackages = useCallback(() => {
    setPricingPackages([]);
  }, []);

  useEffect(() => {
    const savedFormData = localStorage.getItem('gigFormData');
    const savedImagePreview = localStorage.getItem('gigImagePreview');
    
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    if (savedImagePreview) {
      setImagePreview(savedImagePreview);
    }
    
    // Clear the localStorage after retrieving the data
    // localStorage.removeItem('gigFormData');
    // localStorage.removeItem('gigImagePreview');
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(gig,pricingPackages)

      const gigData = {
        gig : formData,
        pricingPackages: pricingPackages
      };
      if(!formData) return toast.error("Please fill all the fields");

        const res = await createGig({gig: formData , pkg : pricingPackages});
      if (res) {
        toast.success('Gig and pricing packages created successfully!');
        router.push(`/seller_dashboard/gigs`);
      } else {
        toast.error('Failed to create gig and pricing packages.');
      }
    } catch (error) {
      console.error('Error creating gig and pricing packages:', error);
      toast.error('An error occurred while creating the gig and pricing packages.');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Pricing Packages</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {pricingPackages.map((packageData, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md mb-4 flex justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold">{packageData.name}</h3>
              <p>{packageData.description}</p>
              <p>Price: ${packageData.price}</p>
              <p>Delivery Time: {packageData.deliveryTime} days</p>
              <p>Features: {packageData.features.join(', ')}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPricingPackages((prevPackages) => prevPackages.filter((_, i) => i !== index));
              }}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        <PricingPackageForm onAdd={handleAddPricingPackage} />
        <button
          type="button"
          onClick={handleDeletePricingPackages}
          className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
        >
          Empty Pricing Packages
        </button>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Create Pricing Packages
        </button>
      </form>
    </div>
  );
};

const PricingPackageForm = ({ onAdd }: { onAdd: (pricingPkg: Omit<CreatePricingPackageInput , "gigId">) => void }) => {
  const [packageData, setPackageData] = useState<Omit<CreatePricingPackageInput , "gigId"> & { featuresString: string }>({
    name: '',
    description: '',
    price: "",
    deliveryTime: "",
    features: [],
    featuresString: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPackageData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'deliveryTime' ? Number(value) : value
    }));
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    const features = packageData.featuresString.split(',').map(f => f.trim()).filter(Boolean);
    onAdd({ ...packageData, features });
    setPackageData({
      name: '',
      description: '',
      price: "",
      deliveryTime: "",
      features: [],
      featuresString: ''
    });
  };

  return (
    <div className="space-y-4">
      <input name="name" value={packageData.name} onChange={handleChange} placeholder="Package Name"  className="w-full p-2 border rounded" />
      <textarea name="description" value={packageData.description} onChange={handleChange} placeholder="Package Description"  className="w-full p-2 border rounded" />
      <input name="price" value={packageData.price} onChange={handleChange} placeholder="Price"  className="w-full p-2 border rounded" />
      <input name="deliveryTime" value={packageData.deliveryTime} onChange={handleChange} placeholder="Delivery Time (days)"  className="w-full p-2 border rounded" />
      <input
        name="featuresString"
        value={packageData.featuresString}
        onChange={handleChange}
        placeholder="Features (comma-separated)"
        className="w-full p-2 border rounded"
      />  
      <button onClick={handleAddPackage} type="button" className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors">Add Package</button>
    </div>
  );
};
