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
  maxTeams: number;
  draggable: boolean;
  isDragging: boolean;

  handlePlayerBan: (playerId: string) => void;
  handleGiveOwner: (playerId: string) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
}

const TeamData = (props: IProps) => {
    const { handlePlayerBan, handleGiveOwner, lobbyOwner, teamId, teamSize, teamStrict, data, dataLength, onDrop, draggable, maxTeams, isDragging, onDragStart, onDragEnd } = props;
    const { t } = useTranslation();

    return (
        <div key={teamId} className="mb-8">
            <div className="h5 font-semibold bg-gray-750 px-6 py-2 rounded-lg mb-2">
                {teamId === 0 ? 'Spectators' : !teamStrict && maxTeams >= teamId ? `Players` : `Players (${dataLength}/${teamSize})`}
            </div>
            <div className={`relative`} onDragOver={e => e.preventDefault()} onDrop={onDrop}>
                <div className="grid grid-cols-1 gap-4 h-16">
                    {data.map((userData) => userData.teamId === teamId && (
                        <div 
                            key={userData.playerId}
                            className="flex z-10 relative" 
                            draggable={draggable ? 'true' : 'false'}
                            onDragStart={e => { onDragStart(); e.dataTransfer.setData('playerId', `${userData.playerId}`); }} 
                            onDragEnd={onDragEnd}
                        >
                            {draggable ? (
                                <div className={`w-8 flex items-center justify-center rounded-l-lg text-gray-500 bg-gray-700 ${draggable && 'cursor-move'}`}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </div>
                            ) : <></>}
                            <div className={"w-full"}>
                                <PlayerCard className={`px-4 py-2 ${draggable ? `` : (userData.playerId === lobbyOwner) ? 'rounded-l-xl' : 'rounded-xl'}`} {...userData}>
                                    {userData.state ? <div className="my-auto text-sm text-orange-400">{t('page.custom.status.game')}</div> : <div className="my-auto text-xs text-gray-300">{t('page.custom.status.lobby')}</div> }
                                </PlayerCard>
                            </div>
                            {(draggable && userData.playerId !== lobbyOwner) ? (
                                <div className={"rounded-r-lg w-10 border-b border-gray-800"}>
                                    {!userData.staff ? ( 
                                        <button onClick={() => handlePlayerBan(userData.playerId)} style={{ height: '50%' }} className={"rounded-tr-lg block w-full bg-gray-700 text-red-400 hover:bg-red-400 hover:text-white transition ease-in-out duration-300 focus:outline-none"}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    ) : <></>}
                                    <button onClick={() => handleGiveOwner(userData.playerId)} style={{ height: '50%' }} className={"rounded-br-lg block w-full bg-gray-700 text-yellow-400 hover:bg-yellow-400 hover:text-white transition ease-in-out duration-300 focus:outline-none"}>
                                        <FontAwesomeIcon icon={faCrown} />
                                    </button>
                                </div>
                            ) : userData.playerId === lobbyOwner && (
                                <div className={"rounded-r-lg w-10 flex bg-gray-700 w-10 border-b border-gray-800"}>
                                    <div className={"m-auto text-gray-500"}>
                                        <FontAwesomeIcon icon={faCrown} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isDragging && <div className={"rounded-xl bg-green-500 bg-opacity-10 border-2 border-green-800 h-16 z-0"} />}
                </div>
            </div>
        </div>
    );
}

export default TeamData;
