
interface AdUnitProps {
    AdId:String;
    slot: string;
    className?: string;
}

export const AdUnit = ({ AdId,slot, className }: AdUnitProps) => {
    return (
        <div className={`hidden xl:block sticky top-20 h-min ${className}`}>
            <div
                className="bg-gray-100 text-gray-500 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-sm font-mono p-1"
                style={{ width: 'auto', height: '450px', fontSize: '10px' }}
            >
                <ins
                    className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '100%' }}
                    data-ad-client={AdId}
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                ></ins>
            </div>
        </div>
    );
};