import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The Fashion Bot
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="font-medium">
              Login
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 font-medium">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
