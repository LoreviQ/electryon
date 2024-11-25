import type { MetaFunction } from "@remix-run/node";
import { Hero, FeatureCard } from "~/components/cards";
import { CoinIcon, BuildingIcon, VerifiedIcon } from "~/components/icons";

export const meta: MetaFunction = () => {
    return [
        { title: "Electryon - BTC-Backed Stablecoin & Fractional Investment Platform" },
        {
            name: "description",
            content:
                "Discover Electryon's BTC-backed stablecoin and invest in fractional shares of promising businesses.",
        },
    ];
};

export default function Index() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <Hero />
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                <FeatureCard
                    header="BTC-Backed Stablecoin"
                    description="Secure your wealth with our Bitcoin-backed stablecoin, combining stability with the security of BTC."
                    icon={<CoinIcon />}
                    iconBgColor="bg-blue-500/20"
                />
                <FeatureCard
                    header="Fractional Investment"
                    description="Invest in verified businesses with any amount through our fractional ownership platform."
                    icon={<BuildingIcon />}
                    iconBgColor="bg-purple-500/20"
                />
                <FeatureCard
                    header="Verified Partners"
                    description="All partner businesses are thoroughly vetted to ensure security and reliability for our investors."
                    icon={<VerifiedIcon />}
                    iconBgColor="bg-green-500/20"
                />
            </div>
        </div>
    );
}
