import {
    GamemodeData,
    MatchData,
    PlayerCompetitiveData,
    PlayerData,
    PlayerExtendedData,
    PlayerLevelData,
    PlayerMatchData,
    PlayerRoundData
} from "./types.client.mongo";

export interface ChatroomMessageProps {
    playerData: PlayerExtendedData;
    message: string;
    posted: number;
}

export interface SocketLearnEndData {
    netWPM: number;
    grossWPM: number;
    Accuracy: number;
    Mistakes: number;
    Elapsed: number;
}

export interface SocketCustomPlayerData extends PlayerExtendedData {
    teamId: number;
    state: number;
}

export interface SocketCustomChatData {
    name: string;
    avatarSrc: string;
    discriminator: string;
    cardBorder: string;
    patreon: number;
    verified: number;
    staff: number;
    type: string;
    message: string;
    posted: string;
}

export interface SocketMatchPlayerData extends PlayerData, PlayerMatchData {
    Level: PlayerLevelData;
    WPM: number;
    Progress: number;
    Accuracy: number;
    correctKeystrokeString: string;
    currentKeystroke: string;
    currentInput: string;
    currentWord: string;
    correctWords: number;
    wordLetterIndex: number;
    Replay: string;
    Placement: number;
    PlacementFinal: number;
    teamId: number;
    forceReset?: boolean;
    Quit: number;
    roundsWon: number;
    spectatorOnly: boolean;
}

export interface SocketMatchEndData {
    calculateEXP: number;
    calculateCurrency: number;
    achievementsUnlocked: number;
    Competitive: PlayerCompetitiveData;
    CompetitiveNew: PlayerCompetitiveData;
    levelBefore?: PlayerLevelData;
    levelAfter?: PlayerLevelData;
    personalBest: boolean;
    roundData: {
        Accuracy: number;
        Mistakes: number;
        Incorrect: { timestamp: number; word: string }[];
        WPM: number;
        Replay: { delay: number; word: string }[];
        ElapsedTime: number;
        calculateEXP: number;
        Chart: {
            labels: string[];
            word: string[];
            wpm: number[];
            accuracy: number[];
        };
        Text: {
            textSourceSource: string;
            textContent: string;
            textSourceContributor: string;
            textSourceAuthor: string;
        };
    }[];
}

export interface SocketMatchData extends MatchData {
    textContent: string;
    textCustom: string;
    textSourceSource: string;
    textSourceContributor: string;
    textSourceAuthor: string;
}

export interface GlobalMatchData {
    roundData: {
        timeStart: number;
        timeEnd: number;
        total: number;
    };
    textData: {
        textId: number;
        content: string;
        custom: string;
        author: string;
        source: string;
        contributor: string;
    }[];
    matchData: {
        locale: string;
        textId: number;
        worldId: number;
        flagId: number;
        modeId: number;
        modeData: GamemodeData;
        tournamentId: string,
        referralId: string,
    };
    playerCount: number;
    placementsFinalized: boolean;
}

export interface SocketGameEndData {
    average: {
        wpm: number;
        accuracy: number;
        elapsed: number;
    };
    rewards: {
        exp: number;
        currency: number;
        achievements: string[];
        challenges: string[];
    };
    level: {
        before: {
            Index: number;
            Next: number;
            Prev: number;
            Percentage: number;
        };
        after: {
            Index: number;
            Next: number;
            Prev: number;
            Percentage: number;
        };
    };
    ranked: {
        before: {
            SR: number;
            Games: number;
            Rank: string;
        };
        after: {
            SR: number;
            Games: number;
            Rank: string;
        };
    };
    personalBest: boolean;
    roundData: PlayerRoundData[];
}

export interface SocketChartData {
    wpm: number[];
    labels: string[];
    accuracy: number[];
    words: number[];
    step?: number;
}