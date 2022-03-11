
export default (
    <div className={"container container-content container-margin grid grid-cols-1 gap-8"}>
        <div className={"relative hero flex py-6 px-8 bg-gray-900 rounded-xl shadow-lg"} style={{ backgroundImage: `url('/assets/about/US.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={"w-full grid grid-cols-2 gap-16"}>
                <div className={"col-span-full lg:col-span-1 my-auto"}>
                    <h1 className={"text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase text-orange-400"}>ABOUT US</h1>
                    <p className={"text-white text-base mt-6 p-2 bg-gradient-to-r from-gray-800 to-transparent rounded-lg"}>
                        Keymash is an online multiplayer typing game that allows typists from all around the world go against each other and find out who comes on top.
                    </p>
                </div>
                <div className={"col-span-full lg:col-span-1 my-auto"}>
                    <img src={'/assets/about/match.png'} className={"w-10/12 lg:w-full h-auto block mx-auto transform lg:scale-110"} alt={"Match mockup"} />
                </div>
            </div>
        </div>

        <div className={"content-box"}>
            <div className={"grid grid-cols-3 gap-16"}>
                <div className={"col-span-full lg:col-span-1"}>
                    <img src={'/assets/about/staff.png'} className={"w-64 lg:w-10/12 h-auto block mx-auto"} alt={"Staff"} />
                </div>
                <div className={"col-span-full lg:col-span-2 my-auto"}>
                    <h2 className={"h1 text-orange-400"}>Our Team</h2>

                    <div className={"pt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 font-semibold text-lg"}>
                        <div>
                            <div className={"text-gray-400"}>Founder / Lead Developer</div>
                            <div className={"text-white"}>Cameron "GNiK" Touchette</div>
                        </div>
                        <div>
                            <div className={"text-gray-400"}>Community Manager / UI Designer</div>
                            <div className={"text-white"}>Lukas "Aevi" Zagura</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={"content-box"}>
            <div className={"grid grid-cols-3 gap-16"}>
                <div className={"col-span-full lg:col-span-2 my-auto"}>
                    <h2 className={"h1 text-orange-400"}>Patreon Supporters</h2>
                    <p className={"text-lg text-gray-500 font-semibold py-4 w-full lg:w-2/3"}>
                        Give a big thanks to all of our supporters for allowing us to keep doing what we're doing!
                    </p>
                    <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-1 font-semibold text-white text-lg"}>
                        <div>heynocnoc</div>
                        <div>daangast</div>
                        <div>Mario</div>
                        <div>prayforwinter</div>
                        <div>oui oui?</div>
                        <div>Pekka</div>
                        <div>lollersham</div>
                        <div>anthony</div>
                        <div>Syndric</div>
                        <div>sinewave</div>
                        <div>cyanamethyst</div>
                        <div>Lego</div>
                        <div>SunshineNurSmile</div>
                        <div>b1ack</div>
                    </div>
                </div>
                <div className={"col-span-full lg:col-span-1"}>
                    <img src={'/assets/about/heart.png'} className={"w-64 lg:w-10/12 h-auto block mx-auto"} alt={"Heart"} />
                </div>
            </div>
        </div> 
    
        <div className="content-box">
            <div className={"grid grid-cols-3 gap-16"}>
                <div className={"col-span-full lg:col-span-1 my-auto"}>
                    <img src={'/assets/about/thumbsup.png'} className={"w-64 lg:w-10/12 h-auto block mx-auto"} alt={"Thumbs Up"} />
                </div>
                <div className={"col-span-full lg:col-span-2"}>
                    <h2 className={"h1 text-orange-400"}>Special Thanks</h2>

                    <div className={"pt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6 font-semibold text-lg"}>
                        <div>
                            <div className={"text-gray-400"}>Graphic Designer</div>
                            <div className={"text-white"}>Joshua Dart</div>
                            <div className={"text-white"}>Luyene</div>
                        </div>
                        <div>
                            <div className={"text-gray-400"}>Shoutouts</div>
                            <div className={"text-white"}>Miodec from Monkeytype</div>
                            <div className={"text-white"}>codico from Speedtyper</div>
                        </div>
                        <div>
                            <div className={"text-gray-400"}>Audio / Sound Effects</div>
                            <div className={"text-white"}>Jon Lachney</div>
                        </div>
                        <div>
                            <div className={"text-gray-400"}>Vulnerability Hunter</div>
                            <div className={"text-white"}>ph0t0shop</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"text-lg font-semibold mt-10 hidden"}>
                <div className={"text-gray-400 pb-1"}>All of our testers prior to November 22nd, 2020</div>
                <div className={"text-white text-base font-normal"}>
                    Aery#8535, ai#3734, Al_The_Awesome#0351, Amaranth#0069, Andrea#5347, Bailey#0048, bluely#6758, Bomb_Guard#0414, call me napkin#3817, chak#5471, Chriss#3132, Climbing Bird YT#4532, Conspyre#9999, craurd#3504, D y l a n#5666, DAN#9019, dancetheorist#5850, Dango#5524, Decone#2516, deroche#8343, dessle#9999, dicey#1000, discoRyne#6820, Dog Galindo xd#9031, eiko#5645, Eni#4999, erik aka shazzy#4466, faxlore#0069, felix.b#1633, firewaran#0241, Foggy#8530, Fruit#9006, poem#3305, Jisoo#2991, Jonathan#6666, Kathy#8713, KeeganT#1689, LaggyLuke#0001, LeSirH#0001, lib#2382, Lord Yhru#0403, Lucky Forrest#2201, luna#1234, MysteriousSilver#8509, Doppler#8434, Nova#1281, oats#6148, POLAKSTWO#6606, Pro QBr#7679, Reimi#0383, samuraipie#4319, Sean Wrona, Seraph#9999, Shouto#5759, sig#7811, Speed Typing#8829, EvilTexan*A$HL3Y*#0001, ssteve#6840, T_0nio#9879, tchke#0001, The Devil#4942, timjeffery44#0004, TyrantTick#1570, valikor#2036, Vielle#5703, Volhosis#6085, Voort Fujiwara#7197 and xX0T1Xx#0272
                </div>
            </div>
        </div>

        <div className="content-box">

            <div className={"text-lg font-semibold"}>
                <h2 className={"h1 text-orange-400 pb-6"}>Contact Us</h2>
                <div className={"text-white text-base font-normal"}>
                    If you are looking to get a  hold of us for general inquiries or are from an educational facility looking to use Keymash privately with your students:
                </div>

                <a href="mailto:support@keymash.io" className="text-orange-300 hover:text-orange-400 font-semibold transition ease-in-out duration-300" target="_blank" rel="noopener noreferrer">
                    support@keymash.io
                </a>
            </div>
        </div>
    </div>
);
