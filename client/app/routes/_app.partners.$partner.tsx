import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { supabase } from "~/utils/db.server";
import type { Partner } from "~/types/database";

export async function loader({ params }: LoaderFunctionArgs) {
    try {
        const { data: partner, error } = await supabase
            .from("partners")
            .select("*")
            .eq("path_name", params.partner)
            .single();

        if (error) throw error;
        if (!partner) throw new Error("Partner not found");

        return json({ partner });
    } catch (error) {
        console.error("Database error:", error);
        throw new Response("Partner not found", { status: 404 });
    }
}

export default function PartnerDetail() {
    const { partner } = useLoaderData<typeof loader>();

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-6">
                    <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="w-24 h-24 object-contain bg-gray-700 rounded-lg p-2"
                    />
                    <div>
                        <h1 className="text-3xl font-bold">{partner.name}</h1>
                        <p className="text-gray-400 mt-2">
                            {partner.category} · {partner.country}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Description Card */}
                <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">About</h2>
                    <p className="text-gray-300">{partner.description}</p>
                </div>

                {/* Stats Card */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Statistics</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400">Market Cap</p>
                            <p className="text-xl font-semibold">${partner.market_cap.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Trade Volume</p>
                            <p className="text-xl font-semibold">${partner.trade_volume.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Season</p>
                            <p className="text-xl font-semibold">{partner.season}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Links Section */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Links</h2>
                <div className="flex gap-4">
                    <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                        Website
                    </a>
                    {partner.twitter && (
                        <a
                            href={partner.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                        >
                            Twitter
                        </a>
                    )}
                    {partner.telegram && (
                        <a
                            href={partner.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                        >
                            Telegram
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
