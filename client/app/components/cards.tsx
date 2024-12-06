import type { Partner } from "~/types/database";
import { Link } from "@remix-run/react";
import { GlobeIcon, TwitterIcon, TelegramIcon } from "./icons";

export function Hero({}) {
    return (
        <div className="container mx-auto px-4 pt-20 pb-32">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    The Future of Stable Digital Assets
                </h1>
                <p className="text-xl text-gray-300 mb-12">
                    Experience the security of Bitcoin-backed stablecoins and unlock new investment opportunities
                    through fractional business ownership.
                </p>
                <div className="flex gap-6 justify-center">
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/partners"
                        className="px-8 py-3 border border-gray-500 hover:border-blue-400 rounded-lg font-semibold transition-colors"
                    >
                        View Partner Businesses
                    </Link>
                </div>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    header: string;
    description: string;
    icon: React.ReactNode;
    iconBgColor?: string;
}
export function FeatureCard({ header, description, icon, iconBgColor = "bg-blue-500/20" }: FeatureCardProps) {
    return (
        <div className="p-6 rounded-xl bg-gray-800 border border-gray-700">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}>{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{header}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

export function PartnerCard({ partner }: { partner: Partner }) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors shadow-lg">
            <div className="relative">
                <Link key={partner.id} to={`/partners/${partner.path_name}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex justify-center mb-4">
                            <img src={partner.logo} alt={`${partner.name} logo`} className="w-full object-contain" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-center min-h-[calc(theme(lineHeight.6)*2)] flex items-center justify-center">
                                {partner.name}
                            </h3>
                            <div className="text-sm text-gray-400 space-y-1">
                                <div className="flex justify-between">
                                    <span>Market Cap:</span>
                                    <span className="text-gray-200">${(partner.market_cap / 1000000).toFixed(1)}M</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>24h Volume:</span>
                                    <span className="text-gray-200">
                                        ${(partner.trade_volume / 1000000).toFixed(1)}M
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="flex gap-2 mt-2">
                    <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GlobeIcon color="text-gray-200" />
                    </a>
                    <a
                        href={partner.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <TwitterIcon color="text-gray-200" />
                    </a>
                    <a
                        href={partner.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <TelegramIcon color="text-gray-200" />
                    </a>
                </div>
            </div>
        </div>
    );
}
