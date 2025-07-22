"use client"

import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { setCategory } from "./store"
import { useMemo } from "react"

export function CategorySelector() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { category } = useSelector((state) => state.products.filters)

  // Memoized unique categories from products
  const categories = useSelector((state) => state.products.products)
  const uniqueCategories = useMemo(() => {
    return [...new Set(categories.map((p) => p.category))]
  }, [categories])

  const handleCategoryChange = (newCategory) => {
    dispatch(setCategory(newCategory))
    // Update URL to match selected category
    router.push(`/allProducts/showcase/${newCategory.toLowerCase()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueCategories.map((cat) => (
        <button
          key={cat?.toLowerCase() || cat}
          onClick={() => handleCategoryChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            category && category.toLowerCase() === cat?.toLowerCase() ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
