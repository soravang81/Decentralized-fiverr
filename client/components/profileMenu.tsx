"use client"

import { MessageCircleOff, Trash, UserX } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,} from "./ui/alert-dialog";
import { isDialog } from "@/lib/recoil/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import { useUserImage } from "@/lib/recoil/selector";

const handleClick = async(action: string) => {

};

export function ProfileMenu({session, }:{session : Session }) {
  const [isDialogOpen, setIsDialogOpen] = useRecoilState(isDialog);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const img = useUserImage();

  console.log(img)
  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleItemClick = (action: string) => {
    handleDropdownClose();
    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex items-center">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="border">
            {img && <AvatarImage src={img} alt="user" onClick={() => setDropdownOpen(!dropdownOpen)}/>}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 self-start flex flex-col">
          <DropdownMenuItem className="p-0" onClick={() => handleItemClick("Unfriend")}>
            <Button variant="ghost" className="w-full h-full flex gap-3 justify-start">
              <UserX size={22} />Unfriend
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0" onClick={() => handleItemClick("Block")}>
            <Button variant="ghost" className="w-full h-full flex gap-3 justify-start">
              <MessageCircleOff size={22} />Block
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0" onClick={() => handleItemClick("Clear chat")}>
            <Button variant="ghost" className="w-full h-full flex gap-3 justify-start">
              <Trash size={22} />
              Clear chat
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Trigger Alert</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to {selectedAction}?</AlertDialogTitle>
            <AlertDialogDescription>
               This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleClick(selectedAction);
                setIsDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
