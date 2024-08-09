"use client"
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function PersonalInfo () {
    const [name , setName] = useState<string>()
    const [profilePic , setProfilePic] = useState<string>();
    const [description , setDescription] = useState<string>();
    return(
        <form className="flex flex-col gap-10">
            <div className="border-b border-slate-300 pb-10">
                <h1 className="text-4xl my-5 font-bold text-slate-600">Personal Info</h1>
                <h3 className="text-sm text-slate-600 max-w-[40rem]">Tell us a bit about yourself. This information will appear on your public profile, so that potential buyers can get to know you better.</h3>
            </div>
            <div className="flex flex-col gap-20">
                <div className="flex gap-20 items-center ">
                    <Label 
                        htmlFor="name"
                        className="text-lg font-normal text-slate-600"
                    >Display name<span className="text-red-600 ">*</span></Label>
                    <Input 
                        required
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="max-w-72"
                    >
                    </Input>
                </div>
                <div className="flex gap-20 items-center ">
                    <Label 
                        htmlFor="pic"
                        className="text-lg font-normal text-slate-600"
                    >Profile pic<span className="text-red-600">*</span></Label>
                    <Input 
                        required
                        id="pic"
                        value={profilePic}
                        type="file"
                        onChange={e => setProfilePic(e.target.value)}
                        className="max-w-72"
                    >
                    </Input>
                </div>
                <div className="flex gap-20 items-center ">
                    <Label 
                        htmlFor="description"
                        className="text-lg font-normal text-slate-600"
                    >Description<span className="text-red-600" >*</span></Label>
                    <Input 
                        required
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="max-w-72"
                    >
                    </Input>
                </div>
            </div>
        </form>
    )   
}