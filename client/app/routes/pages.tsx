// Simple page to show expected pages within scope during development

export default function Pages() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-4xl font-bold">Pages</h1>
            <a href="/" className="text-blue-400 hover:underline">
                root
            </a>
            <a href="/login" className="text-blue-400 hover:underline">
                login
            </a>
            <a href="/register" className="text-blue-400 hover:underline">
                register
            </a>
            <a href="/partners" className="text-blue-400 hover:underline">
                partners
            </a>
            <a href="/subscribe" className="text-blue-400 hover:underline">
                about
            </a>
            <a href="/dashboard" className="text-blue-400 hover:underline">
                dashboard
            </a>
        </div>
    );
}
