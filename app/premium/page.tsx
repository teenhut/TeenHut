import PricingCard from "@/components/premium/PricingCard";

export default function PremiumPage() {
  const plans = [
    {
      title: "Lite Premium",
      price: "49",
      duration: "month",
      features: [
        "Verified badge",
        "Custom profile themes",
        "Slight XP boost (1.2x XP)",
        "Remove basic ads",
      ],
    },
    {
      title: "Full Premium",
      price: "99",
      duration: "month",
      features: [
        "All Lite Premium features",
        "Unlimited hype uploads",
        "1-on-1 mentor calls",
        "Creator analytics dashboard",
        "2x XP & credit multiplier",
        "Early access to features",
      ],
    },
    {
      title: "Power Premium",
      price: "249",
      duration: "3 months",
      features: [
        "All Full Premium features",
        "Verified crown",
        "Profile boost",
        "Custom mentor badge",
        "Premium challenges",
        "Priority tech & mentor support",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white text-primary font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">TeenHut Premium</h1>
          <p className="text-xl text-gray-600">
            Earn credits to unlock features!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              duration={plan.duration}
              features={plan.features}
            />
          ))}
        </div>

        <div className="text-center mt-12 text-gray-400 text-sm">
          DM us on Instagram @teenhut.home
        </div>
      </div>
    </main>
  );
}
