"use client"

import { createGig } from '@/app/actions/seller/gigs'
import { PlusCircle, X } from 'lucide-react'
import { CreateGigInput } from "@/lib/types";
import { toast } from "sonner";
import { Category, Niche, nicheMappings, SubNiche , CategoryReadable , NicheReadable , SubNicheReadable } from "@/lib/niches";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from 'react';

export const CreateGigButton = ({ sellerId }:{sellerId : string}) => {
    const [formData, setFormData] = useState<CreateGigInput>({
      sellerId,
      title: '',
      description: '',
      category: '' as Category,
      niche: '' as Niche,
      picture : "",
      subNiche:  "" as SubNiche,
      tags: [],
    })
  
    const [category, setCategory] = useState<Category | null>(null)
    const [niche, setNiche] = useState<Niche | null>(null)
    const [currentSubNiche, setCurrentSubNiche] = useState<SubNiche | null>(null)
  
    const selectedCategoryMapping = nicheMappings.find(mapping => mapping.category === category)
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData(prevState => ({
        ...prevState,
        [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value
      }))
    }
  
    const handleCategoryChange = (value: string) => {
      setCategory(value as Category)
      setFormData(prevState => ({
        ...prevState,
        category: value as Category,
        niche: '' as Niche,
        subNiche: "" as SubNiche,
      }))
      setNiche(null)
    }
    
    const handleNicheChange = (value: string) => {
      setNiche(value as Niche)
      setFormData(prevState => ({
        ...prevState,
        niche: value as Niche,
        subNiche: "" as SubNiche
      }))
    }
  
    const handleAddSubNiche = () => {
      if (currentSubNiche) {
        setFormData(prevState => ({
          ...prevState,
          subNiche: currentSubNiche
        }))
      }
    }
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const gigId = await createGig(formData);
            toast.success('Gig created successfully!');
            // Reset form or redirect
            // router.push(`/gigs/${gigId}`);
        } catch (error) {
            console.error("Error submitting gig:", error);
            toast.error('Failed to create gig. Please try again.');
        }
    }
  
    const CustomSelect = (
      id: string,
      label: string,
      value: string,
      onChange: (value: string) => void,
      options: string[],
      placeholder: string,
      disabled: boolean = false
    ) => (
      <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option in CategoryReadable ? CategoryReadable[option as keyof typeof CategoryReadable] :
               option in NicheReadable ? NicheReadable[option as keyof typeof NicheReadable] :
               option in SubNicheReadable ? SubNicheReadable[option as keyof typeof SubNicheReadable] :
               option}
            </option>
          ))}
        </select>
      </div>
    )
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
            <PlusCircle size={20} />
            Create New Gig
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create New Gig</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="i will ..."
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-4">
              {CustomSelect("category", "Skill Category", category || "", handleCategoryChange, Object.values(Category), "Select a Category")}
              {CustomSelect("niche", "Niche", niche || "", handleNicheChange, selectedCategoryMapping ? Object.keys(selectedCategoryMapping.niches) as Niche[] : [], "Select a Niche", !category)}
              <div className="flex items-center gap-4">
                {CustomSelect(
                  "currentSubNiche",
                  "Sub Niche",
                  currentSubNiche || "",
                  (value: string) => setCurrentSubNiche(value as SubNiche),
                  selectedCategoryMapping && niche ? selectedCategoryMapping.niches[niche] || [] : [],
                  "Select a SubNiche",
                  !niche
                )}
                <button
                  type="button"
                  onClick={handleAddSubNiche}
                  disabled={!currentSubNiche}
                  className="px-4 py-2 bg-blue-500 self-end text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Set
                </button>
              </div>
              {formData.subNiche && (
                <div className="bg-gray-200 px-2 py-1 rounded-full inline-flex items-center">
                  <span>{SubNicheReadable[formData.subNiche as keyof typeof SubNicheReadable]}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, subNiche: '' as SubNiche }))}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Separate tags with commas"
              />
            </div>
            <DialogFooter>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Create Gig
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }