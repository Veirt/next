import {FC} from 'react';

interface IProps {
  letter?: string;
  pressed?: string;
  compared?: string;
  size?: number;
}

const KeyboardCap: FC<IProps> = (props) => {
  const { letter, pressed, compared, size } = props;

  let sizeString = 'm-0.5 py-1 px-2 md:px-3';
  if (size && size === 1) sizeString = 'm-px';

  const css = (letter === pressed
      ? (compared && compared !== pressed) ? 'bg-red-900 border-b-2 border-red-800' : 'bg-blue-900 border-b-2 border-blue-800'
      : 'bg-gray-800 border-b-2 border-gray-825'
  );

  return (
    <div
      className={`w-auto transition ease-in-out duration-50 ${sizeString} ${
        letter === ' ' ? 'px-16 lg:px-16' : 'px-2'
      } text-xs sm:text-sm text-white rounded ${css} shadow text-center`}
    >
      {letter === ' ' ? 'space' : letter}
    </div>
  );
}

export default KeyboardCap;
