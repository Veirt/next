import { DragEvent } from 'react';
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SocketCustomPlayerData } from '../../types.client.socket';
import PlayerCard from '../Player/PlayerCard';
import { usePlayerContext } from '../../contexts/Player.context';

interface IProps {
  teamId: number;
  teamSize: number;
  teamStrict: boolean;
  dataLength: number;
  maxTeams: number;
  draggable: boolean;
  isDragging: boolean;

  lobbyOwner: string;
  data: SocketCustomPlayerData[];

  handlePlayerBan: (playerId: string) => void;
  handleGiveOwner: (playerId: string) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
}

const TeamData = (props: IProps) => {
  const { handlePlayerBan, handleGiveOwner, lobbyOwner, teamId, teamSize, teamStrict, data, dataLength, onDrop, draggable, maxTeams, isDragging, onDragStart, onDragEnd } = props;
  const { t } = useTranslation();
  const { sessionData } = usePlayerContext();

  const playerCount = (data: SocketCustomPlayerData[], teamId: number) => {
    let totalPlayers = 0;
    data.map((item) => (item.teamId === teamId ? totalPlayers++ : null));

    return totalPlayers;
  };

  return (
    <div key={teamId} className="mb-8" onDragEnd={onDragEnd}>
      <div className="h5 font-semibold bg-gray-750 px-6 py-2 rounded-lg mb-2">{teamId === 0 ? 'Spectators' : !teamStrict && maxTeams >= teamId ? `Players` : `Players (${dataLength}/${teamSize})`}</div>
      <div className={`relative`}>
        <div className="grid grid-cols-1 gap-2">
          {data.map(
            (userData) =>
              userData.teamId === teamId && (
                <div
                  key={userData.playerId}
                  className="flex z-10 relative rounded-xl overflow-hidden"
                  draggable={draggable ? 'true' : 'false'}
                  onDragStart={(e) => {
                    onDragStart();
                    e.dataTransfer.setData('playerId', `${userData.playerId}`);
                  }}
                >
                  {draggable ? (
                    <div className={`w-8 flex items-center justify-center rounded-l-lg text-gray-500 bg-gray-700 ${draggable && 'cursor-move'}`}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className={'w-full'}>
                    <PlayerCard className={`px-4 py-2`} {...userData}>
                      {userData.state ? <div className="my-auto text-sm text-orange-400">{t('page.custom.status.game')}</div> : <div className="my-auto text-xs text-gray-300">{t('page.custom.status.lobby')}</div>}
                    </PlayerCard>
                  </div>
                  {(draggable && (!userData.staff && userData.playerId !== sessionData?.playerId)) ? (
                    <div className={'rounded-r-lg w-10 border-b border-gray-800'}>
                      {!userData.staff ? (
                        <button onClick={() => handlePlayerBan(userData.playerId)} style={{ height: '50%' }} className={'rounded-tr-lg block w-full bg-gray-700 text-red-400 hover:bg-red-400 hover:text-white transition ease-in-out duration-300 focus:outline-none'}>
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      ) : <></>}
                      <button onClick={() => handleGiveOwner(userData.playerId)} style={{ height: '50%' }} className={`${userData.playerId === lobbyOwner ? 'pointer-events-none' : ''} rounded-br-lg block w-full bg-gray-700 text-yellow-400 hover:bg-yellow-400 hover:text-white transition ease-in-out duration-300 focus:outline-none`}>
                        <FontAwesomeIcon icon={faCrown} className={(userData.playerId === lobbyOwner) ? 'text-gray-500': ''} />
                      </button>
                    </div>
                  ) : (
                    userData.playerId === lobbyOwner && (
                      <div className={'rounded-r-lg w-10 flex bg-gray-700 w-10 border-b border-gray-800'}>
                        <div className={'m-auto text-gray-500'}>
                          <FontAwesomeIcon icon={faCrown} />
                        </div>
                      </div>
                    )
                  )}
                </div>
              ),
          )}
          {playerCount(data, teamId) === 0 && <div className="rounded-xl bg-gray-725 py-8" />}
          <div onDragEnd={onDragEnd} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className={`${isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute inset-0 rounded-xl bg-green-500 bg-opacity-10 border-2 border-green-800 py-8 w-full z-20`} />
        </div>
      </div>
    </div>
  );
};

export default TeamData;
