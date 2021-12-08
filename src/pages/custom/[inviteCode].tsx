import {useState, useRef, useEffect, DragEvent, ChangeEvent, KeyboardEvent} from 'react';
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { CancelTokenSource } from 'axios';
import Socket from '../../utils/socket/Socket';
import Config from '../../Config';
import TeamData from '../../components/Custom/TeamData';
import Match from "../../components/Game/GameScreen";
import LoadingScreen from "../../components/Uncategorized/LoadingScreen";
import {faAngleDoubleRight, faPaperclip} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import SidebarDynamicLong from "../../components/Advertisement/SidebarDynamicLong";
import usePlayerToken from "../../hooks/usePlayerToken";
import { LobbyData, GamemodeData } from "../../types.client.mongo";
import {SocketCustomChatData, SocketCustomPlayerData} from "../../types.client.socket";
import {usePlayerContext} from "../../contexts/Player.context";
import useConfig from "../../hooks/useConfig";
import PlayerAvatar from "../../components/Player/PlayerAvatar";
import PlayerName from "../../components/Player/PlayerName";
import ReactTooltip from "react-tooltip";
import Redirect from '../../components/Uncategorized/Redirect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../services/ConfigService';
import { GetServerSidePropsContext } from 'next';
import { Meta } from '../../layout/Meta';
import Base from '../../templates/Base';

interface IProps {
  inviteCode: string
}

