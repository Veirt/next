import {
    MatchData,
    PlayerCompetitiveData,
    PlayerData,
    PlayerExtendedData,
    PlayerLevelData,
    PlayerMatchData
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
    correctKeystrokes: number;
    Accuracy: number;
    correctKeystrokeString: string;
    currentKeystroke: string;
    currentWord: string;
    Placement: number;
    PlacementFinal: number;
    teamId: number;
    forceReset?: boolean;
    Quit: number;
    roundsWon: number;
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