import KeyboardCap from './KeyboardCap';

interface IProps {
  type: string;
  sendKeystroke?: string;
  nextKeystroke?: string;
  size?: number;
}

const Keyboard = (props: IProps) => {
  const { type, sendKeystroke, nextKeystroke, size } = props;

  let keyboardKeys: { 0: string[]; 1: string[]; 2: string[]; 3: string[], 4?: string[] };

  switch (type) {
    case 'QWERTY':
      keyboardKeys = {
        0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
        3: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
      };
      break;
    case 'QWERTZ':
      keyboardKeys = {
        0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        1: ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
        3: ['y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
      };
      break;
    case 'AZERTY':
      keyboardKeys = {
        0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        1: ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        2: ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', "'"],
        3: ['w', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
      };
      break;
    case 'DVORAK':
      keyboardKeys = {
        0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        1: ["'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '[', ']', '\\'],
        2: ['a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', "'"],
        3: [';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z'],
      };
      break;
    case 'COLEMAK':
      keyboardKeys = {
        0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        1: ['q', 'w', 'f', 'p', 'g', 'j', 'l', 'u', 'y', ';', '[', ']', '\\'],
        2: ['a', 'r', 's', 't', 'd', 'h', 'n', 'e', 'i', 'o', "'"],
        3: ['z', 'x', 'c', 'v', 'b', 'k', 'm', ',', '.', '/'],
      };
      break;
    case 'NUMPAD':
      keyboardKeys = {
        0: ['NUM', '/', '*', '-'],
        1: ['7', '8', '9', '+'],
        2: ['4', '5', '6', '+'],
        3: ['1', '2', '3', 'EN'],
        4: ['0', '0', '.', 'EN'],
      };
      break;
    default:
      keyboardKeys = {
        0: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
        3: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
      };
      break;
  }

  return (
    <div className="mt-4">
      {type !== 'NUMPAD' ? (
          <>
            <div className="flex justify-center">
              {keyboardKeys['0'].map(key => (
                  <KeyboardCap key={key} letter={key} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
              ))}
            </div>
            <div className="flex justify-center">
              {keyboardKeys['1'].map(key => (
                  <KeyboardCap key={key} letter={key} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
              ))}
            </div>
            <div className="flex justify-center">
              {keyboardKeys['2'].map(key => (
                  <KeyboardCap key={key} letter={key} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
              ))}
            </div>
            <div className="flex justify-center">
              {keyboardKeys['3'].map(key => (
                  <KeyboardCap key={key} letter={key} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
              ))}
            </div>
            <div className="flex justify-center">
              {keyboardKeys['4']?.map(key => (
                  <KeyboardCap key={key} letter={key} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
              ))}
            </div>
            <div className="flex justify-center">
              <KeyboardCap letter={' '} size={size} pressed={sendKeystroke} />
            </div>
          </>
      ) : (
          <div className={"grid grid-cols-5 gap-1"}>
            <KeyboardCap letter={'NUM'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'/'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'*'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'-'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <div />
            <KeyboardCap letter={'7'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'8'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'9'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'+'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <div />
            <KeyboardCap letter={'4'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'5'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'6'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'ENTER'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <div />
            <KeyboardCap letter={'1'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'2'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <KeyboardCap letter={'3'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            <div />
            <div className={"col-span-2"}>
              <KeyboardCap letter={'0'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
            </div>
            <KeyboardCap letter={'.'} size={size} pressed={sendKeystroke} compared={nextKeystroke} />
          </div>
      )}

    </div>
  );
}

export default Keyboard;
