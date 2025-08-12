import "../../globals.css"

export const metadata = {
  title: "Gift Commerce - Order Management",
  description: "Advanced Order Management System for Gift Commerce",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans">{children}</body>
    </html>
  )
}