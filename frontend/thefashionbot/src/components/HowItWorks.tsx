import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and securely save your shipping address, payment method, and preferences. This takes just 2 minutes.",
    highlight: "One-time setup",
  },
  {
    number: "02",
    title: "Find Your Product",
    description: "Browse your favorite online stores and find the perfect item. Copy the product URL from your browser.",
    highlight: "Any store, any product",
  },
  {
    number: "03",
    title: "Paste & Relax",
    description: "Paste the product link into The Fashion Bot. Our AI will automatically select size, fill checkout forms, and complete the purchase.",
    highlight: "Fully automated",
  },
  {
    number: "04",
    title: "Get Confirmation",
    description: "Receive instant confirmation and tracking details. Your order is on its way without any manual checkout hassle.",
    highlight: "Done in seconds",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From setup to checkout in four simple steps. Shopping has never been this effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>

              {/* Content */}
              <div className="ml-8">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                  {step.highlight}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow for connection (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-indigo-300">
                  <ArrowRight className="h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6 group">
            Start Shopping Smarter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
