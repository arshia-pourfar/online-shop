export default function OrderSummarySkeleton() {
    return (
        <div className="bg-secondary-bg rounded-xl shadow-md p-6 space-y-6 h-fit animate-pulse">
            <div className="h-6 w-1/3 bg-secondary-text/40 rounded"></div>
            <div className="flex justify-between">
                <div className="h-4 w-20 bg-secondary-text/40 rounded"></div>
                <div className="h-4 w-16 bg-secondary-text/40 rounded"></div>
            </div>
            <div className="flex justify-between">
                <div className="h-4 w-20 bg-secondary-text/40 rounded"></div>
                <div className="h-4 w-12 bg-secondary-text/40 rounded"></div>
            </div>
            <div className="border-t border-secondary-text pt-4 flex justify-between font-bold text-lg">
                <div className="h-5 w-16 bg-secondary-text/40 rounded"></div>
                <div className="h-5 w-20 bg-secondary-text/40 rounded"></div>
            </div>
            <div className="w-full h-11 bg-secondary-text/40 rounded-lg"></div>
        </div>
    );
}
