import Config from '../../Config';

export default (
  <div className={'container container-content container-margin grid grid-cols-1 gap-8'}>
    <div
      className={'relative py-16 px-8 bg-gray-900 rounded-xl shadow-lg'}
      style={{
        backgroundImage: `url('/assets/about/CONTRIBUTE.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className={'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase text-orange-400'}>Troubleshooting</h1>
      <p className={'block text-lg w-full md:w-10/12 lg:w-8/12 xl:w-6/12 pt-6'}>
        Make sure to read the following before submitting an issue to our Issue Tracker!
      </p>
    </div>

    <div className={'content-box'}>
      <div className="pb-5 mb-5 border-b border-gray-600">
        <div className="font-semibold pb-2">
          Please complete the following below through your <span className={'text-orange-400'}>browser settings</span>{' '}
          before continuing on with the page:
        </div>
        <ul className={'pl-6 list-disc pb-2'}>
          <li>Clear your cache</li>
          <li>Delete your cookies</li>
          <li>Disable Tampermonkey/Greasemonkey scripts</li>
          <li>Disable "Dark Reader" extensions</li>
        </ul>
        Below this section will have a list of problems with solutions{' '}
        <span className={'text-orange-400'}>based off</span> the information you have followed{' '}
        <span className={'text-orange-400'}>above</span>.
      </div>

      <div className="pb-5">
        <div className="font-semibold text-lg pb-2">
          All each page shows is Loading spinners that show for longer than 15 seconds
        </div>
        Typically, if we release an update that may change the API in any way it may not load the information the same
        way it should. This is usually due to some form of caching issues with Cloudflare and not necessarily with your
        browser. We try to combat this problem by having a version controller that will automatically reset your session
        but sometimes that also does not work. You can fix this by logging out of your account manually by clicking{' '}
        <a
          className="text-orange-300 hover:text-orange-400 font-semibold transition ease-in-out duration-300"
          href={`${Config.oauthUrl}/logout`}
        >
          here
        </a>
        .
      </div>

      <div>
        <div className="font-semibold text-lg pb-2">
          When playing in a match it does not show the end match results screen
        </div>
        Unfortunately this problem happens for players that may have an inconsistent internet connection. While there's
        not a lot of ways we can solve this, we are actively monitoring this issue each and every day so we can at least
        create a more consistent experience for our typists. While your match isn't finishing, in the bottom right we
        have a new "Report an issue" icon where you can copy your debug logs and can either message Staff on Discord or
        email us directly at support@keymash.io
      </div>
    </div>
  </div>
);
