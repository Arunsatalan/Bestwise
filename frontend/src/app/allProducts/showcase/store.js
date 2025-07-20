import { createSlice, configureStore } from "@reduxjs/toolkit"

// Initial state
const initialState = {
  products: [],
  filteredProducts: [],
  filters: {
    category: "", // Default to "All Categories" (empty string)
    filters: {},
  },
  loading: false,
  error: null,
}

// Create slice
export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
      state.filteredProducts = action.payload.filter(
        (product) => product.category === state.filters.category || state.filters.category === ""
      )
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload
      state.filters.filters = {}
      state.filteredProducts = state.products.filter(
        (product) => product.category === action.payload || action.payload === ""
      )
    },
    setFilter: (state, action) => {
      const { key, values } = action.payload
      state.filters.filters[key] = values

      state.filteredProducts = state.products.filter((product) => {
        if (product.category !== state.filters.category && state.filters.category !== "") return false

        for (const [filterKey, filterValues] of Object.entries(state.filters.filters)) {
          if (!filterValues || (Array.isArray(filterValues) && filterValues.length === 0)) continue

          if (filterKey === "price") {
            const [min, max] = filterValues
            if (product.price < min || product.price > max) return false
          } else if (filterKey === "discount") {
            const hasDiscount = product.discount > 0
            if (filterValues[0] === "yes" && !hasDiscount) return false
          } else if (filterKey === "rating") {
            const minRating = Math.min(...filterValues)
            if (product.rating < minRating) return false
          } else {
            const productValue = product.attributes?.[filterKey]
            if (!productValue) continue

            if (Array.isArray(productValue)) {
              if (!filterValues.some((v) => productValue.includes(v))) return false
            } else {
              if (!filterValues.includes(productValue)) return false
            }
          }
        }

        return true
      })
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    sortProducts: (state, action) => {
      const { sortBy, direction } = action.payload
      const multiplier = direction === "asc" ? 1 : -1

      state.filteredProducts = [...state.filteredProducts].sort((a, b) => {
        if (sortBy === "price") {
          const aPrice = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const bPrice = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return (aPrice - bPrice) * multiplier
        } else if (sortBy === "rating") {
          return (a.rating - b.rating) * multiplier
        } else if (sortBy === "name") {
          return a.name.localeCompare(b.name) * multiplier
        } else if (sortBy === "popularity") {
          return (a.ratingCount - b.ratingCount) * multiplier
        }
        return 0
      })
    },
  },
})

// ✅ Export actions
export const {
  setProducts,
  setCategory,
  setFilter,
  setLoading,
  setError,
  sortProducts,
} = productSlice.actions

// ✅ Export productSlice itself
export { productSlice }

// ✅ Export store
export const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
})
