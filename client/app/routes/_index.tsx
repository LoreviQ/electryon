import type { MetaFunction } from "@remix-run/node";
import { Hero, FeatureCard } from "~/components/cards";
import { CoinIcon, BuildingIcon, VerifiedIcon } from "~/components/icons";

export const meta: MetaFunction = () => {
    return [
        { title: "Electryon - Gameified Fractional Investment" },
        {
            name: "description",
            content: "Discover Electryon's gameified fractional investment in promising businesses.",
        },
    ];
};

export default function Index() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <Hero />
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                <FeatureCard
                    header="Gamified Investment"
                    description="Roll the dice and collect properties (real businesses) to earn tokens that can be exchanged for SOL."
                    icon={<CoinIcon color="text-blue-400" />}
                    iconBgColor="bg-blue-500/20"
                />
                <FeatureCard
                    header="Fractional Investment"
                    description="Invest in verified businesses with any amount through our fractional ownership platform."
                    icon={<BuildingIcon color="text-purple-400" />}
                    iconBgColor="bg-purple-500/20"
                />
                <FeatureCard
                    header="Verified Partners"
                    description="All partner businesses are thoroughly vetted to ensure security and reliability for our investors."
                    icon={<VerifiedIcon color="text-green-400" />}
                    iconBgColor="bg-green-500/20"
                />
            </div>
        </div>
    );
}
