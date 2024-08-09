"use client"

import { MessageCircleOff, Trash, UserX } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,} from "./ui/alert-dialog";
import { currentRole, isDialog } from "@/lib/recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";
import { getSellerProfileImage } from "@/app/actions/seller/sellerProfile";

const handleClick = async(action: string) => {

};

export function ProfileMenu({session}:{session : Session }) {
  const [isDialogOpen, setIsDialogOpen] = useRecoilState(isDialog);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [image, setImage] = useState<string | undefined>(session.user.image);
  const role = useRecoilValue(currentRole);

  const newImage = async () => { // to update the image when role is changed
    console.log(role  , " " , session)
    if (role === "SELLER") {
      console.log("inside ! buyerr")
      const img = await getSellerProfileImage(session.user.id);
      console.log(img)
      img && setImage(img ?? session.user.image ?? "");
    }
    else {
      console.log("elsesession",session)
      setImage(session.user.image)
    }
  };

  useEffect(() => {
    newImage();
  }, [role, image]);

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
          <Avatar>
            <AvatarImage src={image} alt="user" onClick={() => setDropdownOpen(!dropdownOpen)}/>
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
