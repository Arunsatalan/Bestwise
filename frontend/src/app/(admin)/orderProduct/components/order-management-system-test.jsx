"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import {
  MapPin,
  Clock,
  Phone,
  Package,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Printer,
  Mail,
  Check,
  X,
  Eye,
  Gift,
  Bell,
  Settings,
  DollarSign,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Edit,
  Copy,
  MessageSquare,
  CreditCard,
  RefreshCw,
  Download,
  Plus,
  Minus,
} from "lucide-react"

// Mock data
const mockOrders = [
  {
    id: "DEL-001",
    orderId: "ORD-2025-001",
    referenceCode: "GC001",
    customerName: "Sarah Johnson",
    customerPhone: "+1 234-567-8900",
    customerEmail: "sarah.j@email.com",
    address: "456 Oak Avenue, Apt 2B, New York, NY 10002",
    status: "pending_acceptance",
    totalAmount: 289.97,
    isGift: true,
    giftWrap: true,
    priority: "high",
    orderDate: "2025-01-22T10:30:00Z",
    items: [
      {
        id: "ITEM-001",
        name: "Premium Gift Box - Luxury Collection",
        sku: "PGB-LUX-001",
        quantity: 1,
        price: 129.99,
        category: "Gift Boxes",
        status: "in_stock",
        weight: "2.5 lbs",
      },
      {
        id: "ITEM-002",
        name: "Artisan Chocolate Truffles",
        sku: "ACT-DEL-002",
        quantity: 2,
        price: 49.99,
        category: "Chocolates",
        status: "in_stock",
        weight: "1.2 lbs",
      },
    ],
    packingStatus: "not_packed",
    paymentMethod: "credit_card",
  },
  {
    id: "DEL-002",
    orderId: "ORD-2025-002",
    referenceCode: "GC002",
    customerName: "Michael Chen",
    customerPhone: "+1 234-567-8901",
    customerEmail: "michael.c@email.com",
    address: "789 Pine Street, Los Angeles, CA 90001",
    status: "accepted",
    totalAmount: 89.5,
    isGift: false,
    giftWrap: false,
    priority: "normal",
    orderDate: "2025-01-22T11:30:00Z",
    items: [
      {
        id: "ITEM-004",
        name: "Coffee Mug Set",
        sku: "CMS-BLU-001",
        quantity: 1,
        price: 89.5,
        category: "Home & Kitchen",
        status: "in_stock",
        weight: "1.5 lbs",
      },
    ],
    packingStatus: "packing_in_progress",
    paymentMethod: "paypal",
  },
]

const statusColors = {
  pending_acceptance: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  packed_ready: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  failed_attempt: "bg-red-100 text-red-800",
}

const packingStatusColors = {
  not_packed: "bg-gray-100 text-gray-800",
  packing_in_progress: "bg-yellow-100 text-yellow-800",
  packed: "bg-green-100 text-green-800",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  normal: "bg-gray-100 text-gray-800",
  low: "bg-green-100 text-green-800",
}

export function OrderManagementSystem() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("pending")
  const [expandedOrders, setExpandedOrders] = useState([])

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.referenceCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const matchesTab =
      (activeTab === "pending" && order.status === "pending_acceptance") ||
      (activeTab === "accepted" && order.status === "accepted") ||
      (activeTab === "packed" && order.status === "packed_ready") ||
      (activeTab === "delivery" && (order.status === "out_for_delivery" || order.status === "delivered")) ||
      activeTab === "all"

    return matchesSearch && matchesStatus && matchesTab
  })

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gift Commerce</h1>
                <p className="text-sm text-gray-600">Advanced Order Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bell className="h-4 w-4" />
                <span>5 notifications</span>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockOrders.filter((d) => d.status === "pending_acceptance").length}
              </div>
              <p className="text-xs text-muted-foreground">Need acceptance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockOrders.filter((d) => d.status === "accepted").length}
              </div>
              <p className="text-xs text-muted-foreground">Ready for packing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Packed</CardTitle>
              <Package className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {mockOrders.filter((d) => d.status === "packed_ready").length}
              </div>
              <p className="text-xs text-muted-foreground">Ready to ship</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <ShoppingBag className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {mockOrders.reduce((sum, order) => sum + order.items.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gift Orders</CardTitle>
              <Gift className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                {mockOrders.filter((d) => d.isGift).length}
              </div>
              <p className="text-xs text-muted-foreground">Special handling</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${mockOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">💹 +12% today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Advanced Order Management System</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print All
                </Button>
                <Button size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers, products, or SKUs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_acceptance">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="packed_ready">Packed</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending" className="relative">
                  🟡 Pending ({mockOrders.filter((d) => d.status === "pending_acceptance").length})
                </TabsTrigger>
                <TabsTrigger value="accepted" className="relative">
                  🔵 Accepted ({mockOrders.filter((d) => d.status === "accepted").length})
                </TabsTrigger>
                <TabsTrigger value="packed" className="relative">
                  🟣 Packed ({mockOrders.filter((d) => d.status === "packed_ready").length})
                </TabsTrigger>
                <TabsTrigger value="delivery" className="relative">
                  🚚 Delivery ({mockOrders.filter((d) => d.status === "out_for_delivery" || d.status === "delivered").length})
                </TabsTrigger>
                <TabsTrigger value="all" className="relative">
                  📊 All ({mockOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Details</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Gift</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-blue-600">{order.referenceCode}</div>
                              <div className="text-sm text-muted-foreground">{order.orderId}</div>
                              <div className="flex gap-1">
                                <Badge className={priorityColors[order.priority]} variant="secondary">
                                  {order.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {order.paymentMethod}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{order.customerName}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {order.customerPhone}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {order.customerEmail}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{order.items.length} products</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} total items
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                              >
                                {expandedOrders.includes(order.id) ? "Hide Products" : "View Products"}
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-2">
                              <Badge className={statusColors[order.status]}>{order.status.replace("_", " ")}</Badge>
                              <Badge className={packingStatusColors[order.packingStatus]}>
                                {order.packingStatus.replace("_", " ")}
                              </Badge>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-lg">${order.totalAmount}</div>
                              <div className="text-xs text-muted-foreground">
                                {order.paymentMethod.replace("_", " ")}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {order.isGift && <Gift className="h-4 w-4 text-pink-500" />}
                              {order.giftWrap && (
                                <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800">
                                  🎁 Wrapped
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              {order.status === "pending_acceptance" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
