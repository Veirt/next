import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MatchEnd from "../../components/Game/MatchEnd";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";
import { SocketMatchEndData } from "../../types.client.socket";

const Index = () => {

    interface EndProps {
        data: SocketMatchEndData | null;
        lobbyReferral: string;
        tournamentId?: string;
        playersLength: number;
        isRanked: boolean;
        isRounds: boolean;
        isMode: number;
        showRewards: boolean;
        leaveUrl: string;
        restartUrl: string;
        embed: boolean;
        embedClose?: () => void | false;
        embedOwner?: boolean;
      }

    const endMatchData: any = {
        data: {
            "average": {
                "wpm": 0,
                "accuracy": 0,
                "elapsed": 0
            },
            "rewards": {
                "exp": 0,
                "currency": 0,
                "achievements": [],
                "challenges": []
            },
            "level": {
                "before": {
                    "Index": 12,
                    "Next": 8684,
                    "Prev": 7847,
                    "Percentage": 50.77658303464755
                },
                "after": {
                    "Index": 14,
                    "Next": 10460,
                    "Prev": 9555,
                    "Percentage": 86.62983425414365
                }
            },
            "ranked": {
                "before": {
                    "SR": 0,
                    "Games": 0,
                    "Rank": "Unrated"
                },
                "after": {
                    "SR": 0,
                    "Games": 0,
                    "Rank": "Unrated"
                }
            },
            "personalBest": true,
            "roundData": [
                {
                    "WPM": 152.91,
                    "Mistakes": 3,
                    "Incorrect": [
                        {
                            "timestamp": 1643597964175,
                            "word": "who"
                        },
                        {
                            "timestamp": 1643597968629,
                            "word": "thick"
                        },
                        {
                            "timestamp": 1643597970695,
                            "word": "slices"
                        }
                    ],
                    "Accuracy": 96,
                    "ElapsedTime": 17.5,
                    "Chart": {
                        "wpm": [
                            75.14,
                            102.81,
                            121.16,
                            133.29,
                            142.51,
                            146.47,
                            153.63,
                            158.79,
                            159.81,
                            165.81,
                            165.8,
                            166.77,
                            168.81,
                            170.38,
                            173.93,
                            175.14,
                            173.93,
                            174.85,
                            175.24,
                            170.66,
                            162.48,
                            159.41,
                            152.91
                        ],
                        "labels": [
                            "was",
                            "knock",
                            "the",
                            "and",
                            "half",
                            "in",
                            "chair",
                            "meet",
                            "a",
                            "her",
                            "landlady",
                            "came",
                            "carrying",
                            "tray",
                            "which",
                            "a",
                            "cup",
                            "tea",
                            "two",
                            "and",
                            "slices",
                            "bread",
                            "jam."
                        ],
                        "accuracy": [
                            100,
                            100,
                            100,
                            100,
                            100,
                            100,
                            100,
                            100,
                            100,
                            100,
                            100,
                            99,
                            99,
                            99,
                            99,
                            99,
                            99,
                            99,
                            99,
                            98,
                            95,
                            95,
                            96
                        ],
                        "words": [
                            0.24,
                            0.369,
                            0.211,
                            0.211,
                            0.347,
                            0.15,
                            0.366,
                            0.296,
                            0.128,
                            0.182,
                            0.722,
                            0.203,
                            0.609,
                            0.299,
                            0.281,
                            0.125,
                            0.301,
                            0.249,
                            0.291,
                            0.28,
                            1.324,
                            0.748,
                            0.979
                        ],
                        "step": 0
                    },
                    "Text": {
                        "textId": 296,
                        "content": "There was a knock at the door, and she half turned in her chair to meet with a smile her stout landlady who came in carrying a tray on which stood a large cup of tea and two thick and wholesome slices of bread and jam.",
                        "custom": "There was a knock at the door, and she half turned in her chair to meet with a smile her stout landlady who came in carrying a tray on which stood a large cup of tea and two thick and wholesome slices of bread and jam.",
                        "author": "Edgar Wallace",
                        "source": "The Angel of Terror",
                        "contributor": "Fruit#7132"
                    }
                }
            ]
        },
        lobbyReferral: '',
        playersLength: 6,
        isRanked: false,
        isRounds: true,
        isMode: 2,
        showRewards: false,
        leaveUrl: '/Play',
        restartUrl: '/restart',
        embed: false,
    }

    return (
        <>
            <Base meta={<Meta title={"Playground"} />} isLoaded={true}>
                <div className="container-smaller">
                    <div className="flex h-screen">
                        <div className="w-full m-auto">
                            <MatchEnd {...endMatchData} showRewards />
                        </div>
                    </div>
                </div>
            </Base>
        </>
    );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {

    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
        }
    }
  }

export default Index;