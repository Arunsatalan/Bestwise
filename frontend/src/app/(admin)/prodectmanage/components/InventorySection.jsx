"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Badge } from "../../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { Package, Truck, Scale, AlertTriangle } from "lucide-react"

export default function InventorySection({ inventory, onChange }) {
  const [volumetricWeight, setVolumetricWeight] = useState(0)
  const [reorderAlert, setReorderAlert] = useState(false)

  const shippingClasses = {
    standard: { name: "Standard", cost: 5.99 },
    express: { name: "Express", cost: 12.99 },
    overnight: { name: "Overnight", cost: 24.99 },
    free: { name: "Free Shipping", cost: 0 },
    heavy: { name: "Heavy Item", cost: 19.99 },
  }

  useEffect(() => {
    calculateVolumetricWeight()
    checkReorderAlert()
  }, [inventory])

  const calculateVolumetricWeight = () => {
    const { dimensions } = inventory
    if (dimensions.length && dimensions.width && dimensions.height) {
      // Volumetric weight = (L × W × H) / 5000 (standard divisor)
      const volWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000
      setVolumetricWeight(volWeight.toFixed(2))
    }
  }

  const checkReorderAlert = () => {
    setReorderAlert(inventory.stock <= 10 && inventory.stock > 0)
  }

  const handleInventoryChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      onChange({
        ...inventory,
        [parent]: {
          ...inventory[parent],
          [child]: Number.parseFloat(value) || 0,
        },
      })
    } else {
      const processedValue = ["stock", "weight"].includes(field) ? Number.parseFloat(value) || 0 : value
      onChange({
        ...inventory,
        [field]: processedValue,
      })
    }
  }

  const getStockStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "default"
      case "low-stock":
        return "secondary"
      case "out-of-stock":
        return "destructive"
      case "backordered":
        return "outline"
      default:
        return "default"
    }
  }

  const getStockStatusFromQuantity = (stock) => {
    if (stock === 0) return "out-of-stock"
    if (stock <= 10) return "low-stock"
    return "in-stock"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={inventory.stock}
                onChange={(e) => handleInventoryChange("stock", e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Current available quantity</p>
            </div>

            <div>
              <Label htmlFor="stockStatus">Stock Status</Label>
              <select
                id="stockStatus"
                value={inventory.stockStatus}
                onChange={(e) => handleInventoryChange("stockStatus", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="backordered">Backordered</option>
              </select>
            </div>
          </div>

          {/* Stock Status Display */}
          <div className="flex items-center gap-4">
            <Badge variant={getStockStatusColor(inventory.stockStatus)}>
              {inventory.stockStatus.replace("-", " ").toUpperCase()}
            </Badge>
            <Badge variant={getStockStatusColor(getStockStatusFromQuantity(inventory.stock))}>
              Auto: {getStockStatusFromQuantity(inventory.stock).replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Reorder Alert */}
          {reorderAlert && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Low stock alert! Consider reordering soon. Current stock: {inventory.stock} units.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Physical Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Physical Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={inventory.weight}
              onChange={(e) => handleInventoryChange("weight", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                value={inventory.dimensions.length}
                onChange={(e) => handleInventoryChange("dimensions.length", e.target.value)}
                placeholder="Length"
              />
              <Input
                type="number"
                step="0.1"
                min="0"
                value={inventory.dimensions.width}
                onChange={(e) => handleInventoryChange("dimensions.width", e.target.value)}
                placeholder="Width"
              />
              <Input
                type="number"
                step="0.1"
                min="0"
                value={inventory.dimensions.height}
                onChange={(e) => handleInventoryChange("dimensions.height", e.target.value)}
                placeholder="Height"
              />
            </div>
          </div>

          {volumetricWeight > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm">
                <strong>Volumetric Weight:</strong> {volumetricWeight} kg
                {Number.parseFloat(volumetricWeight) > inventory.weight && (
                  <span className="text-blue-600 ml-2">(Higher than actual weight - will be used for shipping)</span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="shippingClass">Shipping Class</Label>
            <select
              id="shippingClass"
              value={inventory.shippingClass}
              onChange={(e) => handleInventoryChange("shippingClass", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {Object.entries(shippingClasses).map(([key, { name, cost }]) => (
                <option key={key} value={key}>
                  {name} - ${cost}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Shipping Cost Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base shipping cost:</span>
                <span>${shippingClasses[inventory.shippingClass]?.cost || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Weight-based adjustment:</span>
                <span>${(inventory.weight * 0.5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>Total estimated shipping:</span>
                <span>
                  ${((shippingClasses[inventory.shippingClass]?.cost || 0) + inventory.weight * 0.5).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
