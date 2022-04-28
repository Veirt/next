import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { CancelTokenSource } from 'axios';
import Socket from '../../utils/socket/Socket';
import Config from '../../Config';
import TeamData from '../../components/Custom/TeamData';
import Match from '../../components/Game/GameScreen';
import LoadingScreen from '../../components/Uncategorized/LoadingScreen';
import { faInfoCircle, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import usePlayerToken from '../../hooks/usePlayerToken';
import { LobbyData, GamemodeData } from '../../types.client.mongo';
import { SocketCustomChatData, SocketCustomPlayerData } from '../../types.client.socket';
import { usePlayerContext } from '../../contexts/Player.context';
import useConfig from '../../hooks/useConfig';
import ReactTooltip from 'react-tooltip';
import Redirect from '../../components/Uncategorized/Redirect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../services/ConfigService';
import { GetServerSidePropsContext } from 'next';
import { Meta } from '../../layout/Meta';
import Base from '../../templates/Base';
import Chat from '../../components/Custom/Chat';
import Settings from '../../components/Custom/Settings';

interface IProps {
  inviteCode: string;
}

const Custom = (props: IProps) => {
  const { inviteCode } = props;
  const { t } = useTranslation();

  const axiosCancelSource = useRef<CancelTokenSource | null>(null);

  const { sessionData } = usePlayerContext();
  const { playerToken } = usePlayerToken();
  const { customChatBeep, streamerMode } = useConfig();

  const [showMatch, setShowMatch] = useState(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('undefined');
  const [invite, setInvite] = useState('0');
  const [owner, setOwner] = useState('0');
  const [textId, setTextId] = useState(0);
  const [allowGuests, setAllowGuests] = useState(0);
  const [modeId, setModeId] = useState(0);
  const [textCustom, setTextCustom] = useState('undefined');
  const [privacy, setPrivacy] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [gameModes, setGameModes] = useState<GamemodeData[]>([]);
  const [chatData, setChatData] = useState<SocketCustomChatData[]>([]);
  const [participantsData, setParticipantsData] = useState<SocketCustomPlayerData[]>([]);
  const [message, setMessage] = useState('');
  const [typingData, setTypingData] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<number | null>(null);

  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    axiosCancelSource.current = axios.CancelToken.source();
    if (!inviteCode) {
      axios
        .get(`${Config.apiUrl}/lobby/create`, { withCredentials: true, cancelToken: axiosCancelSource.current?.token })
        .then((response) => {
          if (response.data.error) toast.error(response.data.error);

          setRedirect(!response.data.error ? `/custom/${response.data.lobbyInvite}` : `/`);
        })
        .catch((e) => console.log(e));
    } else {
      setRedirect('');
      if (window) {
        setSocket(
          new Socket(`${Config.gameServer.URL}${Config.gameServer.Port !== null ? `:${Config.gameServer.Port}` : ''}/lobby`, {
            transports: ['websocket', 'polling'],
          }),
        );
      }
    }

    return () => axiosCancelSource.current?.cancel();
  }, [inviteCode, sessionData]);

  useEffect(() => resetChatScroll(), [showMatch]);

  useEffect(() => {
    if (!inviteCode) return;
    const joinPayload = { lobbyInvite: inviteCode, playerToken };

    socket?.onError(() => socket?.disconnect());
    socket?.onDisconnect(() => console.log('[Socket] Disconnected from Lobby!'));
    socket?.onConnect(() => console.log('[Socket] Connected to Lobby!'));
    socket?.on('redirectLobby', () => setShowMatch(true));
    socket?.on('forceEndLobby', () => setShowMatch(false));
    socket?.on('isStaff', () => toast.error('You cannot remove staff members from lobbies.'));
    socket?.on('tooFast', (data: { message: string }) => toast.error(data.message));
    socket?.on('updateLobbyPlayers', (data: SocketCustomPlayerData[]) => setParticipantsData(data));
    socket?.on('isBanned', () => toastAndRedirect('You are banned from this lobby.', '/'));
    socket?.on('isKickedGuest', () => toastAndRedirect('Guests are not allowed to join this lobby.', '/'));
    socket?.emit('getLobby', joinPayload);

    socket?.on('updateLobby', (data: LobbyData) => {
      setName(data.name);
      setInvite(data.invite);
      setPrivacy(data.privacy);
      setTextCustom(data.textCustom && data.textCustom !== 'null' ? data.textCustom : '');
      setOwner(data.owner);
      setTextId(data.textId);
      setAllowGuests(data.allowGuests);
      setModeId(data.modeId);
      setCountdown(data.countdown);
      setGameModes(data.gameModes);
      setLoaded(true);
    });

    socket?.on('sendTyping', (data: { name: string; isTyping: boolean }) => {
      setTypingData((typing) => {
        let currentState = [...typing];

        if (!currentState.includes(data.name) && data.isTyping) currentState.push(data.name);

        if (currentState.includes(data.name) && !data.isTyping) currentState = currentState.filter((name) => name !== data.name);

        return currentState;
      });
    });

    socket?.on('isKicked', (data: { playerId: string; message: string }) => {
      if (data.playerId === sessionData?.playerId) toastAndRedirect(!data.message ? 'You have been removed from this lobby.' : data.message, '/');
    });
    socket?.on('updateLobbyChat', (data: SocketCustomChatData) => {
      setChatData((chatData) => [...chatData, data]);

      if (customChatBeep === '1' && data.type !== 'global' && data.name !== sessionData?.name && data.discriminator !== sessionData?.discriminator) {
        const chatBeepElement = document.getElementById('ChatBeep') as HTMLAudioElement;
        if (chatBeepElement) {
          chatBeepElement.currentTime = 0;
          chatBeepElement.play().then();
        }
      }

      updateChatScroll();
    });

    return () => socket?.disconnect();
  }, [socket, customChatBeep, playerToken, inviteCode, sessionData]);

  const toastAndRedirect = (message: string, redirect: string) => {
    toast.error(message);
    setRedirect(redirect);
  };

  const updateChatScroll = () => {
    const overflowChatElement: HTMLElement | null = document.getElementById('chatbox');
    if (overflowChatElement) {
      const isNotBottom = overflowChatElement.scrollHeight - (overflowChatElement.offsetHeight + overflowChatElement.scrollTop) >= 75;
      if (!isNotBottom) overflowChatElement.scrollTop = overflowChatElement.scrollHeight - overflowChatElement.clientHeight;
    }
  };

  const resetChatScroll = () => {
    const overflowChatElement: HTMLElement | null = document.getElementById('chatbox');
    if (overflowChatElement) overflowChatElement.scrollTop = overflowChatElement.scrollHeight - overflowChatElement.clientHeight;
  };

  const chatOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    socket?.emit('sendTyping', { isTyping: e.target.value.trim() !== '' });
    setMessage(e.target.value);
  };

  const chatOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (sessionData && message) {
        socket?.emit('sendMessage', { message });
        socket?.emit('sendTyping', { isTyping: false });
        setMessage('');
      }
    }
  };

  const handleStartMatch = () => socket?.emit('startLobby', {});
  const handleUpdateTeam = (playerId: string, teamId: number) => {
    socket?.emit('updateLobbyPlayerTeam', { playerId, teamId });
    setIsDragging(null);
  };
  const handlePlayerBan = (playerId: string) => socket?.emit('banPlayer', { playerId });
  const handleGiveOwner = (playerId: string) => socket?.emit('giveOwner', { playerId });
  const handleUpdateSettings = (fieldName: string, value?: any) => {
    const newTextId = fieldName === 'textId' ? parseInt(value, 10) : textId;
    let newTextCustom = fieldName === 'textCustom' ? value : textCustom;
    if (fieldName === 'textId' && newTextId !== 9) newTextCustom = '';

    socket?.emit('updateLobbySettings', {
      name: fieldName === 'name' ? value : name,
      privacy: fieldName === 'privacy' ? parseInt(value, 10) : privacy,
      modeId: fieldName === 'modeId' ? parseInt(value, 10) : modeId,
      countdown: fieldName === 'countdown' ? parseInt(value, 10) : countdown,
      allowGuests: fieldName === 'allowGuests' ? parseInt(value, 10) : allowGuests,
      textId: newTextId,
      textCustom: newTextCustom,
    });
  };

  const getTeamLength = (teamId: number) => {
    let x: number = 0;
    participantsData.map((item) => (item.teamId === teamId ? x++ : null));
    return x;
  };

  const useGameMode = gameModes[modeId];
  const enableStartLobby = getTeamLength(1) >= (useGameMode?.modeConfig.TEAMS.SIZE || 0);

  return (
    <>
      {redirect && <Redirect to={redirect} />}
      <Base meta={<Meta title={!name || name === 'undefined' ? 'Joining Lobby' : name} reverseTitle />} ads={{ enableBottomRail: true }} isLoaded={loaded}>
        <ReactTooltip />
        <audio id="ChatBeep" src="/audio/ChatBeep.wav" crossOrigin="anonymous" preload="auto" />
        {useGameMode && !showMatch ? (
          <>
            <div className="container container-margin">
              {/* Title */}
              <div className="grid grid-cols-1 3xl:grid-cols-2 gap-4">
                <div>
                  <input
                    disabled={owner !== sessionData?.playerId}
                    className="w-full xl:w-auto p-4 text-white bg-gray-750 rounded-md text-xl tracking-wide uppercase text-white font-semibold focus:outline-none"
                    name="title"
                    maxLength={24}
                    onChange={(e) => handleUpdateSettings('name', e.target.value)}
                    defaultValue={name}
                  />
                  <span data-tip="Rewards, Achievements and Records are disabled in Custom matches." className="hidden 3xl:inline ml-3 text-gray-200">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-xl" />
                  </span>
                </div>
                <div className="flex flex-wrap justify-end">
                  <Settings modeId={modeId} privacy={privacy} allowGuests={allowGuests} textId={textId} countdown={countdown} textCustom={textCustom} gameModes={gameModes} owner={sessionData?.playerId === owner} handleUpdateSettings={handleUpdateSettings} />
                </div>
              </div>
              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-4">
                <div className="col-span-full lg:col-span-7">
                  <Chat chatData={chatData} typingData={typingData} message={message} chatOnChange={chatOnChange} chatOnKeyDown={chatOnKeyDown} />
                  <div className="hidden 3xl:block">
                    <div className={'flex flex-wrap gap-x-6 mt-4'}>
                      <div className="w-5/12">
                        <div className={'py-3.5 px-4 bg-gray-750 rounded-xl text-gray-400 font-semibold text-sm'}>Invite your friends by sending them the invite link!</div>
                      </div>
                      <div className={`w-36 my-auto`}>
                        <button
                          type={'button'}
                          onClick={() => {
                            toast.success('Copied to clipboard!');
                            navigator?.clipboard.writeText(`${Config.webUrl}/custom/${invite}`);
                          }}
                          className={'button large orange'}
                        >
                          <FontAwesomeIcon icon={faPaperclip} className={'mr-1 my-auto text-base'} />
                          {streamerMode === '0' ? invite : 'Hidden'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-full lg:col-span-3">
                  {/* Start */}
                  {sessionData?.playerId === owner && (
                    <button
                      type="button"
                      style={{ display: 'block' }}
                      className={`${!enableStartLobby ? 'disabled opacity-50' : ''} mb-4 w-full text-xl button xxlarge orange`}
                      onClick={enableStartLobby ? handleStartMatch : () => false}
                      data-tip={enableStartLobby ? t('page.custom.startmatch') : t('page.custom.error.team_size')}
                    >
                      {t('page.custom.startmatch')}
                    </button>
                  )}

                  {/* Team Data */}
                  {useGameMode && useGameMode.modeConfig.TEAMS.MAX >= 1 && (
                    <TeamData
                      key={1}
                      teamId={1}
                      teamSize={useGameMode.modeConfig.TEAMS.MAX >= 1 ? useGameMode.modeConfig.TEAMS.SIZE : 0}
                      maxTeams={useGameMode.modeConfig.TEAMS.MAX}
                      teamStrict={useGameMode.modeConfig.TEAMS.STRICT}
                      data={participantsData}
                      dataLength={getTeamLength(1)}
                      draggable={owner === sessionData?.playerId}
                      lobbyOwner={owner}
                      handlePlayerBan={handlePlayerBan}
                      handleGiveOwner={handleGiveOwner}
                      isDragging={isDragging !== null && isDragging !== 1}
                      onDragStart={() => setIsDragging(1)}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateTeam(e.dataTransfer.getData('playerId'), 1);
                      }}
                      onDragEnd={() => setIsDragging(null)}
                    />
                  )}
                  <TeamData
                    key={0}
                    teamId={0}
                    teamSize={64}
                    teamStrict={false}
                    data={participantsData}
                    dataLength={getTeamLength(0)}
                    maxTeams={useGameMode?.modeConfig.TEAMS.MAX}
                    lobbyOwner={owner}
                    draggable={owner === sessionData?.playerId}
                    handlePlayerBan={handlePlayerBan}
                    handleGiveOwner={handleGiveOwner}
                    isDragging={isDragging !== null && isDragging !== 0}
                    onDragStart={() => setIsDragging(0)}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUpdateTeam(e.dataTransfer.getData('playerId'), 0);
                    }}
                    onDragEnd={() => setIsDragging(null)}
                  />
                </div>
              </div>
            </div>
          </>
        ) : showMatch ? (
          <Match embed embedOwner={sessionData?.playerId === owner} embedClose={() => socket?.emit('forceEndMatch', {})} />
        ) : (
          <LoadingScreen />
        )}
      </Base>
    </>
  );
};

export async function getServerSideProps({ req, query }: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      inviteCode: query.inviteCode || '',
    },
  };
}

export default Custom;
