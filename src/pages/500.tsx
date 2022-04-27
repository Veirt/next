import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from '../components/Uncategorized/Link';
import { Meta } from '../layout/Meta';
import Base from '../templates/Base';

const ErrorPage = () => {
  return (
    <Base meta={<Meta title="500 Internal Server Error" />} noNav>
      <div className="flex h-screen">
        <div className="m-auto w-5/6 sm:w-4/6 lg:w-3/6 xl:w-2/5">
          <div className={'text-5xl font-bold text-white uppercase'}>There was a problem!</div>
          <div className={'text-xl text-white pt-6'}>
            <div>
              The page you are looking for was found however generated an unexpected error, if this occurs again please
              contact us:
            </div>
            <a
              className="text-orange-300 hover:text-orange-400 pb-1 transition ease-in-out duration-300"
              href="mailto:support@keymash.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              support@keymash.io
            </a>

            <div className="flex">
              <Link to="/" className="button default orange mt-10">
                <FontAwesomeIcon icon={faAngleDoubleRight} className="mt-1 mr-2" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default ErrorPage;
