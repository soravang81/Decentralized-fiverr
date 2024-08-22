"use client"

import { useState, FormEvent, useMemo } from "react";
import { CustomSelect, SellerFormInput } from "./inputs";
import { Button } from "./ui/button"; 
import { Category, CategoryReadable, Niche, nicheMappings, NicheReadable, SubNiche, SubNicheReadable } from "@/lib/niches";
import { createSellerProfile } from "@/app/actions/seller/sellerProfile";
import { CreateSellerProfileInput } from "@/lib/types";
import { Session } from "next-auth";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { PublicKey } from "@solana/web3.js";

export const PersonalInfo: React.FC<{session: Session | null}> = ({ session }) => {
  const [name, setName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Category| Category | null>(null);
  const [niche, setNiche] = useState<Niche | null>(null);
  const [subNiche, setSubNiche] = useState<SubNiche[]>([]);
  const [currentSubNiche, setCurrentSubNiche] = useState<SubNiche | null>(null);
  const [personalWebsite, setPersonalWebsite] = useState<string>("");
  const [institute, setInstitute] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<PublicKey | string>("");
  const [number, setNumber] = useState<number | string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [course, setCourse] = useState<string>("");

  if (!session) {
    toast.error("Please login first !");
    return null;
  }

  const selectedCategoryMapping = nicheMappings.find(mapping => mapping.category === category);

  const currentYear = new Date().getFullYear();

  const startYears = useMemo(
    () => Array.from({ length: 40 }, (_, index) => (currentYear - index).toString()),
    [currentYear]
  );

  const availableEndYears = useMemo(() => {
    if (!startYear) return [];
    const startYearNum = parseInt(startYear, 10);
    const maxEndYear = Math.max(startYearNum + 5);
    return Array.from(
      { length: maxEndYear - startYearNum + 1 },
      (_, index) => (startYearNum + index).toString()
    );
  }, [startYear, currentYear]);

  const handleAddSubNiche = () => {
    if (currentSubNiche && !subNiche.includes(currentSubNiche)) {
      setSubNiche([...subNiche, currentSubNiche]);
      setCurrentSubNiche(null);
    }
  };
  const handleRemoveSubNiche = (nicheToRemove: SubNiche) => {
    setSubNiche(subNiche.filter(n => n !== nicheToRemove));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newprofilePic = "";
    const data: CreateSellerProfileInput = {
      userId: session.user.id,
      name,
      profilePicture: newprofilePic,
      description,
      subNiche,
      personalWebsite,
      institute,
      wallet: walletAddress,
      phoneNumber: number as string,
      startDate: parseInt(startYear),
      endDate: parseInt(endYear),
      course
    };
    const res = await createSellerProfile(data);
    if (res) {
      toast.success("Profile created successfully");
      setName("");
      setProfilePic(null);
      setDescription("");
      setCategory(null);
      setNiche(null);
      setSubNiche([]);
      setPersonalWebsite("");
      setInstitute("");
      setNumber("");
      setStartYear("");
      setEndYear("");
      setCourse("");
      window.location.href = "/seller_dashboard";
    } else {
      toast.error("Failed to create profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="border-y border-slate-300 py-12 flex flex-col gap-4">
        <h1 className="text-4xl  font-bold text-slate-600">Personal Info</h1>
        <h3 className="text-sm text-slate-600 max-w-[40rem]">
          Tell us a bit about yourself. This information will appear on your public profile,
          so that potential buyers can get to know you better.
        </h3>
      </div>
      <div className="flex flex-col gap-20 px-10">
        <SellerFormInput
          label="Display name"
          required={true}
          onChange={(value) => setName(value as string)}
          value={name}
          id="name"
        />
        <SellerFormInput
          label="Profile pic"
          required={true}
          onChange={(value) => setProfilePic(value as File | null)}
          value={profilePic}
          id="pic"
          type="file"
        />
        <SellerFormInput
          label="Description"
          required={true}
          onChange={(value) => setDescription(value as string)}
          value={description}
          id="description"
        />
        <SellerFormInput
          label="Wallet Public Key (it will be used to receive money)"
          required={true}
          onChange={(value) => setWalletAddress(value as PublicKey)}
          value={walletAddress}
          id="walletAddress"
        />
      </div>

      <div className="border-y border-slate-300 py-12 flex flex-col gap-4">
        <h1 className="text-4xl  font-bold text-slate-600">Professional Info</h1>
        <h3 className="text-sm text-slate-600 max-w-[40rem]">
          This is your time to shine. Let potential buyers know what you do best and how you gained your skills, certifications and experience.
        </h3>
      </div>
      <div className="flex flex-col gap-20 px-10">
        {CustomSelect(
          "category",
          "Skill Category",
          category || "",
          (value: string) => {
            setCategory(value as Category);
            setNiche(null);
            setCurrentSubNiche(null);
          },
          Object.values(Category),
          "Select a Category"
        )}
        {CustomSelect(
          "niche",
          "Niche",
          niche || "",
          (value: string) => {
            setNiche(value as Niche);
            setCurrentSubNiche(null);
          },
          selectedCategoryMapping ? Object.keys(selectedCategoryMapping.niches) as Niche[] : [],
          "Select a Niche",
          !category
        )}
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
          <Button type="button" onClick={handleAddSubNiche} disabled={!currentSubNiche}>
            Add Sub Niche
          </Button>
          <div className="flex flex-wrap gap-2">
            {subNiche.map((niche, index) => (
              <div key={index} className="bg-gray-200 px-2 py-1 rounded-full flex items-center">
                <span>{niche}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubNiche(niche)}
                  className="ml-2 text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <SellerFormInput
          label="Personal Website"
          required={false}
          onChange={(value) => setPersonalWebsite(value as string)}
          value={personalWebsite}
          id="personalWebsite"
        />
        <SellerFormInput
          label="Course"
          required={false}
          onChange={(value) => setCourse(value as string)}
          value={course}
          id="course"
        />
        <SellerFormInput
          label="Institute"
          required={false}
          onChange={(value) => setInstitute(value as string)}
          value={institute}
          id="institute"
        />
        <div className="flex gap-6">
          {CustomSelect(
            "startYear",
            "Start Year",
            startYear,
            (value) => {
              setStartYear(value);
              setEndYear("");
            },
            startYears,
            "Start year"
          )}
          {CustomSelect(
            "endYear",
            "End Year",
            endYear,
            setEndYear,
            availableEndYears,
            "End year"
          )}
        </div>
      </div>

      <div className="border-y border-slate-300 py-12 flex flex-col gap-4">
        <h1 className="text-4xl  font-bold text-slate-600">Account Security</h1>
        <h3 className="text-sm text-slate-600 max-w-[40rem]">
          Trust and safety is a big deal in our community. Please verify your email and phone number so that we can keep your account secured.
        </h3>
      </div>
      <div className="flex flex-col gap-20 px-10">
        {/* <SellerFormInput label="email" required={false} onChange={(value) => setEmail(value as string)} value={email} id="email" /> */}
        <SellerFormInput
          label="Phone Number"
          type="number"
          required={false}
          onChange={(value) => setNumber(value as number)}
          value={number}
          id="number"
        />
      </div>
      <Button className="w-40 m-10" type="submit">
        Create profile
      </Button>
    </form>
  );
};

