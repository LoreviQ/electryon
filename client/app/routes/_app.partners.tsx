import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PARTNERS_DATA } from "~/dummy_data";

export type Partner = {
    id: number;
    name: string;
    path_name: string;
    logo: string;
    description: string;
    marketCap: number;
    tradeVolume: number;
    category: string;
    country: string;
};

export async function loader() {
    // TODO: Replace with actual API call
    const partners: Partner[] = PARTNERS_DATA;

    return json({ partners });
}

export default function Partners() {
    const { partners } = useLoaderData<typeof loader>();

    return (
        <div className="space-y-6">
            {/* Filters Header */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Partners</h1>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                        <FunnelIcon className="h-5 w-5" />
                        <span>Filters</span>
                    </button>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search partners..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pr-10 text-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300">
                        <option value="">All Categories</option>
                        <option value="exchange">Exchanges</option>
                        <option value="payment">Payment Providers</option>
                        <option value="tech">Technology</option>
                    </select>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300">
                        <option value="">All Regions</option>
                        <option value="na">North America</option>
                        <option value="eu">Europe</option>
                        <option value="asia">Asia</option>
                    </select>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-4 gap-6">
                {partners.map((partner) => (
                    <Link
                        key={partner.id}
                        to={`/partners/${partner.path_name}`}
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors shadow-lg"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    className="w-full object-contain"
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-center">{partner.name}</h3>
                                <div className="text-sm text-gray-400 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Market Cap:</span>
                                        <span className="text-gray-200">
                                            ${(partner.marketCap / 1000000).toFixed(1)}M
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>24h Volume:</span>
                                        <span className="text-gray-200">
                                            ${(partner.tradeVolume / 1000000).toFixed(1)}M
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Category:</span>
                                        <span className="text-gray-200">{partner.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Country:</span>
                                        <span className="text-gray-200">{partner.country}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
