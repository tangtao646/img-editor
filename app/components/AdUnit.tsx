interface AdUnitProps {
    AdId:String;
    slot: string;
    className?: string;
}

export const AdUnit = ({ AdId, slot }: { AdId: string, slot: string }) => {
    return (
        <div className="hidden xl:block sticky top-20 h-min">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '150px', height: '500px' }}
                data-ad-client={AdId}
                data-ad-slot={slot}
            />
        </div>
    );
};