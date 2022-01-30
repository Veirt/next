import { DragEvent } from 'react';
import { useTranslation } from 'next-i18next';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faEllipsisV, faTimes} from "@fortawesome/free-solid-svg-icons";
import {SocketCustomPlayerData} from "../../types.client.socket";
import PlayerCard from "../Player/PlayerCard";

interface IProps {
  teamId: number;
  teamSize: number;
  teamStrict: boolean;
  lobbyOwner: string;
  data: SocketCustomPlayerData[];
  dataLength: number;
  handlePlayerBan: (playerId: string) => void;
  handleGiveOwner: (playerId: string) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  maxTeams: number;
  draggable: boolean;
  isDragging: boolean;
}

const TeamData = (props: IProps) => {
    const { handlePlayerBan, handleGiveOwner, lobbyOwner, teamId, teamSize, teamStrict, data, dataLength, onDrop, draggable, maxTeams, isDragging, onDragStart, onDragEnd } = props;
    const { t } = useTranslation();

    return (
      <div key={teamId} className="mb-10">
        <div className="mb-3 px-4 py-2 bg-gray-700 rounded-md text-white text-sm font-semibold uppercase">
          {teamId === 0 ? 'Spectators' : !teamStrict && maxTeams >= teamId ? `Players` : `Team #${teamId} (${dataLength}/${teamSize})`}
        </div>
        <div className={`bg-gray-750 rounded-md relative ${dataLength ? 'h-auto' : 'h-16'}`} onDragOver={e => { e.preventDefault(); }} onDrop={onDrop}>
          {isDragging && <div className={"rounded-md pointer-events-none bg-green-500 bg-opacity-10 border-2 border-green-800 h-full absolute w-full"} />}
          {data.map((userData) =>
                userData.teamId === teamId && (
                    <div className="flex rounded-md" draggable={draggable ? 'true' : 'false'}
                         onDragStart={e => { onDragStart(); e.dataTransfer.setData('playerId', `${userData.playerId}`); }} onDragEnd={onDragEnd}
                    >
                        {draggable ? (
                            <div className={`rounded-l-lg w-8 my-auto text-center text-gray-500 mx-auto ${draggable && 'cursor-move'}`}>
                                <FontAwesomeIcon icon={faEllipsisV} />
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </div>
                        ) : <></>}
                        <div className={"w-full"}>
                            <PlayerCard className={"px-4 py-2"} {...userData}>
                                <div className={"flex"}>
                                    {userData.state ? <div className="my-auto text-sm text-orange-400">{t('page.custom.status.game')}</div> : <div className="my-auto text-xs text-gray-300">{t('page.custom.status.lobby')}</div> }
                                </div>
                            </PlayerCard>
                        </div>
                        {(draggable && userData.playerId !== lobbyOwner) ? (
                            <div className={"rounded-r-lg w-10 border-b border-gray-800"}>
                                {!userData.staff ? (
                                    <button onClick={() => handlePlayerBan(userData.playerId)} style={{ height: '50%' }} className={"block w-full bg-gray-700 text-red-400 hover:bg-red-400 hover:text-white transition ease-in-out duration-300 focus:outline-none"}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                ) : <></>}
                                <button onClick={() => handleGiveOwner(userData.playerId)} style={{ height: '50%' }} className={"block w-full bg-gray-700 text-yellow-400 hover:bg-yellow-400 hover:text-white transition ease-in-out duration-300 focus:outline-none"}>
                                    <FontAwesomeIcon icon={faCrown} />
                                </button>
                            </div>
                        ) : (
                            <div className={"rounded-r-lg w-10 flex bg-gray-700 w-10 border-b border-gray-800"}>
                                <div className={"m-auto text-gray-500"}>
                                    {userData.playerId === lobbyOwner && <FontAwesomeIcon icon={faCrown} />}
                                </div>
                            </div>
                        )}
                    </div>
                ),
          )}
        </div>
      </div>
    );
}

export default TeamData;
