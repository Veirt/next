import Config from "../../Config";

export default (
    <div className={"mt-12 text-center lg:text-left"}>
        <div className={"relative hero flex py-24 bg-gray-900"} style={{ backgroundImage: `url('/assets/about/TROUBLESHOOTING.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={"container m-auto"}>
                <div className={"w-full grid grid-cols-3 gap-16"}>
                    <div className={"col-span-full lg:col-span-1"}>
                        <h1 className={"text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase text-orange-400"}>Troubleshooting</h1>
                        <p className={"text-white text-lg font- pt-6"}>
                            Make sure to read the following before submitting an issue to our Issue Tracker!
                        </p>
                    </div>
                </div>
            </div>

            
        </div>

        <div className={"h-full bg-gray-775 text-white py-10"}>
            <div className={"container"}>
                <div>
                    <p className={"text-white text-lg"}>
                        <div className="pb-5 mb-5 border-b border-gray-600">
                            <div className="font-semibold pb-2">Please complete the following below through your <span className={"text-orange-400"}>browser settings</span> before continuing on with the page:</div>
                            <ul className={"pl-6 list-disc pb-2"}>
                                <li>Clear your cache</li>
                                <li>Delete your cookies</li>
                                <li>Disable Tampermonkey/Greasemonkey scripts</li>
                                <li>Disable "Dark Reader" extensions</li>
                            </ul>
                            Below this section will have a list of problems with solutions <span className={"text-orange-400"}>based off</span> the information you have followed <span className={"text-orange-400"}>above</span>.
                        </div>

                        <div className="pb-5">
                            <div className="font-semibold text-lg pb-2">All each page shows is Loading spinners that show for longer than 15 seconds</div>
                            Typically, if we release an update that may change the API in any way it may not load the information the same way it should. This is usually due to some form of caching issues with Cloudflare and not necessarily with your browser.
                            We try to combat this problem by having a version controller that will automatically reset your session but sometimes that also does not work. You can fix this by logging out of your account manually by clicking <a className="text-blue-400 hover:underline" href={`${Config.oauthUrl}/logout`}>here</a>.
                        </div>

                        <div>
                            <div className="font-semibold text-lg pb-2">When playing in a match it does not show the end match results screen</div>
                            Unfortunately this problem happens for players that may have an inconsistent internet connection. While there's not a lot of ways we can solve this, we are actively monitoring this issue each and
                            every day so we can at least create a more consistent experience for our typists. While your match isn't finishing, in the bottom right we have a new "Report an issue" icon where you can copy your debug
                            logs and can either message Staff on Discord or email us directly at support@Keymash
                        </div>
                    </p>
                </div>
            </div>
        </div>
    </div>
);