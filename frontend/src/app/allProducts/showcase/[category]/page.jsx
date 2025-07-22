import React from 'react';
import { CategoryShowcase } from "../category-showcase"
import { Providers } from "../providers"

export default async function CategoryPage({ params }) {
  const awaitedParams = await params;
  const { category } = awaitedParams;

  // Convert URL parameter to proper category name (e.g., "balloons" to "Balloons")
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <Providers initialCategory={categoryName}>
      <CategoryShowcase categoryName={categoryName} />
    </Providers>
  )
}
