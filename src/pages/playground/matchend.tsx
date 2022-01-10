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

    const endMatchData: EndProps = {
        data: {
            calculateEXP: 250,
            calculateCurrency: 2395,
            achievementsUnlocked: 5,
            personalBest: true, 
            Competitive: {
                SR: 2500,
                Rank: 'bronze',
                Remaining: 0,
                Games: 9
            },
            CompetitiveNew: {
                SR: 2520,
                Rank: 'silver',
                Remaining: 0,
                Games: 10
            },
            levelBefore: {
                Index: 54,
                Next: 10000,
                Prev: 8000,
                Percentage: 36.234
            },
            levelAfter: {
                Index: 54,
                Next: 10000,
                Prev: 8000,
                Percentage: 38
            },
            roundData: [
                {
                    Accuracy: 100,
                    Mistakes: 0,
                    Incorrect: [ { timestamp: 0, word: 'Yes' },   { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, { timestamp: 0, word: 'Yes' }, ],
                    WPM: 250,
                    Replay: [ { delay: 0, word: 'Yes' }],
                    ElapsedTime: 2,
                    calculateEXP: 100,
                    Chart: {
                        labels: ['sdf'],
                        word: ['word'],
                        wpm: [ 250 ],
                        accuracy: [ 100 ]
                    },
                    Text: {
                        textSourceSource: "V for Vendetta",
                        textContent: "It is at this point in our story that along comes a spider.",
                        textSourceContributor: "Lachney#8129",
                        textSourceAuthor: "Hunger Games"
                    }
                },
                {
                    Accuracy: 98,
                    Mistakes: 0,
                    Incorrect: [ { timestamp: 0, word: 'Ask' }, { timestamp: 0, word: 'your' }, { timestamp: 0, word: 'day.' }],
                    WPM: 200,
                    Replay: [ { delay: 0, word: 'Yes' }],
                    ElapsedTime: 5.98,
                    calculateEXP: 100,
                    Chart: {
                        labels: ['sdf'],
                        word: ['word'],
                        wpm: [ 250 ],
                        accuracy: [ 100 ]
                    },
                    Text: {
                        textSourceSource: "V for Vendetta",
                        textContent: "It is at this point in our story that along comes a spider.",
                        textSourceContributor: "Lachney#8129",
                        textSourceAuthor: "Hunger Games"
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