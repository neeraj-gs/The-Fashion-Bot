import { UserCircle, Link, Zap, Shield, Clock, CreditCard } from "lucide-react"

const features = [
  {
    icon: UserCircle,
    title: "One-Time Setup",
    description: "Submit your shipping and payment information just once. We securely store it for all future purchases.",
  },
  {
    icon: Link,
    title: "Paste & Purchase",
    description: "Simply paste any product link from your favorite store and we'll handle the entire checkout process.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Complete checkouts in seconds, not minutes. Beat the rush and never miss out on limited items again.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level encryption protects your data. We never store full payment details on our servers.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Shop whenever you want. Our bot works around the clock to complete your purchases instantly.",
  },
  {
    icon: CreditCard,
    title: "Auto-Fill Everything",
    description: "No more repetitive form filling. We automatically complete all shipping and billing information.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose The Fashion Bot?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience hassle-free shopping with powerful automation that saves you time and effort.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
