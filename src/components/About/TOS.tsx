
export default (
    <div className={"mt-12 text-center lg:text-left"}>
        <div className={"relative hero flex py-24 xl:pt-24 xl:pb-56 bg-gray-900"} style={{ backgroundImage: `url('/assets/about/TOS.webp'')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={"container m-auto"}>
                <div className={"w-full grid grid-cols-3 gap-16"}>
                    <div className={"col-span-full lg:col-span-1"}>
                        <h1 className={"text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase text-orange-400"}>Terms of Service</h1>
                        <p className={"text-white text-lg font- pt-6"}>
                            Some legal jitter jatter.
                        </p>
                    </div>
                </div>
            </div>

            <img src={'/assets/about/wave.svg'} alt={"Wave"} className={"w-full absolute bottom-0 left-0 right-0 -mb-1 object-cover"}/>
        </div>

        <div className={"h-full bg-gray-775 text-white py-10"}>
            <div className={"container"}>
                  <div className="font-semibold">1. Terms</div>
                  <p>
                    By accessing this Website, accessible from Keyma.sh, you are agreeing to be bound by these Website Terms and
                    Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you
                    disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this
                    Website are protected by copyright and trade mark law.
                  </p>

                  <div className="font-semibold pt-4">2. Use License</div>

                  <p>
                    Permission is granted to temporarily download one copy of the materials on Keyma.sh's Website for personal,
                    non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
                    this license you may not:
                  </p>

                  <ul>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose or for any public display;</li>
                    <li>attempt to reverse engineer any software contained on Keyma.sh's Website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
                  </ul>

                  <p>
                    This will let Keyma.sh to terminate upon violations of any of these restrictions. Upon termination, your
                    viewing right will also be terminated and you should destroy any downloaded materials in your possession
                    whether it is printed or electronic format.
                  </p>

                  <div className="font-semibold pt-4">3. Disclaimer</div>

                  <p>
                    All the materials on Keyma.sh’s Website are provided "as is". Keyma.sh makes no warranties, may it be
                    expressed or implied, therefore negates all other warranties. Furthermore, Keyma.sh does not make any
                    representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise
                    relating to such materials or any sites linked to this Website.
                  </p>

                  <div className="font-semibold pt-4">4. Limitations</div>

                  <p>
                    Keyma.sh or its suppliers will not be hold accountable for any damages that will arise with the use or
                    inability to use the materials on Keyma.sh’s Website, even if Keyma.sh or an authorize representative of this
                    Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not
                    allow limitations on implied warranties or limitations of liability for incidental damages, these limitations
                    may not apply to you.
                  </p>

                  <div className="font-semibold pt-4">5. Revisions and Errata</div>

                  <p>
                    The materials appearing on Keyma.sh’s Website may include technical, typographical, or photographic errors.
                    Keyma.sh will not promise that any of the materials in this Website are accurate, complete, or current.
                    Keyma.sh may change the materials contained on its Website at any time without notice. Keyma.sh does not make
                    any commitment to update the materials.
                  </p>

                  <div className="font-semibold pt-4">6. Links</div>

                  <p>
                    Keyma.sh has not reviewed all of the sites linked to its Website and is not responsible for the contents of
                    any such linked site. The presence of any link does not imply endorsement by Keyma.sh of the site. The use of
                    any linked website is at the user’s own risk.
                  </p>

                  <div className="font-semibold pt-4">7. Site Terms of Use Modifications</div>

                  <p>
                    Keyma.sh may revise these Terms of Use for its Website at any time without prior notice. By using this
                    Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
                  </p>

                  <div className="font-semibold pt-4">8. Your Privacy</div>

                  <p>Please read our Privacy Policy.</p>

                  <div className="font-semibold pt-4">9. Governing Law</div>

                  <p>
                    Any claim related to Keyma.sh's Website shall be governed by the laws of ca without regards to its conflict of
                    law provisions.
                  </p>
            </div>
        </div>
    </div>
);
