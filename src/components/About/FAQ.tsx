
export default (
    <div className={"container container-content container-margin grid grid-cols-1 gap-8"}>
        <div className={"relative py-16 px-8 bg-gray-900 rounded-xl shadow-lg"} style={{ backgroundImage: `url('/assets/about/FAQ.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h1 className={"text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase text-orange-400"}>Frequently Asked Questions</h1>
            <p className={"block text-lg w-full md:w-10/12 lg:w-8/12 xl:w-6/12 pt-6"}>
                Check out our most common questions that may help you.
            </p>
        </div>

        <div className={"content-box"}>
            <div className={"grid grid-cols-1 gap-8"}>
                <div>
                    <div className="font-semibold text-lg pb-2">How do I change my profile picture?</div>
                    Your profile picture is synced with the Single Sign On provider that you use (Facebook, Discord, Twitter,
                    etc). If you change your profile picture on the provider that your account is from, then logging out and
                    logging in of Keymash will refresh it.
                </div>

                <div>
                    <div className="font-semibold text-lg pb-2">Why is my Discord discriminator (#0000) not the same?</div>
                    We utilize a similar system to Discord including Snowflake UUID's and their discriminator. When you log in with Discord we apply our own discriminator that is not exclusive to Discord.
                </div>

                <div>
                    <div className="font-semibold text-lg pb-2">What parts of the game can you gain achievements and statistics?</div>
                    Public matches including "Dictionary" and "Quotes" in the Play menu and Ranked matches will give you statistics.
                    Tournaments and Custom matches do NOT count.
                </div>

                <div>
                    <div className="font-semibold text-lg pb-2">When do Guest accounts get removed?</div>
                    Guest accounts get removed every 7 days after their creation.
                </div>

                <div>
                    <div className="font-semibold text-lg pb-2">What does FKD system mean?</div>
                    FKD or <span className="font-semibold text-orange-400">"First Keystroke Delay"</span> is where we calculate the time it takes for the first keystroke to be typed and then subtract it 
                    from the overall time it takes to finish a match or round. We use this system to help eliminate the "latency" problem that is commonly 
                    found in typing games so that we can give the most accurate measurement of typing speed.
                </div>

                <div>
                    <div className="font-semibold text-lg pb-2">Why are Replay's only available for 90 days?</div>
                    To help manage storage costs of storing each replay, we have added an expiry date to each replay. 
                    The 90 day expiry may change at a later time.
                </div>
            </div>
        </div>
    </div>
);