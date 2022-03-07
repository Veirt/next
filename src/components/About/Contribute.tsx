export default (
    <div className={"text-center lg:text-left"}>
      <div className={"relative hero flex py-24 bg-gray-900"} style={{ backgroundImage: `url('/assets/about/CONTRIBUTE.webp')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className={"container m-auto"}>
          <div className={"w-full grid grid-cols-2 gap-16"}>
            <div className={"col-span-full lg:col-span-1"}>
              <h1 className={"text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase text-orange-400"}>Contribute</h1>
              <p className={"text-white text-lg font- pt-6"}>
                  Start contributing to Keymash by submitting texts that can be used in the game or helping with translations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={"py-10 bg-gray-800"}>
        <div className={"container"}>
          <div className={"grid grid-cols-1 gap-8"}>
            <div>
              <h2 className={"text-orange-400"}>Information</h2>
              <p className={"pt-2 text-white text-lg"}>
                Keymash was started as a hobby project and still is a hobby project. The staff generate no proper source of
                income for the game or has any financial backing besides one person's bank account. Because of this we rely on
                community feedback to make sure that Keymash is a game that everyone can stand by and be proud of.
              </p>
            </div>

            <div>
              <h2 className={"text-orange-400"}>Texts</h2>
              <p className={"pt-2 text-white text-lg"}>
                The quotes that you type on come from the community, we continuously use quotes submitted by the community for
                the game. If you would like to submit your own quote that you would want to see in the game, click the link
                below:
                <a
                    href="https://keymash.io/submit"
                    target="_blank"
                    className="block my-2 text-orange-300 hover:text-orange-400 uppercase font-semibold transition ease-in-out duration-300"
                    rel="noopener noreferrer"
                >
                  Keymash Text Submission
                </a>
                All quotes submitted must abide by the rules provided in the URL.
              </p>
            </div>

            <div>
              <h2 className={"text-orange-400"}>Translations</h2>
              <p className={"pt-2 text-white text-lg"}>
                There are over 7 billion people in the world, only 2 billion of them speak and understand English. That means we
                are missing another potential 5 billion people to the game! All translations are community driven, unfortunately
                we don't know each and every language in the world so this process becomes a lot longer and harder for us to
                achieve. If you'd like to help us out, visit the URL below:
                <a
                    href="https://keymash.oneskyapp.com"
                    target="_blank"
                    className="block mt-2 text-orange-300 hover:text-orange-400 uppercase font-semibold transition ease-in-out duration-300"
                    rel="noopener noreferrer"
                >
                  Keymash Translation Center
                </a>
              </p>
            </div>

            <div>
              <h2 className={"text-orange-400"}>Patreon</h2>
              <p className={"pt-2 text-white text-lg"}>
                Our main source of income is through our Ad Provider, Teespring Merch and most importantly our Patreon. Patreon is our highest source of income compared to Keymash as a whole therefore most of our costs
                in terms of hosting, domain and our contests are provided to the community through our Patreon. We want to thank all of our contributors who have helped thus far, if you would like to become a Patron you can check out the link below:
                <a
                    href="https://patreon.com/keymashgame"
                    target="_blank"
                    className="block mt-2 text-orange-300 hover:text-orange-400 uppercase font-semibold transition ease-in-out duration-300"
                    rel="noopener noreferrer"
                >
                  Keymash Official Patreon
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
);
