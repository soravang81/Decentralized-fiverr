import React from 'react'
import { Session } from "next-auth"

export const SellerDashboard: React.FC<{ session: Session | null }> = ({ session }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      {/* Add your seller dashboard content here */}
    </div>
  )
}