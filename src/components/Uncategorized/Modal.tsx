import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLayoutEffect, ReactNode, ReactElement, useRef } from 'react';

interface IProps {
  isOpened?: boolean;
  customChildren?: boolean;
  onClose: () => void;
  children?: ReactNode | ReactElement;
  size?: 'small' | 'normal' | 'large';
  className?: string;
}

const Modal = (props: IProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { onClose } = props;

  useLayoutEffect(() => {
    const div = divRef.current;
    const handleClick = (e: MouseEvent) => {
      const useTarget = e.target as HTMLElement;
      // @ts-ignore
      console.log(useTarget.classList.contains('modal-bg'));
      if (useTarget && useTarget.classList.contains('modal-bg')) {
        onClose();
      }
    };

    div?.addEventListener('click', handleClick);

    return () => {
      div?.removeEventListener('click', handleClick);
    };
  }, [divRef, onClose]);

  let sizeCSS: string;
  switch (props.size) {
    case 'small':
      sizeCSS = 'w-128';
      break;
    case 'normal':
      sizeCSS = 'max-w-screen-lg w-full px-10';
      break;
    case 'large':
      sizeCSS = 'max-w-screen-xl w-full px-10';
      break;
    default:
      sizeCSS = 'max-w-screen-lg w-full px-10';
      break;
  }

  return (
    <div ref={divRef} style={{ zIndex: 100, overflow: 'hidden' }} className={`modal-bg fixed inset-0 w-full h-screen bg-black bg-opacity-50 transition-all ease-in-out duration-300 ${props.isOpened ? 'opacity-100 visible' : 'opacity-0 pointer-events-none invisible'}`}>
      <div className={`modal-bg flex h-screen transform transition-all ease-in-out duration-300 ${props.isOpened ? 'translate-y-0' : 'translate-y-1'}`}>
        <div className={`modal-bg ${sizeCSS} m-auto relative`}>
          <div className={`${props.className || 'bg-gray-775 p-8'} w-full rounded-2xl shadow-lg relative`}>
            <button type="button" className="focus:outline-none text-2xl text-white text-opacity-70 hover:text-opacity-40 absolute top-2 right-2.5 transition">
              <FontAwesomeIcon icon={faTimes} onClick={props.onClose} />
            </button>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
