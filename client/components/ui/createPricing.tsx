"use client"

import { useState, useCallback } from 'react';
import { PackageType, PricingPackageInput } from "@/lib/types";
import { toast } from "sonner";
import { useRecoilValue } from 'recoil';
import { gigform } from '@/lib/recoil/atoms';
import { createGig } from '@/app/actions/seller/gigs';
import { useRouter } from 'next/navigation';

export const CreatePricing = () => {
  const gig = useRecoilValue(gigform);
  const [pricingPackages, setPricingPackages] = useState<PricingPackageInput[]>([]);
  const router = useRouter();

  const handleAddPricingPackage = useCallback((newPackage: PricingPackageInput) => {
    setPricingPackages((prevPackages) => [...prevPackages, newPackage]);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(gig,pricingPackages)
      const res = await createGig({gig:gig , pkg : pricingPackages});
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
          <div key={index} className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="font-bold">{packageData.name}</h3>
            <p>{packageData.description}</p>
            <p>Price: ${packageData.price}</p>
            <p>Delivery Time: {packageData.deliveryTime} days</p>
            <p>Features: {packageData.features.join(', ')}</p>
          </div>
        ))}
        <PricingPackageForm onAdd={handleAddPricingPackage} />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Create Pricing Packages
        </button>
      </form>
    </div>
  );
};

const PricingPackageForm = ({ onAdd }: { onAdd: (pricingPkg: PricingPackageInput) => void }) => {
  const [packageData, setPackageData] = useState<PricingPackageInput>({
    packageType: PackageType.BASIC,
    name: '',
    description: '',
    price: "",
    deliveryTime: "",
    features: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPackageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(packageData);
    setPackageData({
      packageType: PackageType.BASIC,
      name: '',
      description: '',
      price: "",
      deliveryTime: "",
      features: []
    });
  };

  return (
    <div className="space-y-4">
      <select name="packageType" value={packageData.packageType} onChange={handleChange} className="w-full p-2 border rounded">
        <option value={PackageType.BASIC}>Basic</option>
        <option value={PackageType.STANDARD}>Standard</option>
        <option value={PackageType.PREMIUM}>Premium</option>
      </select>
      <input type="text" name="name" value={packageData.name} onChange={handleChange} placeholder="Package Name" required className="w-full p-2 border rounded" />
      <textarea name="description" value={packageData.description} onChange={handleChange} placeholder="Package Description" required className="w-full p-2 border rounded" />
      <input type="text" name="price" value={packageData.price} onChange={handleChange} placeholder="Price" required className="w-full p-2 border rounded" />
      <input type="text" name="deliveryTime" value={packageData.deliveryTime} onChange={handleChange} placeholder="Delivery Time (days)" required className="w-full p-2 border rounded" />
      <input type="text" name="features" value={packageData.features.join(', ')} onChange={(e) => setPackageData(prev => ({ ...prev, features: e.target.value.split(',').map(f => f.trim()) }))} placeholder="Features (comma-separated)" className="w-full p-2 border rounded" />
      <button onClick={handleAddPackage} type="button" className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors">Add Package</button>
    </div>
  );
};