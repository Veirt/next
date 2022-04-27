import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  index: number;
}

const FormatIndex = (props: IProps) => {
  const { index } = props;

  return (
    <>
      {index === 1 ? (
        <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
      ) : index === 2 ? (
        <FontAwesomeIcon icon={faTrophy} className="text-gray-300" />
      ) : index === 3 ? (
        <FontAwesomeIcon icon={faTrophy} className="text-orange-700" />
      ) : (
        index.toLocaleString()
      )}
    </>
  );
};

export default FormatIndex;
