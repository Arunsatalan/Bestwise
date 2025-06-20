"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Badge } from "../../../../components/ui/badge"
import { Eye, ArrowLeft, Check, AlertCircle } from "lucide-react"
import MediaUpload from "./MediaUpload";
import PricingSection from "./PricingSection"
import InventorySection from "./InventorySection"
import VariantsSection from "./VariantsSection"
import CategoryFilters from "./CategoryFilters"

// Dynamically import components that use browser-only APIs
const RichTextEditor = dynamic(
  () => import("./RichTextEditor"),
  { ssr: false, loading: () => <Textarea disabled placeholder="Loading editor..." /> }
)

const defaultProduct = {
  name: "",
  sku: "",
  shortDescription: "",
  detailedDescription: "",
  mainCategory: "",
  filters: {},
  tags: [],
  images: [],
  videos: [],
  costPrice: 0,
  retailPrice: 0,
  salePrice: 0,
  taxClass: "standard",
  stock: 0,
  stockStatus: "in-stock",
  weight: 0,
  dimensions: { length: 0, width: 0, height: 0 },
  shippingClass: "standard",
  variants: [],
  status: "draft",
}

export default function ProductForm({ product = null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState("form") // "form" | "preview" | "confirm"
  const [categorySystem, setCategorySystem] = useState({})
  const [formData, setFormData] = useState(defaultProduct)
  const [isClient, setIsClient] = useState(false)
  const [previewErrors, setPreviewErrors] = useState([])

  useEffect(() => {
    setIsClient(true)
    loadCategories()
    
    // Initialize form data safely
    if (product) {
      setFormData({
        ...defaultProduct,
        ...product,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        filters: product.filters || {},
        tags: product.tags || [],
        images: product.images || [],
        variants: product.variants || [],
      })
    }
  }, [product])

  const loadCategories = async () => {
  try {
    const response = await fetch("/prodectmanage/api/categories") // fix path here
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }
    const data = await response.json()
    setCategorySystem(data)
  } catch (error) {
    console.error("Error loading categories:", error)
  }
}

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryChange = (mainCategory) => {
    setFormData((prev) => ({
      ...prev,
      mainCategory,
      filters: {},
    }))
  }

  const handleFiltersChange = (filters) => {
    setFormData((prev) => ({
      ...prev,
      filters: filters || {},
    }))
  }

  const validateForm = () => {
    const errors = []

    if (!formData.name?.trim()) errors.push("Product name is required")
    if (!formData.sku?.trim()) errors.push("SKU is required")
    if (!formData.mainCategory) errors.push("Main category is required")
    if (!formData.shortDescription?.trim()) errors.push("Short description is required")
    if (!formData.retailPrice || formData.retailPrice <= 0) errors.push("Retail price must be greater than 0")
    if (formData.costPrice < 0) errors.push("Cost price cannot be negative")
    if (formData.stock < 0) errors.push("Stock cannot be negative")

    if (formData.mainCategory && Object.values(formData.filters).every((arr) => !arr || arr.length === 0)) {
      errors.push("Please select at least one filter for the chosen category")
    }

    return errors
  }

  const handlePreview = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }
    setPreviewErrors(errors)
    setCurrentStep("preview")
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setCurrentStep("confirm")
      } else {
        throw new Error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product")
      setCurrentStep("preview")
    } finally {
      setLoading(false)
    }
  }

  const getFilterDisplayName = (filterType) => {
    return filterType.charAt(0).toUpperCase() + filterType.slice(1).replace(/([A-Z])/g, " $1")
  }

  const calculateProfitMargin = () => {
    const sellingPrice = formData.salePrice > 0 ? formData.salePrice : formData.retailPrice
    if (formData.costPrice > 0) {
      return (((sellingPrice - formData.costPrice) / formData.costPrice) * 100).toFixed(2)
    }
    return "0.00"
  }

  const getStockStatus = () => {
    if (formData.stock === 0) return { label: "Out of Stock", color: "destructive" }
    if (formData.stock < 10) return { label: "Low Stock", color: "secondary" }
    return { label: "In Stock", color: "default" }
  }

  // Confirmation Step
  if (currentStep === "confirm") {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              {product ? "Product Updated Successfully!" : "Product Created Successfully!"}
            </h1>
            <p className="text-gray-600 mb-4">
              Your product "{formData.name}" has been {product ? "updated" : "created"} and is now available in the
              system.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>SKU: {formData.sku}</p>
              <p>Category: {categorySystem[formData.mainCategory]?.name}</p>
              <p>Status: {formData.status}</p>
            </div>
            <div className="mt-6">
              <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Preview Step
  if (currentStep === "preview") {
    const stockStatus = getStockStatus()
    const profitMargin = calculateProfitMargin()

    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setCurrentStep("form")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <h1 className="text-3xl font-bold">Product Preview</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep("form")}>
              Edit Product
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square mb-4">
                  <img
                    src={formData.images?.[0] || "/placeholder.svg"}
                    alt={formData.name || "Product image"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {formData.images?.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${formData.name || "Product"} ${index + 2}`}
                        className="aspect-square object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Description */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isClient && formData.detailedDescription ? (
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: formData.detailedDescription }} 
                  />
                ) : (
                  <p>{formData.shortDescription}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Info Sidebar */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{formData.name}</h2>
                  <p className="text-gray-600">{formData.shortDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-medium">{formData.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Main Category</p>
                  <Badge variant="outline">
                    {categorySystem[formData.mainCategory]?.name || formData.mainCategory}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={formData.status === "active" ? "default" : "secondary"}>{formData.status}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Category Filters */}
            {Object.keys(formData.filters).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Category Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(formData.filters).map(([filterType, values]) => {
                    if (!values || values.length === 0) return null
                    return (
                      <div key={filterType}>
                        <p className="text-sm font-medium text-gray-600 mb-1">{getFilterDisplayName(filterType)}:</p>
                        <div className="flex flex-wrap gap-1">
                          {values.map((value) => (
                            <Badge key={value} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Total filters selected: {Object.values(formData.filters).flat().length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Profit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Cost Price:</span>
                  <span>${formData.costPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retail Price:</span>
                  <span>${formData.retailPrice.toFixed(2)}</span>
                </div>
                {formData.salePrice > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Sale Price:</span>
                    <span>${formData.salePrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Selling Price:</span>
                  <span>${(formData.salePrice > 0 ? formData.salePrice : formData.retailPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <Badge variant={profitMargin < 10 ? "destructive" : profitMargin < 25 ? "secondary" : "default"}>
                    {profitMargin}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory & Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span>{formData.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={stockStatus.color}>{stockStatus.label}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>{formData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>
                    {formData.dimensions.length} × {formData.dimensions.width} × {formData.dimensions.height} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="capitalize">{formData.shippingClass}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {formData.tags?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Variants */}
            {formData.variants?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants ({formData.variants.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.variants.slice(0, 3).map((variant) => (
                      <div key={variant.id} className="text-sm border rounded p-2">
                        <div className="font-medium">
                          {Object.entries(variant.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </div>
                        <div className="text-gray-500">
                          ${variant.price} • Stock: {variant.stock}
                        </div>
                      </div>
                    ))}
                    {formData.variants.length > 3 && (
                      <p className="text-sm text-gray-500">+{formData.variants.length - 3} more variants</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {previewErrors.length === 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Ready to Submit</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600">Validation Issues</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {previewErrors.length === 0 ? (
              <div className="text-green-600">
                <p>✅ All required fields are completed</p>
                <p>✅ Product is ready for submission</p>
              </div>
            ) : (
              <div className="space-y-2">
                {previewErrors.map((error, index) => (
                  <p key={index} className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form Step
  return (
    <form className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description (160 chars max)</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/160 characters</p>
              </div>

              <div>
                <Label>Detailed Description</Label>
                <RichTextEditor
                  value={formData.detailedDescription}
                  onChange={(value) => handleInputChange("detailedDescription", value)}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryFilters
            category={formData.mainCategory}
            tags={formData.tags}
            onCategoryChange={handleCategoryChange}
            onTagsChange={(tags) => handleInputChange("tags", tags)}
            onFiltersChange={handleFiltersChange}
            selectedFilters={formData.filters}
            isProductForm={true}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaUpload
          
            images={formData.images}
            videos={formData.videos}
            onImagesChange={(images) => handleInputChange("images", images)}
            onVideosChange={(videos) => handleInputChange("videos", videos)}
          />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingSection
            pricing={{
              costPrice: formData.costPrice,
              retailPrice: formData.retailPrice,
              salePrice: formData.salePrice,
              taxClass: formData.taxClass,
            }}
            onChange={(pricing) => {
              Object.keys(pricing).forEach((key) => {
                handleInputChange(key, pricing[key])
              })
            }}
          />
        </TabsContent>

        <TabsContent value="inventory">
          <InventorySection
            inventory={{
              stock: formData.stock,
              stockStatus: formData.stockStatus,
              weight: formData.weight,
              dimensions: formData.dimensions,
              shippingClass: formData.shippingClass,
            }}
            onChange={(inventory) => {
              Object.keys(inventory).forEach((key) => {
                handleInputChange(key, inventory[key])
              })
            }}
          />
        </TabsContent>

        <TabsContent value="variants">
          <VariantsSection
            variants={formData.variants}
            onChange={(variants) => handleInputChange("variants", variants)}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button type="button" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Product
        </Button>
      </div>
    </form>
  )
}