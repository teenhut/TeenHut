import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean; // For styling if needed
}

export default function PricingCard({
  title,
  price,
  duration,
  features,
  isPopular,
}: PricingCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 flex flex-col h-full border border-gray-200 hover:border-black transition-colors shadow-sm hover:shadow-md">
      <h3 className="text-xl font-bold text-center mb-2 text-black">{title}</h3>
      <div className="text-center mb-6">
        <span className="text-3xl font-bold text-black">₹{price}</span>
        <span className="text-gray-500 text-sm"> /{duration}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-gray-700"
          >
            <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-full">
        Choose Plan
      </Button>
    </div>
  );
}
