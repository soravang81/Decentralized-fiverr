"use server"

import fs from "fs"
import prisma from "@/db/db"
import { hash } from "bcrypt"

export const getOwnerSecretKey = (): number[] => {
    const WALLET_PATH = process.env.NEXT_PUBLIC_OWNER_WALLET || '/home/sourav/.config/solana/id.json';
    const secretKeyString = process.env.NEXT_PUBLIC_OWNER_WALLET || fs.readFileSync(WALLET_PATH, 'utf8');
    return JSON.parse(secretKeyString);
};

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const EmailService = async (data:{
  to: string,
  subject: string,
  text?: string,
  html?: string
}) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_EMAIL_USER,
      to : data.to,
      subject : data.subject,
      text : data.text,
      html : data.html,
    });
    return true
  } catch (error:any) {
    console.error('Error sending email:', error);
  }
}


export async function resetPassword(email: string, newPassword: string) {
    const hashedPassword = await hash(newPassword, 10)
    
    await prisma.user.update({
        where: {
            username : email
        },
        data: { password: hashedPassword },
    })
}