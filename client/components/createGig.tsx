"use client"

import { createGig, editGig } from '@/app/actions/seller/gigs'
import { PlusCircle, X, Upload } from 'lucide-react'
import { toast } from "sonner";
import { Category, Niche, nicheMappings, SubNiche, CategoryReadable, NicheReadable, SubNicheReadable } from "@/lib/niches";
import { useState, useRef, useEffect } from 'react';
import { uploadImage } from '@/lib/firebase/image';
import { useRecoilState } from 'recoil';
import { gigform, gigimage } from '@/lib/recoil/atoms';
import { useRouter } from 'next/navigation';
import { IGetGigs } from '@/lib/types';
import { Button } from './ui/button';

export const CreateGig = ({ gig }: { gig?: IGetGigs }) => {
  const [formData, setFormData] = useRecoilState(gigform)
  const [category, setCategory] = useState<Category | null>(null)
  const [niche, setNiche] = useState<Niche | null>(null)
  const [currentSubNiche, setCurrentSubNiche] = useState<SubNiche | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useRecoilState(gigimage);

  const router = useRouter();
  const selectedCategoryMapping = nicheMappings.find(mapping => mapping.category === category)

  useEffect(() => {
    if (gig) {
      setFormData({
        title: gig.title || '',
        description: gig.description || '',
        category: gig.category as Category || '' as Category,
        niche: gig.niche as Niche || '' as Niche,
        picture: gig.picture || "",
        subNiche: gig.subNiche as SubNiche || "" as SubNiche,
        tags: gig.tags || [],
      });
    }
  }, [gig, setFormData]);

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
    setFormData(prev => ({ ...prev, niche: "" as Niche, subNiche: "" as SubNiche }))
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

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if(!imageFile) return;
      const imageUrl = await uploadImage(imageFile)
      const gigData = {
        ...formData,
        picture: imageUrl,
      };
      if (gig) {
        const res = await editGig({ gig: gigData, gigId: gig.id });
        res && toast.success('Gig updated successfully!');
        router.refresh()
      }
      else {
        localStorage.setItem('gigFormData', JSON.stringify(gigData));
        localStorage.setItem('gigImagePreview', imagePreview || '');
        router.push("/seller_dashboard/gigs/create-pricing");
      }
    } catch (error) {
      console.error("Error submitting gig:", error);
      toast.error('Failed to save gig. Please try again.');
    }
  };

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
      <label htmlFor={id} className="text-sm font-medium ">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300  py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    <div className="container mx-auto p-4 text-foreground">
      <h1 className="text-2xl font-bold mb-4">{!gig ? "Create new gig" : "Update gig"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium ">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="i will ..."
            value={formData.title}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300  py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium ">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-md border border-gray-300  py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium ">Gig Image</label>
          <div className={`flex items-center ${gig ? "justify-center" : "justify-start"} w-full`}>
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-96 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
        <div className="space-y-4">
          {CustomSelect("category", "Skill Category", gig ? gig.category : formData.category || "", handleCategoryChange, Object.values(Category), formData.category ?? "Select a Category")}
          {CustomSelect("niche", "Niche", gig ? gig.niche : formData.niche || "", handleNicheChange, selectedCategoryMapping ? Object.keys(selectedCategoryMapping.niches) as Niche[] : [], formData.niche === "" as Niche ? "Select a Niche" : formData.niche, gig ? !gig.category : !formData.category)}
          <div className="flex items-center gap-4">
            {CustomSelect(
              "currentSubNiche",
              "Sub Niche",
              gig ? gig.subNiche : currentSubNiche || "",
              (value: string) => setCurrentSubNiche(value as SubNiche),
              selectedCategoryMapping && niche ? selectedCategoryMapping.niches[niche] || [] : [],
              formData.subNiche === "" as SubNiche ? "Select a SubNiche" : formData.niche,
              gig ? !gig.niche : !formData.niche
            )}
            <button
              type="button"
              onClick={handleAddSubNiche}
              disabled={!currentSubNiche}
              className="px-4 py-2 bg-blue-500 self-end  rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
          {formData.subNiche && (
            <div className="border px-2 py-1 rounded-full inline-flex items-center">
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
          <label htmlFor="tags" className="text-sm font-medium ">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300  py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Separate tags with commas"
          />
        </div>
        <Button
          type={"submit"}
          className="w-full px-4 py-2  "
        >
          {gig ? "Update" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
