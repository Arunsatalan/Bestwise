"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Textarea } from "../../../../components/ui/textarea"
import { Plus, X, Folder, Edit2, Save, Settings, Trash2, Eye, Package, Search } from "lucide-react"
import Link from "next/link"

export default function CategoryFilters({
  category = "",
  tags = [],
  onCategoryChange = () => {},
  onTagsChange = () => {},
  onFiltersChange = null,
  selectedFilters = {},
  isProductForm = false,
}) {
  const [categorySystem, setCategorySystem] = useState({})
  const [selectedMainCategory, setSelectedMainCategory] = useState(category || "")
  const [currentSelectedFilters, setCurrentSelectedFilters] = useState(selectedFilters || {})
  const [editingItems, setEditingItems] = useState({})
  const [newItemInputs, setNewItemInputs] = useState({})
  const [showAddInput, setShowAddInput] = useState({})
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showProducts, setShowProducts] = useState(false)

  // New category form state
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: "",
    key: "",
    description: "",
    attributes: [{ name: "subcategories", displayName: "Subcategories", items: [] }],
  })

  // Initialize state from props
  useEffect(() => {
    if (category && category !== selectedMainCategory) {
      setSelectedMainCategory(category)
    }
  }, [category])

  useEffect(() => {
    if (selectedFilters && Object.keys(selectedFilters).length > 0) {
      setCurrentSelectedFilters(selectedFilters)
    }
  }, [selectedFilters])

  // Load categories and products from backend on component mount
  useEffect(() => {
    loadCategories()
    if (!isProductForm) {
      loadProducts()
    }
  }, [isProductForm])

  // Filter products when category or filters change
  useEffect(() => {
    if (!isProductForm) {
      filterProducts()
    }
  }, [selectedMainCategory, currentSelectedFilters, products, isProductForm])

  const loadCategories = async () => {
    try {
      const response = await fetch("/prodectmanage/api/categories")
      const data = await response.json()
      setCategorySystem(data)
    } catch (error) {
      console.error("Error loading categories:", error)
      loadDefaultCategories()
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const filterProducts = () => {
    if (!selectedMainCategory) {
      setFilteredProducts([])
      return
    }

    const filtered = products.filter((product) => {
      // Match main category
      if (product.mainCategory !== selectedMainCategory) {
        return false
      }

      // Match selected filters
      for (const [filterType, selectedItems] of Object.entries(currentSelectedFilters)) {
        if (selectedItems && selectedItems.length > 0) {
          const productFilterValues = product.filters?.[filterType] || []
          const hasMatch = selectedItems.some((item) => productFilterValues.includes(item))
          if (!hasMatch) {
            return false
          }
        }
      }

      return true
    })

    setFilteredProducts(filtered)
  }

  const loadDefaultCategories = () => {
    const defaultCategories = {
      balloons: {
        name: "Balloons",
        description: "Party and celebration balloons",
        subcategories: ["Party Balloons", "Wedding Balloons", "Birthday Balloons", "Seasonal Balloons"],
        occasions: [
          "Wedding",
          "Anniversary",
          "Valentine's Day",
          "Graduation",
          "Baby Shower",
          "Halloween",
          "Christmas",
          "Birthday",
          "New Year",
        ],
        types: [
          "Confetti",
          "LED",
          "Helium-filled",
          "Air-filled",
          "Biodegradable",
          "Stuffed",
          "Mini",
          "Starred",
          "Large",
          "Jumbo",
          "Custom",
        ],
        colors: ["Pink", "Blue", "Gold", "Silver", "Multi-color", "Green", "Red", "Purple", "Orange", "White"],
        finishes: ["Matte", "Chrome", "Confetti", "Glitter", "Pearlescent", "Transparent", "Metallic"],
        sizes: ['Mini (6")', 'Standard (11")', 'Large (18")', 'Jumbo (36")', 'Giant (40"+)'],
      },
      cards: {
        name: "Cards",
        description: "Greeting cards and stationery",
        subcategories: ["Greeting Cards", "Birthday Cards", "Wedding Cards", "Thank You Cards"],
        occasions: [
          "Wedding",
          "Anniversary",
          "Sympathy",
          "Congratulations",
          "Thank You",
          "Get Well",
          "Birthday",
          "Valentine's Day",
          "Christmas",
          "Mother's Day",
          "Father's Day",
        ],
        recipients: ["Friend", "Family", "Partner", "Colleague", "Parent", "Child", "Boss", "Teacher"],
        styles: ["Artistic", "Photo", "Pop-up", "Musical", "Handmade", "Vintage", "Modern", "Minimalist"],
        colors: ["Pink", "Blue", "White", "Gold", "Silver", "Red", "Green", "Purple"],
        formats: ["A4", "A5", "Square", "Postcard", "Folded", "Single Panel"],
      },
      "home-living": {
        name: "Home & Living",
        description: "Home decor and living accessories",
        subcategories: ["Wall Decor", "Table Decor", "Garden Items", "Lighting", "Storage"],
        productTypes: ["Frames", "Candles", "Decor", "Garden items", "Cushions", "Vases", "Mirrors", "Clocks"],
        colors: ["White", "Black", "Gold", "Silver", "Blue", "Green", "Brown", "Gray", "Beige"],
        sizes: ["Small", "Medium", "Large", "Extra Large"],
        materials: ["Wood", "Metal", "Glass", "Ceramic", "Fabric", "Plastic", "Stone"],
        rooms: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Garden", "Office", "Dining Room"],
        styles: ["Modern", "Vintage", "Rustic", "Minimalist", "Industrial", "Scandinavian", "Bohemian"],
      },
    }
    setCategorySystem(defaultCategories)
  }

  // Save categories to backend
  const saveCategories = async (updatedCategories) => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategories),
      })
    } catch (error) {
      console.error("Error saving categories:", error)
    }
  }

  // Create new main category
  const createNewCategory = async () => {
    if (!newCategoryForm.name || !newCategoryForm.key) {
      alert("Please fill in category name and key")
      return
    }

    if (categorySystem[newCategoryForm.key]) {
      alert("Category key already exists")
      return
    }

    // Validate that at least one attribute has items
    const hasValidAttributes = newCategoryForm.attributes.some((attr) => attr.items.length > 0)
    if (!hasValidAttributes) {
      alert("Please add at least one item to your category attributes")
      return
    }

    const newCategory = {
      name: newCategoryForm.name,
      description: newCategoryForm.description,
    }

    // Add all attributes with their items
    newCategoryForm.attributes.forEach((attr) => {
      newCategory[attr.name] = attr.items
    })

    const updatedCategories = {
      ...categorySystem,
      [newCategoryForm.key]: newCategory,
    }

    setCategorySystem(updatedCategories)
    await saveCategories(updatedCategories)

    // Auto-select the newly created category
    setSelectedMainCategory(newCategoryForm.key)
    setCurrentSelectedFilters({})
    onCategoryChange(newCategoryForm.key)
    if (onFiltersChange) {
      onFiltersChange({})
    }

    // Reset form
    setNewCategoryForm({
      name: "",
      key: "",
      description: "",
      attributes: [{ name: "subcategories", displayName: "Subcategories", items: [] }],
    })
    setShowCreateCategoryForm(false)

    alert(`Category "${newCategory.name}" created successfully and selected!`)
  }

  // Add attribute to new category form
  const addAttributeToForm = () => {
    const attributeName = prompt("Enter attribute name (e.g., colors, sizes, materials):")
    if (!attributeName) return

    const displayName = prompt("Enter display name (e.g., Colors, Sizes, Materials):")
    if (!displayName) return

    // Check for duplicates
    const exists = newCategoryForm.attributes.some((attr) => attr.name.toLowerCase() === attributeName.toLowerCase())

    if (exists) {
      alert("An attribute with this name already exists!")
      return
    }

    setNewCategoryForm((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          name: attributeName.toLowerCase().replace(/\s+/g, ""),
          displayName,
          items: [],
        },
      ],
    }))
  }

  // Add item to attribute in form
  const addItemToAttribute = (attributeIndex, item) => {
    if (!item || !item.trim()) return

    const trimmedItem = item.trim()
    const currentAttribute = newCategoryForm.attributes[attributeIndex]

    // Check for duplicates
    if (currentAttribute.items.includes(trimmedItem)) {
      alert("This item already exists in this attribute!")
      return
    }

    setNewCategoryForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, index) =>
        index === attributeIndex ? { ...attr, items: [...attr.items, trimmedItem] } : attr,
      ),
    }))
  }

  // Remove item from attribute in form
  const removeItemFromAttribute = (attributeIndex, itemIndex) => {
    setNewCategoryForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, index) =>
        index === attributeIndex ? { ...attr, items: attr.items.filter((_, i) => i !== itemIndex) } : attr,
      ),
    }))
  }

  // Remove attribute from form
  const removeAttributeFromForm = (attributeIndex) => {
    setNewCategoryForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, index) => index !== attributeIndex),
    }))
  }

  // Generate category key from name
  const generateCategoryKey = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  // Update category key when name changes
  useEffect(() => {
    if (newCategoryForm.name) {
      setNewCategoryForm((prev) => ({
        ...prev,
        key: generateCategoryKey(prev.name),
      }))
    }
  }, [newCategoryForm.name])

  // Handle main category selection
  const handleMainCategorySelect = (categoryKey) => {
    setSelectedMainCategory(categoryKey)
    const emptyFilters = {}
    setCurrentSelectedFilters(emptyFilters)

    // Notify parent components
    onCategoryChange(categoryKey)
    if (onFiltersChange) {
      onFiltersChange(emptyFilters)
    }
  }

  // Handle filter selection
  const handleFilterSelection = (filterType, item) => {
    const currentItems = currentSelectedFilters[filterType] || []
    let newItems

    if (currentItems.includes(item)) {
      newItems = currentItems.filter((i) => i !== item)
    } else {
      newItems = [...currentItems, item]
    }

    const updatedFilters = {
      ...currentSelectedFilters,
      [filterType]: newItems,
    }

    setCurrentSelectedFilters(updatedFilters)

    // Notify parent if in product form
    if (onFiltersChange) {
      onFiltersChange(updatedFilters)
    }
  }

  // Delete main category
  const deleteMainCategory = async (categoryKey) => {
    if (confirm(`Delete the entire "${categorySystem[categoryKey].name}" category? This cannot be undone.`)) {
      const updatedCategories = { ...categorySystem }
      delete updatedCategories[categoryKey]

      setCategorySystem(updatedCategories)
      await saveCategories(updatedCategories)

      if (selectedMainCategory === categoryKey) {
        setSelectedMainCategory("")
        setCurrentSelectedFilters({})
        onCategoryChange("")
        if (onFiltersChange) {
          onFiltersChange({})
        }
      }
    }
  }

  // CRUD Operations for existing categories
  const addItem = async (categoryKey, filterType, newItem) => {
    if (newItem && !categorySystem[categoryKey][filterType].includes(newItem)) {
      const updatedCategories = {
        ...categorySystem,
        [categoryKey]: {
          ...categorySystem[categoryKey],
          [filterType]: [...categorySystem[categoryKey][filterType], newItem],
        },
      }

      setCategorySystem(updatedCategories)
      await saveCategories(updatedCategories)

      setNewItemInputs((prev) => ({ ...prev, [`${categoryKey}-${filterType}`]: "" }))
      setShowAddInput((prev) => ({ ...prev, [`${categoryKey}-${filterType}`]: false }))
    }
  }

  const editItem = async (categoryKey, filterType, oldItem, newItem) => {
    if (newItem && newItem !== oldItem && !categorySystem[categoryKey][filterType].includes(newItem)) {
      const updatedCategories = {
        ...categorySystem,
        [categoryKey]: {
          ...categorySystem[categoryKey],
          [filterType]: categorySystem[categoryKey][filterType].map((item) => (item === oldItem ? newItem : item)),
        },
      }

      setCategorySystem(updatedCategories)
      await saveCategories(updatedCategories)

      setEditingItems((prev) => ({ ...prev, [`${categoryKey}-${filterType}-${oldItem}`]: false }))
    }
  }

  const deleteItem = async (categoryKey, filterType, itemToDelete) => {
    if (confirm(`Delete "${itemToDelete}"?`)) {
      const updatedCategories = {
        ...categorySystem,
        [categoryKey]: {
          ...categorySystem[categoryKey],
          [filterType]: categorySystem[categoryKey][filterType].filter((item) => item !== itemToDelete),
        },
      }

      setCategorySystem(updatedCategories)
      await saveCategories(updatedCategories)

      // Update current selected filters
      setCurrentSelectedFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType]?.filter((item) => item !== itemToDelete) || [],
      }))
    }
  }

  const startEditing = (categoryKey, filterType, item) => {
    setEditingItems((prev) => ({ ...prev, [`${categoryKey}-${filterType}-${item}`]: item }))
  }

  const cancelEditing = (categoryKey, filterType, item) => {
    setEditingItems((prev) => ({ ...prev, [`${categoryKey}-${filterType}-${item}`]: false }))
  }

  const clearAllFilters = () => {
    setCurrentSelectedFilters({})
    if (onFiltersChange) {
      onFiltersChange({})
    }
  }

  const deleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`/api/products/${productId}`, { method: "DELETE" })
        loadProducts() // Reload products
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  // Get available main categories
  const mainCategories = Object.keys(categorySystem)
  const currentCategoryData = selectedMainCategory ? categorySystem[selectedMainCategory] : null

  const FilterSection = ({ title, filterType, items, categoryKey }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-lg">{title}</h3>
            <Badge variant="outline" className="text-xs">
              {items.length} items
            </Badge>
            {currentSelectedFilters[filterType]?.length > 0 && (
              <Badge variant="default" className="text-xs">
                {currentSelectedFilters[filterType].length} selected
              </Badge>
            )}
          </div>
          {!isProductForm && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAddInput((prev) => ({ ...prev, [`${categoryKey}-${filterType}`]: true }))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Add new item input - only show if not in product form */}
        {!isProductForm && showAddInput[`${categoryKey}-${filterType}`] && (
          <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <Input
              placeholder={`Add new ${title.toLowerCase()}`}
              value={newItemInputs[`${categoryKey}-${filterType}`] || ""}
              onChange={(e) =>
                setNewItemInputs((prev) => ({
                  ...prev,
                  [`${categoryKey}-${filterType}`]: e.target.value,
                }))
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addItem(categoryKey, filterType, newItemInputs[`${categoryKey}-${filterType}`])
                }
                if (e.key === "Escape") {
                  setShowAddInput((prev) => ({ ...prev, [`${categoryKey}-${filterType}`]: false }))
                }
              }}
              className="text-sm"
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addItem(categoryKey, filterType, newItemInputs[`${categoryKey}-${filterType}`])}
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowAddInput((prev) => ({ ...prev, [`${categoryKey}-${filterType}`]: false }))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Items as inline tags */}
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {!isProductForm && editingItems[`${categoryKey}-${filterType}-${item}`] ? (
                <div className="flex items-center gap-1 bg-white border rounded-md px-2 py-1">
                  <Input
                    value={editingItems[`${categoryKey}-${filterType}-${item}`]}
                    onChange={(e) =>
                      setEditingItems((prev) => ({
                        ...prev,
                        [`${categoryKey}-${filterType}-${item}`]: e.target.value,
                      }))
                    }
                    className="h-6 text-sm border-0 p-0 w-24"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        editItem(categoryKey, filterType, item, editingItems[`${categoryKey}-${filterType}-${item}`])
                      }
                      if (e.key === "Escape") {
                        cancelEditing(categoryKey, filterType, item)
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0"
                    onClick={() =>
                      editItem(categoryKey, filterType, item, editingItems[`${categoryKey}-${filterType}-${item}`])
                    }
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0"
                    onClick={() => cancelEditing(categoryKey, filterType, item)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Badge
                  variant={currentSelectedFilters[filterType]?.includes(item) ? "default" : "secondary"}
                  className="flex items-center gap-1 px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleFilterSelection(filterType, item)}
                >
                  {item}
                  {!isProductForm && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-1 hover:text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(categoryKey, filterType, item)
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteItem(categoryKey, filterType, item)
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {items.length === 0 && !isProductForm && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No {title.toLowerCase()} added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowAddInput((prev) => ({ ...prev, [`${categoryKey}-${filterType}`]: true }))}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First {title.slice(0, -1)}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const ProductCard = ({ product }) => (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={product.images?.[0] || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <Badge variant="secondary" className="absolute top-2 right-2">
          {product.status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold">${product.price}</span>
          <Badge variant="outline">{product.mainCategory}</Badge>
        </div>

        {/* Product Filters */}
        {product.filters && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Filters:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(product.filters).map(([filterType, values]) =>
                values.map((value) => (
                  <Badge key={`${filterType}-${value}`} variant="outline" className="text-xs">
                    {value}
                  </Badge>
                )),
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
          <div className="flex gap-2">
            <Link href={`/products/${product.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/products/edit/${product.id}`}>
              <Button size="sm" variant="outline">
                <Edit2 className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!isProductForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Dynamic Category Management System
            </CardTitle>
            <p className="text-sm text-gray-600">
              Create new main categories with custom attributes, manage filters, and view matching products.
            </p>
          </CardHeader>
        </Card>
      )}

      {/* Create New Category Form - Show for both product form and regular view */}
      {showCreateCategoryForm && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Create New Main Category
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateCategoryForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Keep all the existing form content exactly the same */}
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Jewelry, Electronics, Sports"
                />
              </div>
              <div>
                <Label htmlFor="categoryKey">Category Key *</Label>
                <Input
                  id="categoryKey"
                  value={newCategoryForm.key}
                  onChange={(e) => setNewCategoryForm((prev) => ({ ...prev, key: e.target.value }))}
                  placeholder="e.g., jewelry, electronics, sports"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                value={newCategoryForm.description}
                onChange={(e) => setNewCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>

            {/* Attributes section - keep all existing code */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-medium">Category Attributes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAttributeToForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Attribute
                </Button>
              </div>

              {newCategoryForm.attributes.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p>No attributes added yet. Click "Add Attribute" to create your first filter category.</p>
                </div>
              )}

              <div className="space-y-4">
                {newCategoryForm.attributes.map((attribute, attributeIndex) => (
                  <Card key={attributeIndex} className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{attribute.displayName}</h4>
                        <p className="text-sm text-gray-500">Key: {attribute.name}</p>
                        <p className="text-xs text-gray-400">{attribute.items.length} items</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAttributeFromForm(attributeIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Add items to attribute */}
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder={`Add ${attribute.displayName.toLowerCase()} item (e.g., Red, Large, Cotton)`}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            addItemToAttribute(attributeIndex, e.target.value.trim())
                            e.target.value = ""
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector("input")
                          if (input.value.trim()) {
                            addItemToAttribute(attributeIndex, input.value.trim())
                            input.value = ""
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Display items */}
                    <div className="flex flex-wrap gap-2">
                      {attribute.items.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <button
                            type="button"
                            onClick={() => removeItemFromAttribute(attributeIndex, itemIndex)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {attribute.items.length === 0 && (
                      <div className="text-center py-4 text-gray-400 border border-dashed border-gray-200 rounded">
                        <p className="text-sm">No items added to {attribute.displayName} yet</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateCategoryForm(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={createNewCategory}
                disabled={
                  !newCategoryForm.name ||
                  !newCategoryForm.key ||
                  newCategoryForm.attributes.every((attr) => attr.items.length === 0)
                }
              >
                Create Category
                {newCategoryForm.attributes.some((attr) => attr.items.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {newCategoryForm.attributes.reduce((total, attr) => total + attr.items.length, 0)} items
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{isProductForm ? "Select Main Category" : `Main Category Selection (${mainCategories.length})`}</span>
            {/* ADD THIS: Show Create New Category button for both product form and regular view */}
            <Button type="button" variant="outline" onClick={() => setShowCreateCategoryForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Category
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainCategories.map((categoryKey) => (
              <div
                key={categoryKey}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                  selectedMainCategory === categoryKey
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleMainCategorySelect(categoryKey)}
              >
                {!isProductForm && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMainCategory(categoryKey)
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}

                <div className={`text-center ${!isProductForm ? "pr-8" : ""}`}>
                  <h3 className="font-medium text-lg">{categorySystem[categoryKey].name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {categorySystem[categoryKey].description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {Object.keys(categorySystem[categoryKey]).length - 2} attributes
                  </p>
                  {selectedMainCategory === categoryKey && (
                    <Badge variant="default" className="mt-2">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Filters Based on Selected Category */}
      {currentCategoryData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isProductForm ? "Select Product Filters" : `Filters for ${currentCategoryData.name}`}</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {Object.values(currentSelectedFilters).flat().length} total selections
                  </Badge>
                  <Button type="button" variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                  {!isProductForm && (
                    <Button type="button" variant="default" size="sm" onClick={() => setShowProducts(!showProducts)}>
                      <Search className="w-4 h-4 mr-2" />
                      {showProducts ? "Hide Products" : "Show Products"} ({filteredProducts.length})
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Render all attributes dynamically */}
          {Object.entries(currentCategoryData)
            .filter(([key]) => !["name", "description"].includes(key))
            .map(([filterType, items]) => (
              <FilterSection
                key={filterType}
                title={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                filterType={filterType}
                items={items}
                categoryKey={selectedMainCategory}
              />
            ))}
        </div>
      )}

      {/* Products Display */}
      {!isProductForm && showProducts && selectedMainCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Matching Products ({filteredProducts.length})
              </span>
              <Link href="/products/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-4">No products match the selected category and filters.</p>
                <Link href="/products/add">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Category Selected State */}
      {!selectedMainCategory && (
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Main Category</h3>
            <p className="text-gray-500 mb-4">
              Choose a main category above to see relevant filters and subcategories.
            </p>
            {!isProductForm && (
              <p className="text-sm text-gray-400">
                You can also create new categories with custom attributes that will appear here automatically.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedMainCategory && Object.values(currentSelectedFilters).flat().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="font-medium">
                  Main Category: {currentCategoryData.name}
                </Badge>
              </div>
              {Object.entries(currentSelectedFilters).map(([filterType, items]) => {
                if (!items || items.length === 0) return null
                return (
                  <div key={filterType} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {filterType.replace(/([A-Z])/g, " $1").trim()}:
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {items.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
