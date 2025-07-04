"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

export default function EditProduct() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    shortDescription: "",
    detailedDescription: "",
    mainCategory: "",
    costPrice: 0,
    retailPrice: 0,
    salePrice: 0,
    stock: 0,
    weight: 0,
    status: "draft"
  })

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      setProduct(data)
      setFormData({
        name: data.name || "",
        sku: data.sku || "",
        shortDescription: data.shortDescription || "",
        detailedDescription: data.detailedDescription || "",
        mainCategory: data.mainCategory || "",
        costPrice: data.costPrice || 0,
        retailPrice: data.retailPrice || 0,
        salePrice: data.salePrice || 0,
        stock: data.stock || 0,
        weight: data.weight || 0,
        status: data.status || "draft"
      })
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Product updated successfully!")
        router.push(`/prodectmanage/products/${params.id}`)
      } else {
        alert("Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error updating product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/prodectmanage">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/prodectmanage/products/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Product
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/prodectmanage/products/${params.id}`}>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <Input
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  name="mainCategory"
                  value={formData.mainCategory}
                  onChange={handleInputChange}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Enter short description"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <textarea
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description"
                  className="w-full p-2 border rounded-md"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cost Price</label>
                  <Input
                    name="costPrice"
                    type="number"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Retail Price</label>
                  <Input
                    name="retailPrice"
                    type="number"
                    value={formData.retailPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sale Price</label>
                  <Input
                    name="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <Input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <Input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href={`/prodectmanage/products/${params.id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{formData.name || "Product Name"}</h3>
                <p className="text-sm text-gray-600">SKU: {formData.sku || "SKU"}</p>
              </div>
              
              <div>
                <Badge variant="outline">{formData.mainCategory || "Category"}</Badge>
                <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                  {formData.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm">{formData.shortDescription || "Short description"}</p>
              </div>

              <div className="flex justify-between">
                <span>Cost Price:</span>
                <span>${formData.costPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Retail Price:</span>
                <span>${formData.retailPrice}</span>
              </div>
              {formData.salePrice > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Sale Price:</span>
                  <span>${formData.salePrice}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Stock:</span>
                <span>{formData.stock} units</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
