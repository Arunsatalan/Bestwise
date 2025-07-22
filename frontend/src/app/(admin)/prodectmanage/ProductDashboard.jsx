// ProductDashboard with working category filter (clean, robust)

"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Modal, useConfirmModal } from "../../../components/ui/modal"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { getAllCategories } from "../../allProducts/showcase/sample-data"

export default function ProductDashboard() {
  /** @type {[Product[], React.Dispatch<React.SetStateAction<Product[]>>]} */
  const [products, setProducts] = useState([])
  /** @type {[Category[], React.Dispatch<React.SetStateAction<Category[]>>]} */
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterStock, setFilterStock] = useState("")
  const [loading, setLoading] = useState(true)
  const [categoriesData, setCategoriesData] = useState([])
  const { isOpen, config, showDelete, showSuccess, showError, closeModal } = useConfirmModal()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const filterParam = urlParams.get('filter')
    if (filterParam === 'low-stock') {
      setFilterStock('low-stock')
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    loadCategoriesData()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/products?limit=1000")
      const result = await response.json()
      setProducts(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategoriesData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories")
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setCategoriesData(result.data)
      } else {
        setCategoriesData(getAllCategories())
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      setCategoriesData(getAllCategories())
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "destructive" }
    if (stock < 10) return { label: "Low Stock", color: "secondary" }
    return { label: "In Stock", color: "default" }
  }

  const deleteProduct = async (id) => {
    showDelete("Delete Product", "Are you sure you want to delete this product?", async () => {
      try {
        const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
        if (response.ok) {
          showSuccess("Deleted", "Product deleted successfully", fetchProducts)
        } else {
          showError("Error", "Failed to delete product.")
        }
      } catch (error) {
        console.error(error)
        showError("Error", "An error occurred while deleting.")
      }
    })
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const productCategory = product.mainCategory || product.category || ""
    const matchesCategory = !filterCategory || productCategory.toLowerCase() === filterCategory.toLowerCase()

    const matchesStatus = !filterStatus || product.status === filterStatus

    let matchesStock = true
    if (filterStock) {
      const stockStatus = getStockStatus(product.stock).label.toLowerCase().replace(/\s+/g, '-')
      matchesStock = stockStatus === filterStock
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesStock
  })

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      if (typeof product.images[0] === 'object' && product.images[0].url) {
        return product.images[0].url
      }
      return product.images[0]
    }
    return "/placeholder.svg"
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link href="/prodectmanage/products/add"><Button><Plus className="w-4 h-4 mr-1" /> Add Product</Button></Link>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap gap-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categoriesData.map(cat => (
              <option key={cat._id} value={(cat.key || cat.name).toLowerCase()}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setFilterCategory("");
            setFilterStatus("");
            setFilterStock("");
          }}>Clear Filters</Button>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 && <p className="text-center text-gray-500">No products found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => {
          const stockStatus = getStockStatus(product.stock)
          return (
            <Card key={product._id || product.id}>
              <div className="relative aspect-square">
                <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover" />
                <Badge variant={stockStatus.color} className="absolute top-2 right-2">{stockStatus.label}</Badge>
              </div>
              <CardContent className="p-3">
                <h2 className="font-semibold truncate">{product.name}</h2>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">${product.price || product.retailPrice}</span>
                  <Badge>{product.mainCategory || product.category}</Badge>
                </div>
                <div className="flex gap-1 mt-2">
                  <Link href={`/prodectmanage/products/${product._id || product.id}`}><Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button></Link>
                  <Link href={`/prodectmanage/products/edit/${product._id || product.id}`}><Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button></Link>
                  <Button size="sm" variant="outline" onClick={() => deleteProduct(product._id || product.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        onCancel={closeModal}
        title={config.title}
        message={config.message}
        type={config.type}
        onConfirm={config.onConfirm}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        showCancel={config.showCancel}
      >
        {config.children}
      </Modal>
    </div>
  )
}
