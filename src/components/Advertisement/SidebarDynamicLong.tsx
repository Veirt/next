
/*
 * NOTE: These do not contain padding/margins on the top and bottoms
 * This also has a height of 250-800px / Dynamic
 */

function SidebarDynamicLong() {
    return (
        <div className={"pw bg-black bg-opacity-60 w-full mx-auto"}>
            <div id="responsive-bottom-square" className="pw-ph-leaderboard" data-pw-desk="med_rect_btf" data-pw-mobi="med_rect_btf" />
        </div>
    )
}

export default SidebarDynamicLong;