

export interface PlayerLogData {
    _id?: string;
    playerId: string;
    action: string;
    ipAddress: string;
    created: number;
}

export interface PlayerAchievementData {
    _id?: string;
    playerId: string;
    achievementId: string;
    exp: number;
    created: number;
}

export interface PlayerItemData {
    _id?: string;
    playerId: string;
    itemId: string;
    created: number;
}

export interface PlayerLearnData extends LearnLesson {
    _id?: string;
    playerId: string;
    lessonId: string;
    exp: number;
    wpm: number;
    accuracy: number;
    mistakes: number;
    time: number;
    unlocked: number;
    created: number;
}

export interface PlayerNotificationData {
    _id?: string;
    playerId: string;
    type: string;
    message: string;
    read: number;
    location: string;
    created: number;
}

export interface PlayerMatchData {
    _id?: string;
    playerId: string;
    matchId: string;
    wpm: number;
    exp: number;
    points: number;
    placement: number;
    accuracy: number;
    time: number;
    created: number;
    finished: number;
}

export interface PlayerTournamentData {
    _id?: string;
    playerId: string;
    tournamentId: string;
    maxWPM: number;
    avgWPM: number;
    matchesTotal: number;
    matchesWon: number;
    recentWPM: number[];
    placement?: number;
    created: number;
}

export interface PlayerStatisticData {
    _id?: string;
    playerId: string;
    worldId: number;
    lowestElapsed: number;
    highestWPM: number;
    highestEXP: number;
    matchesWon: number;
    matchesLost: number;
    matchesQuit: number;
    tournamentsWon: number;
    tournamentsTop5: number;
    tournamentsLost: number;
}

export interface PlayerRankedData {
    _id?: string;
    playerId: string;
    locale: string;
    seasonId: number;
    modeId: number;
    rating: number;
    deviation: number;
    matchesWon: number;
    matchesLost: number;
    matchesQuit: number;
    created: number;
}

/*
 * Interfaces not related to Player
 */

export interface AuthenticationSessionData extends PlayerData {
    authName: string;
}

export interface AuthenticationData {
    _id?: string;
    playerId: string;
    avatarSrc: string;
    emailAddress: string;
    authName: string;
    authId?: string | null;
    authUser?: string;
    authPassword?: string;
}

export interface PlayerData {
    _id?: string;
    playerId: string;
    name: string;
    discriminator: string;
    avatarSrc: string;
    verified: number;
    patreon: number;
    staff: number;
    experience: number;
    playtime: number;
    currency: number;
    fullName: string;
    dateOfBirth: string;
    useConfig: string;
    countryId: number;
    description: string;
    keyboardBrand: string;
    keyboardModel: string;
    keyboardId: number;
    cardImage: string;
    cardBorder: string;
    banner: number;
    created: number;
}

export interface PlayerShopData {
    currency: number;
    level: PlayerLevelData;
    inventory: string[];
}

export interface PlayerExtendedData extends PlayerData {
    country: {
        name: string;
        code: string;
    },
    Level: PlayerLevelData;
    keyboardLayout: string;
}

export interface LobbyData {
    lobbyId: string;
    invite: string;
    name: string;
    owner: string;
    textId: number;
    textCustom?: string;
    modeId: number;
    allowGuests: number;
    countdown: number;
    privacy: number;
    status: number;
    cardImage?: string;
    cardBorder?: string;
    avatarSrc?: string;
    verified: number;
    patreon: number;
    staff: number;
    gameModes: GamemodeData[];
    playerList: PlayerData[];
}

export interface MatchData {
    _id?: string;
    matchId: string;
    locale: string;
    worldId: number;
    modeId: number;
    modeData: GamemodeData;
    flagId: number;
    textId: number;
    tournamentId: string;
    referralId: string;
    textCustom: string | null;
    timeStart: number;
    timeEnd: number;
    created: number;
}

export interface TournamentData {
    _id?: string;
    tournamentId: string;
    worldId: number;
    locale: string;
    name: string;
    info: string;
    rules: string;
    bracket: string;
    qualifier: number;
    qualifierSort: string;
    qualifierCutoff: number;
    recentWPMTotal: number;
    textType: number;
    textCustom: string;
    manual: number;
    prizing: number;
    prizingJSON: any;
    finished: number;
    startTime: number;
    endTime: number;
    created: number;
    status: number;
    totalPlayers: number;
}

export interface ChallengeData {
    challengeId: string;
    text: string;
    type: string;
    threshold: number;
    value: number;
    flagId: number;
    modeId: number;
    rewards: {
        currency: number;
        item: string[]
    }
}

export interface NewsletterData {
    _id?: string;
    increment: number;
    slug: string;
    title: string;
    thumbnail: string;
    content: string;
    created: number;
}

export interface TextData {
    _id?: string;
    textId: string;
    content: string;
    author: string;
    source: string;
    contributor: string;
}

export interface LearnCourse {
    _id?: string;
    courseId: string;
    name: string;
    keyboard: string;
    order: number;
}

export interface LearnSection {
    _id?: string;
    sectionId: string;
    courseId: string;
    name: string;
    about: string;
}

export interface LearnLesson {
    _id?: string;
    lessonId: string;
    sectionId: string;
    name: string;
    instruction: string;
    text: string;
}

export interface GamemodeData {
    modeId: number;
    modeName: string;
    modeConfig: {
        PLACEMENTS_SORT: string;
        MAX_TEAMS: number;
        STRICT_TEAMS: number;
        MATCH_TIME: number;
        TEAM_SIZE: number;
        ROUND_LIMIT: number;
        ROUND_FIRST: number;
        ROUND_TRIGGER: {
            FINISH_FIRST: boolean;
            FIRST_TYPO: boolean;
        },
        FINISH_TRIGGER: {
            FINISH_FIRST: boolean;
            ROUNDS_FIRST: boolean;
            FIRST_TYPO: boolean;
        },
        PLACEMENTS_KEYSTROKE: boolean;
    };
}

export interface SeasonData {
    id: number;
    name: string;
    start: number;
    end: number;
}

/*
 * Other Interfaces
 */
export interface PlayerCompetitiveData {
    SR: number;
    Rank: string;
    Games: number;
}

export interface PlayerLevelData {
    Index: number;
    Next: number;
    Prev: number;
    Percentage: number;
}

export interface PlayerChallengeData {
    _id?: string;
    playerId: string;
    challengeId: string;
    value: number;
    finished: number;
    count: number;
    created: string; 
    player: PlayerExtendedData[];
    challenge: ChallengeData[];
    mode: GamemodeData[];
}

export interface TwitchData {
    name: string;
    avatar: string;
    title: string;
    viewers: number;
    thumbnail: string;
}

export interface ItemData {
    id: number;
    name: string;
    file: string;
    level: number;
    price: number;
    order: number;
    secret?: boolean;
}