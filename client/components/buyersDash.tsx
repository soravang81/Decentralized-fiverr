"use client"
import React from 'react';
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuyOrders } from "./buyOrders";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, SearchIcon, MessageCircleIcon, StarIcon } from 'lucide-react';
import { IGigExtended } from "@/app/gig/[id]/page";
import { BuyerGigs } from './buyerGigs';
import Feedback from './feedback';
import { toast } from 'sonner';

interface BuyersHomepageProps {
  session: Session | null;
  gigs: IGigExtended[];
}

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  onClick? : () => void
}

export const BuyersHomepage: React.FC<BuyersHomepageProps> = ({ session, gigs }) => {
  const { user } = session || {};
  const welcomeMessage = `Welcome back${user?.name ? `, ${user?.name}` : ''}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-4xl font-bold mb-8 text-gray-200"
        variants={itemVariants}
      >
        {welcomeMessage}
      </motion.h1>

      <motion.div 
        className="md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 hidden"
        variants={itemVariants}
      >
        <QuickActionCard
          icon={<SearchIcon className="w-8 h-8 text-green-400" />}
          title="Browse Gigs"
          description="Explore talented freelancers"
          link='/dashboard'
        />
        <QuickActionCard
          icon={<ShoppingBagIcon className="w-8 h-8 text-red-400" />}
          title="My Orders"
          description="View your active and past orders"
          link="/orders"
        />
        <QuickActionCard
          icon={<MessageCircleIcon className="w-8 h-8 text-blue-400" />}
          title="Messages"
          description="Chat with your freelancers"
          onClick={() => {
            toast.info("Coming Soon !")
          }}
        />
        <Feedback/>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-200">Explore Gigs</CardTitle>
          </CardHeader>
          <CardContent>
            <BuyerGigs gigs={gigs} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, link , onClick}) => {
  return  <Link href={link ?? "#"} onClick={onClick}>
    <Card className="bg-gray-900 hover:bg-opacity-70 transition-all duration-300 cursor-pointer transform hover:scale-105">
      <CardContent className="p-6 flex flex-col items-center text-center">
        {icon}
        <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-200">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  </Link>
}