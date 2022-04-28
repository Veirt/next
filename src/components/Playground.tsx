import { FC } from 'react';

const Playground: FC = () => {
  return <div className={'container container-margin text-white text-center py-10'}></div>;
};

export default Playground;

/*
    const endMatchData = {
        data: {
            calculateEXP: 250,
            calculateCurrency: 2395,
            achievementsUnlocked: 5,
            Competitive: {
                SR: 2500,
                Rank: 'bronze',
                Games: 9
            },
            CompetitiveNew: {
                SR: 2520,
                Rank: 'silver',
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
                        textSourceTitle: "V for Vendetta",
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
                        textSourceTitle: "V for Vendetta",
                        textContent: "It is at this point in our story that along comes a spider.",
                        textSourceContributor: "Lachney#8129",
                        textSourceAuthor: "Hunger Games"
                    }
                }
            ]
        },
        lobbyReferral: '',
        matchTournament: '',
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
        <div className={"flex h-auto md:h-screen"}>
            <div className={"my-24 md:my-auto container-game"}>
                <MatchEnd {...endMatchData} />
            </div>
        </div>
    )
    */
