"use client"

import { getSellerProfileImage } from '@/app/actions/seller/sellerProfile';
import { getSession, useSession } from 'next-auth/react';
import { atom, selector, useRecoilCallback, useRecoilValue } from 'recoil';
import { currentImage, currentRole } from './atoms';
import { getServerSession, Session } from 'next-auth';
import { authConfig } from '../auth';
import { useEffect } from 'react';
import { getLastRole } from '@/app/actions/buyer/role';
import { getImage } from '@/app/actions/image';
  
export const imageState = atom<string>({
  key: 'imageState',
  default: "",
});

export const imageSelector = selector({
  key: 'imageSelector',
  get: ({ get }) => get(imageState),
  set: ({ set }, newImage) => {
    newImage && set(imageState, newImage);
  },
});

export function useUserImage() {
  const image = useRecoilValue(imageState);
  
  const setImage = useRecoilCallback(({ set }) => async () => {
    const userImage = await getImage();
    userImage && set(imageState, userImage);
  });

  useEffect(() => {
    setImage();
  }, [setImage,currentRole]);

  return image;
}