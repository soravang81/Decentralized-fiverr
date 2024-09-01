import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { adminDisputes } from "../actions/others/dispute"
import { DisputeSolveButton } from "@/components/resolveDispute"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"

export default async function Admin() {
  const session = await getServerSession(authConfig)
  if(session?.user.role !== "ADMIN") return <p className="text-4xl text-center font-bold mt-20">Unauthorised.</p>

  const disputes = await adminDisputes()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader className="px-7">
            <CardTitle>Ongoing Disputes</CardTitle>
            <CardDescription>Resolve disputes between freelancers and clients.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>orderId</TableHead>
                  <TableHead>Raised By</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell>{dispute.orderId}</TableCell>
                    <TableCell>{dispute.disputedBy}</TableCell>
                    <TableCell>{dispute.order.buyer.name}</TableCell>
                    <TableCell>{dispute.order.seller.name}</TableCell>
                    <TableCell>{dispute.order.status}</TableCell>
                    <TableCell>
                      <p className="max-w-60">{dispute.reason}</p>
                    </TableCell>
                    <TableCell>
                      {dispute.resolution === "PENDING" ? <DisputeSolveButton dispute={dispute}/> : <p className="max-w-60">{dispute.resolution}</p>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