const Custom = (props: IProps) => {
  const { inviteCode } = props;
  const { t } = useTranslation();

  const axiosCancelSource = useRef<CancelTokenSource | null>(null);

  const { sessionData } = usePlayerContext();
  const { playerToken } = usePlayerToken();
  const { customChatBeep, streamerMode } = useConfig();

  const [ showMatch, setShowMatch ] = useState(false);
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const [ lobbyId, setLobbyId ] = useState<string | null>(null);
  const [ name, setName ] = useState('undefined');
  const [ invite, setInvite ] = useState('0');
  const [ owner, setOwner ] = useState('0');
  const [ textId, setTextId ] = useState(0);
  const [ allowGuests, setAllowGuests ] = useState(0);
  const [ modeId, setModeId ] = useState(0);
  const [ textCustom, setTextCustom ] = useState('undefined');
  const [ privacy, setPrivacy ] = useState(0);
  const [ countdown, setCountdown ] = useState(0);
  const [ status, setStatus ] = useState(0);
  const [ gameModes, setGameModes ] = useState<GamemodeData[]>([]);
  const [ chatData, setChatData ] = useState<SocketCustomChatData[]>([]);
  const [ participantsData, setParticipantsData ] = useState<SocketCustomPlayerData[]>([]);
  const [ message, setMessage ] = useState('');
  const [ typingData, setTypingData ] = useState<string[]>([]);
  const [ isDragging, setIsDragging ] = useState(false);

  const [ dropdownText, setDropdownText ] = useState(false);
  const [ dropdownCountdown, setDropdownCountdown ] = useState(false);

  const [ redirect, setRedirect ] = useState('');

  let enableStartLobby = false;
  let countLobbyTotal = 0;

  useEffect(() => {
    axiosCancelSource.current = axios.CancelToken.source();
    if (!inviteCode) {
      axios
          .get(`${Config.apiUrl}/lobby/create`, {
            withCredentials: true,
            cancelToken: axiosCancelSource.current?.token,
          })
          .then(response => {
              if (response.data.error) {
                  toast.error(response.data.error);
                  setRedirect('/');
              } else
                setRedirect(`/custom/${response.data.lobbyInvite}`)
          })
          .catch(e => console.log(e));
    } else {
      setRedirect('');
      if (window) {
        setSocket(new Socket(`${Config.gameServer.URL}${Config.gameServer.Port !== null ? `:${Config.gameServer.Port}` : ''}/lobby`, {
          transports: ['websocket', 'polling'],
        }));
      }
    }

    return () => axiosCancelSource.current?.cancel();
  }, [ inviteCode, sessionData ]);

  useEffect(() => {
    socket?.on('redirectLobby', () => {
      setShowMatch(true);
      setStatus(1);
    });
    socket?.on('forceEndLobby', () => {
      setShowMatch(false);
      setStatus(0);
    });
    socket?.onError(() => socket?.disconnect());
    socket?.onDisconnect(() => console.log('[Socket] Disconnected from Lobby!'));
    socket?.onConnect(() => console.log('[Socket] Connected to Lobby!'));

    if (inviteCode) {
      const joinPayload = { lobbyInvite: inviteCode, playerToken };
      socket?.emit('getLobby', joinPayload);

      socket?.on('updateLobby', (data: LobbyData) => {
        setLobbyId(data.lobbyId || '');
        setName(data.name);
        setInvite(data.invite);
        setPrivacy(data.privacy);
        setTextCustom(data.textCustom && data.textCustom !== 'null' ? data.textCustom : '');
        setOwner(data.owner);
        setTextId(data.textId);
        setAllowGuests(data.allowGuests);
        setModeId(data.modeId);
        setCountdown(data.countdown);
        setStatus(data.status);
        setGameModes(data.gameModes);
      });

      socket?.on('sendTyping', (data: { name: string, isTyping: boolean }) => {
        setTypingData(typing => {
          let currentState = [ ...typing ];

          if (!currentState.includes(data.name) && data.isTyping)
            currentState.push(data.name);

          if (currentState.includes(data.name) && !data.isTyping)
            currentState = currentState.filter(name => name !== data.name);

          return currentState;
        });
      });

      socket?.on('isBanned', () => {
        toast.error("You are banned from this lobby.");
        setRedirect('/');
      });

      socket?.on('isKickedGuest', () => {
        toast.error("Guests are not allowed to join this lobby.");
        setRedirect('/');
      });

      socket?.on('isKicked', (data: { playerId: string, message: string }) => {
        if (data.playerId === sessionData?.playerId) {
          toast.error(!data.message ? "You have been removed from this lobby." : data.message);
          setRedirect('/');
        }
      });

      socket?.on('isStaff', () => toast.error("You cannot remove staff members from lobbies."));
      socket?.on('tooFast', (data: { message: string}) => toast.error(data.message));
      socket?.on('updateLobbyPlayers', (data: SocketCustomPlayerData[]) => setParticipantsData(data));
      socket?.on('updateLobbyChat', (data: SocketCustomChatData) => {
        setChatData(chatData => [...chatData, data ]);

        if (customChatBeep === '1' && data.type !== 'global' && data.name !== sessionData?.name && data.discriminator !== sessionData?.discriminator) {
            const chatBeepElement = document.getElementById('ChatBeep') as HTMLAudioElement;
            if (chatBeepElement) {
              chatBeepElement.currentTime = 0;
              chatBeepElement.play().then();
            }
        }

        updateChatScroll();
      });
    }

    return () => socket?.disconnect();
  }, [socket, customChatBeep, playerToken, inviteCode, sessionData ]);


  const updateChatScroll = () => {
    const overflowChatElement: HTMLElement | null = document.getElementById('chatbox');
    if (overflowChatElement) {
      const isNotBottom = (overflowChatElement.scrollHeight - (overflowChatElement.offsetHeight + overflowChatElement.scrollTop)) >= 75;
      if (!isNotBottom) overflowChatElement.scrollTop = overflowChatElement.scrollHeight - overflowChatElement.clientHeight;
    }
  }

  const resetChatScroll = () => {
    const overflowChatElement: HTMLElement | null = document.getElementById('chatbox');
    if (overflowChatElement) {
      overflowChatElement.scrollTop = overflowChatElement.scrollHeight - overflowChatElement.clientHeight;
    }
  }

  const chatOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    socket?.emit('sendTyping', { isTyping: e.target.value.trim() !== "" });
    setMessage(e.target.value);
  }

  const chatOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (sessionData && message) {
        socket?.emit('sendMessage', {message});
        socket?.emit('sendTyping', {isTyping: false});
        setMessage('');
      }
    }
  }

  const handlePlayerBan = (playerId: string) => socket?.emit('banPlayer', { playerId });
  const handleGiveOwner = (playerId: string) => socket?.emit('giveOwner', { playerId });

  const handleUpdateSettings = (fieldName: string, value?: any) => {
    const newtextId = (fieldName === 'textId' ? parseInt(value, 10) : textId);
    let newtextCustom = (fieldName === 'textCustom' ? value : textCustom);
    if (fieldName === 'textId' && newtextId !== 9)
        newtextCustom = '';

    socket?.emit('updateLobbySettings', {
      name: (fieldName === 'name' ? value : name),
      privacy: (fieldName === 'privacy' ? parseInt(value, 10) : privacy),
      modeId: (fieldName === 'modeId' ? parseInt(value, 10) : modeId),
      countdown: (fieldName === 'countdown' ? parseInt(value, 10) : countdown),
      allowGuests: (fieldName === 'allowGuests' ? parseInt(value, 10) : allowGuests),
      textId: newtextId,
      textCustom: newtextCustom
    });

    setDropdownCountdown(false);
    if (name === 'textId' && value !== 9)
      setDropdownText(false);
  }

  const handleStartMatch = () => {
    setDropdownCountdown(false);
    setDropdownText(false);
    socket?.emit('startLobby', {});
  }
  const handleUpdateTeam = (playerId: string, teamId: number) => socket?.emit('updateLobbyPlayerTeam', { playerId, teamId });
  const toggleDragging = () => setIsDragging(!isDragging);

  useEffect(() => {
    resetChatScroll();
  }, [ showMatch ]);

  const teamLengths:any = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, };
  const userDataLength = participantsData.length;
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < userDataLength; i++) {
      if (j === participantsData[i]?.teamId) teamLengths[j] += 1;
    }
  }

  const useGameMode = gameModes[modeId];

  if (useGameMode) {
    for (let i = 1; i <= useGameMode.modeConfig.MAX_TEAMS; i++)
      if (teamLengths[i] === useGameMode.modeConfig.TEAM_SIZE) countLobbyTotal += useGameMode.modeConfig.TEAM_SIZE;
    if (teamLengths[1] !== 0 && countLobbyTotal === useGameMode.modeConfig.MAX_TEAMS * useGameMode.modeConfig.TEAM_SIZE) enableStartLobby = true;
  }

  const buttonCSS = `bg-gray-750 text-left text-center px-2 border-b-2 border-transparent ${sessionData?.playerId === owner ? 'hover:border-orange-400 focus:outline-none' : 'pointer-events-none'} transition ease-in-out duration-300 py-3 text-white font-semibold text-sm`;
  const tabCSS = `bg-gray-750 text-left text-center px-2 border-b-2 border-transparent transition ease-in-out duration-300 py-3 text-white font-semibold text-sm`;
  const dropdownCSS = `block w-full text-left px-3 py-2 text-white text-sm uppercase font-semibold transition ease-in-out duration-300 hover:bg-gray-750`;

  return (
    <Base meta={<Meta title={(!name || name === 'undefined') ? 'Joining Lobby' : name} reverseTitle />} ads={{ enableBottomRail: true }} isLoaded={(lobbyId !== '0')}>
        {redirect && <Redirect to={redirect} />}
        <ReactTooltip />
        <audio id="ChatBeep" src="/audio/ChatBeep.wav" crossOrigin="anonymous" preload="auto" />
        {showMatch && <Match embed embedOwner={sessionData?.playerId === owner} embedClose={() => socket?.emit('forceEndMatch', {})}/>}
        {!showMatch && (
            <>
              {lobbyId && lobbyId !== '0' && useGameMode && useGameMode.modeConfig ? (
                  <div className="container container-margin py-10">
                    <div className={"flex flex-wrap justify-center lg:justify-start gap-4 pb-6"}>
                      <div className={"my-auto w-full xl:w-auto flex flex-wrap gap-4 mr-auto text-left"}>
                        {owner !== sessionData?.playerId
                            ? <input disabled className="w-full xl:w-auto p-4 text-white bg-gray-750 rounded-md text-xl tracking-wide uppercase text-white font-semibold focus:outline-none" name="title" value={name} />
                            : <input className="w-full xl:w-auto p-4 text-white bg-gray-750 rounded-md text-xl tracking-wide uppercase text-white font-semibold focus:outline-none" name="title" maxLength={24} onChange={e => handleUpdateSettings('name', e.target.value)} defaultValue={name} />
                        }

                          <div className={"w-full xl:w-auto my-auto"}>
                            {sessionData?.playerId === owner && (
                                <>
                                  <button type="button" onClick={enableStartLobby ? handleStartMatch : () => false} data-tip={enableStartLobby ? t('page.custom.startmatch') : t('page.custom.error.team_size')} className={`${!enableStartLobby ? 'disabled opacity-50' : ''} w-full py-5 px-6 text-orange-800 bg-orange-400 hover:bg-orange-300 text-sm uppercase font-semibold rounded-md transition ease-in-out duration-300`}>
                                    <FontAwesomeIcon icon={faAngleDoubleRight} className={"mr-1"} />
                                    {t('page.custom.startmatch')}
                                  </button>
                                </>
                            )}
                          </div>
                      </div>
                      <div className={"w-full xl:w-auto xl:ml-auto"}>
                        <div className={"flex flex-wrap"}>
                          <div className={`w-full sm:w-1/2 md:w-1/3 xl:w-28 xl:rounded-md ${tabCSS}`}>
                            <div className={"text-xxs text-gray-400"}>{t('page.custom.status.title')}</div>
                            {status === 0 ? <span className={"text-blue-300"}>In Lobby</span> : <span className={"text-yellow-400"}>In Game</span>}
                          </div>
                          <div className={"hidden xl:block xl:w-12 bg-transparent my-auto text-center"}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} className={"text-orange-400 text-center"} />
                          </div>
                          <button type={"button"} onClick={() => handleUpdateSettings('modeId', gameModes[modeId + 1] ? (modeId + 1) : 0)} className={`xl:rounded-l-md w-full sm:w-1/2 md:w-1/3 xl:w-32 text-left ${buttonCSS}`}>
                            <div className={"text-xxs text-gray-400"}>{t('page.custom.mode')}</div>
                            {gameModes ? useGameMode.modeName : `Unknown ${modeId}`}
                          </button>
                          <button type={"button"} onClick={() => handleUpdateSettings('privacy', (privacy === 1 ? 0 : 1))} className={`w-full sm:w-1/2 md:w-1/3 xl:w-28 ${buttonCSS}`}>
                            <div className={"text-xxs text-gray-400"}>{t('page.custom.privacy')}</div>
                            {!privacy || privacy === 0 ? <span>{t('page.custom.unlisted')}</span> : <span>{t('page.custom.public')}</span>}
                          </button>
                          <button type={"button"} onClick={() => handleUpdateSettings('allowGuests', (allowGuests === 1 ? 0 : 1))} className={`w-full sm:w-1/2 md:w-1/3 xl:w-24 ${buttonCSS}`}>
                            <div className={"text-xxs text-gray-400"}>{t('page.custom.guests')}</div>
                            {!allowGuests || allowGuests === 0 ? <span>{t('options.no')}</span> : <span>{t('options.yes')}</span>}
                          </button>
                          <div className={"w-full sm:w-1/2 md:w-1/3 xl:w-28 relative"}>
                            <button type="button" className={`w-full ${buttonCSS}`} disabled={owner !== sessionData?.playerId} onClick={() => setDropdownText(!dropdownText)}>
                              <div className={"text-xxs text-gray-400"}>{t('page.custom.text')}</div>
                              {!textCustom && textId === 0 && <span>{t('options.random')}</span>}
                              {!textCustom && textId === 1 && <span>{t('options.quotes')}</span>}
                              {!textCustom && textId === 2 && <span>{t('options.dict')}</span>}
                              {textId === 9 && <span>{t('options.custom')}</span>}
                            </button>

                            {dropdownText && (
                                <div className={"z-10 absolute top-0 left-0 mt-16 bg-gray-700 w-64"}>
                                  <button type={"button"} onClick={() => handleUpdateSettings('textId', 0)} className={`${dropdownCSS} ${textId === 0 ? 'bg-gray-750' : ''}`}>
                                    Random
                                  </button>
                                  <button type={"button"} onClick={() => handleUpdateSettings('textId', 1)} className={`${dropdownCSS} ${textId === 1 ? 'bg-gray-750' : ''}`}>
                                    Quotes
                                  </button>
                                  <button type={"button"} onClick={() => handleUpdateSettings('textId', 2)} className={`${dropdownCSS} ${textId === 2 ? 'bg-gray-750' : ''}`}>
                                    Dictionary
                                  </button>
                                  <button type={"button"} onClick={() => handleUpdateSettings('textId', 9)} className={`${dropdownCSS} ${textId === 9 ? 'bg-gray-750' : ''}`}>
                                    Custom
                                  </button>

                                  {textId === 9 && (
                                      <textarea
                                          className={"block text-sm w-full bg-gray-775 p-2 text-white border-t-2 border-white focus:outline-none focus:shadow"}
                                          onChange={(e) => handleUpdateSettings('textCustom', e.target.value)}
                                          rows={3}
                                          defaultValue={textCustom || ''}
                                          maxLength={1000}
                                          placeholder={"Please enter your Custom text here - 5 characters minimum."}
                                      />
                                  )}
                                </div>
                            )}
                          </div>
                          <div className={"w-full sm:w-1/2 md:w-1/3 xl:w-32 relative"}>
                            <button type="button" className={`w-full xl:rounded-r-md ${buttonCSS}`} disabled={owner !== sessionData?.playerId} onClick={() => setDropdownCountdown(!dropdownCountdown)}>
                              <div className={"text-xxs text-gray-400"}>{t('page.custom.countdown')}</div>
                              {countdown} seconds
                            </button>

                            {dropdownCountdown && (
                                <div className={"z-10 absolute top-0 left-0 mt-16 bg-gray-700 w-32"}>
                                  {([12,11,10,9,8,7,6]).map((item) => (
                                      <button type={"button"} key={item} onClick={() => handleUpdateSettings('countdown', item)} className={`${dropdownCSS} ${countdown === item ? 'bg-gray-750' : ''}`}>
                                        {item} seconds
                                      </button>
                                  ))}
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/2 lg:w-3/4 md:pr-3">
                        <div className="bg-gray-775 rounded-md p-6 mb-4 lg:mb-0">
                          <div id="chatbox" style={{ overflowY: 'auto', height: '50vh' }}>
                            <div className="pb-2 text-gray-300 text-white tracking-wide text-sm lg:text-base">{t('page.custom.chat')}</div>
                            {chatData && chatData.map((row, key) => (
                                <div key={key} className="text-white pb-1 text-sm lg:text-base break-all">
                                  {row.type === 'message'
                                      ? (
                                          <div className={"flex bg-gray-800 rounded-lg p-2"}>
                                            <div className={"w-10 h-10 my-auto"}>
                                              <PlayerAvatar source={row.avatarSrc} color={row.cardBorder} />
                                            </div>
                                            <div className={"my-auto w-full pl-3"}>
                                              <div className={"text-base font-semibold flex"}>
                                                <PlayerName name={row.name} discriminator={row.discriminator} verified={row.verified} patreon={row.patreon} staff={row.staff} showDiscriminator />
                                                <div className={"my-auto ml-2 text-xs text-gray-600 font-semibold"}>{row.posted}</div>
                                              </div>
                                              <div className={"text-gray-400 text-sm"}>{row.message}</div>
                                            </div>
                                          </div>
                                      )
                                      : ( <div className="bg-gray-800 rounded-lg p-2 font-semibold text-orange-400"><FontAwesomeIcon icon={faAngleDoubleRight} className={"mr-1"} /> {row.message}</div>)
                                  }
                                </div>
                            ))}
                          </div>
                          <div className={"text-gray-400 font-semibold h-3 text-xs"}>
                            {typingData.length !== 0 && (
                                typingData.length === 1
                                    ? `${typingData[0]} is`
                                    : typingData.length === 2
                                    ? `${typingData[0]} and ${typingData[1]} are`
                                    : typingData.length === 3
                                        ? `${typingData[0]}, ${typingData[1]} and ${typingData[2]} are`
                                        : `Several people are`
                            )}
                            {typingData.length !== 0 && ' typing...'}
                          </div>
                          <div className={"mt-2"}>
                              <input type="text" name="message" className="form-settings" placeholder={t('form.message')} value={message || ''} autoComplete="off" onChange={chatOnChange} onKeyDown={chatOnKeyDown} />
                          </div>
                        </div>

                        <div className={"flex flex-wrap gap-x-6 mt-4"}>
                            <div className="w-5/12">
                              <div className={"py-3 px-4 bg-gray-750 rounded text-gray-400 font-semibold text-sm"}>
                                Invite your friends by sending them the invite link!
                              </div>
                            </div>
                            <div className={`w-36 my-auto`}>
                              <button type={"button"} onClick={() => { toast.success("Copied to clipboard!"); navigator?.clipboard.writeText(`${Config.webUrl}/custom/${invite}`) }} className={"text-center py-2 px-4 rounded text-orange-800 bg-orange-400 hover:bg-orange-300 uppercase font-semibold text-xl h-full"}>
                                <FontAwesomeIcon icon={faPaperclip} className={"mr-1 text-base"} />
                                {streamerMode === '0' ? invite : 'Hidden'}
                              </button>
                            </div>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 lg:w-1/4 md:pl-2">
                        <TeamData
                            teamId={0}
                            teamSize={64}
                            teamStrict={0}
                            data={participantsData}
                            maxTeams={useGameMode.modeConfig.MAX_TEAMS}
                            dataLength={teamLengths[0]}
                            lobbyOwner={owner}
                            draggable={owner === sessionData?.playerId}
                            handlePlayerBan={handlePlayerBan}
                            handleGiveOwner={handleGiveOwner}
                            isDragging={isDragging}
                            onDragStart={toggleDragging}
                            onDragEnd={toggleDragging}
                            onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); handleUpdateTeam(e.dataTransfer.getData('playerId'), 0); }}
                        />
                        {((useGameMode && useGameMode.modeConfig.MAX_TEAMS >= 1) || teamLengths[1] !== 0) && (
                            <TeamData
                                teamId={1}
                                teamSize={useGameMode.modeConfig.MAX_TEAMS >= 1 ? useGameMode.modeConfig.TEAM_SIZE : 0}
                                maxTeams={useGameMode.modeConfig.MAX_TEAMS}
                                teamStrict={useGameMode.modeConfig.STRICT_TEAMS}
                                data={participantsData}
                                dataLength={teamLengths[1]}
                                draggable={owner === sessionData?.playerId}
                                lobbyOwner={owner}
                                handlePlayerBan={handlePlayerBan}
                                handleGiveOwner={handleGiveOwner}
                                isDragging={isDragging}
                                onDragStart={toggleDragging}
                                onDragEnd={toggleDragging}
                                onDrop={(e) => { e.preventDefault(); handleUpdateTeam(e.dataTransfer.getData('playerId'), 1); }}
                            />
                        )}
                        {((useGameMode && useGameMode.modeConfig.MAX_TEAMS >= 2) || teamLengths[2] !== 0) && (
                            <TeamData
                                teamId={2}
                                teamSize={useGameMode.modeConfig.MAX_TEAMS >= 2 ? useGameMode.modeConfig.TEAM_SIZE : 0}
                                maxTeams={useGameMode.modeConfig.MAX_TEAMS}
                                teamStrict={useGameMode.modeConfig.STRICT_TEAMS}
                                lobbyOwner={owner}
                                data={participantsData}
                                dataLength={teamLengths[2]}
                                draggable={owner === sessionData?.playerId}
                                handlePlayerBan={handlePlayerBan}
                                handleGiveOwner={handleGiveOwner}
                                isDragging={isDragging}
                                onDragStart={toggleDragging}
                                onDragEnd={toggleDragging}
                                onDrop={(e) => { e.preventDefault(); handleUpdateTeam(e.dataTransfer.getData('playerId'), 2); }}
                            />
                        )}
                        {((useGameMode && useGameMode.modeConfig.MAX_TEAMS >= 3) || teamLengths[3] !== 0) && (
                            <TeamData
                                teamId={3}
                                teamSize={useGameMode.modeConfig.MAX_TEAMS >= 3 ? useGameMode.modeConfig.TEAM_SIZE : 0}
                                maxTeams={useGameMode.modeConfig.MAX_TEAMS}
                                teamStrict={useGameMode.modeConfig.STRICT_TEAMS}
                                data={participantsData}
                                lobbyOwner={owner}
                                dataLength={teamLengths[3]}
                                draggable={owner === sessionData?.playerId}
                                handlePlayerBan={handlePlayerBan}
                                handleGiveOwner={handleGiveOwner}
                                isDragging={isDragging}
                                onDragStart={toggleDragging}
                                onDragEnd={toggleDragging}
                                onDrop={(e) => { e.preventDefault(); handleUpdateTeam(e.dataTransfer.getData('playerId'), 3); }}
                            />
                        )}
                        <SidebarDynamicLong />
                      </div>
                    </div>
                  </div>
              ) : <LoadingScreen />}
            </>
          )}
        </Base>
    );
}

export async function getServerSideProps({ req, query }: GetServerSidePropsContext) {
  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
          inviteCode: query.inviteCode || '',
      }
  }
}

export default Custom;


