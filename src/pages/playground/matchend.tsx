import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MatchEnd from '../../components/Game/MatchEnd';
import { Meta } from '../../layout/Meta';
import ConfigService from '../../services/ConfigService';
import Base from '../../templates/Base';

const Index = () => {
  const endMatchData: any = {
    playersLength: 2,
    data: {
      average: {
        wpm: 0,
        accuracy: 0,
        elapsed: 0,
      },
      rewards: {
        exp: 154,
        currency: 163,
        achievements: [],
        challenges: [],
      },
      level: {
        before: {
          Index: 33,
          Next: 36361,
          Prev: 34476,
          Percentage: 16.976127320954905,
        },
        after: {
          Index: 33,
          Next: 36361,
          Prev: 34476,
          Percentage: 25.145888594164457,
        },
      },
      ranked: {
        before: {
          SR: 1300,
          Games: 0,
          Remaining: 0,
          Rank: 'Silver 3',
        },
        after: {
          SR: 1350,
          Games: 0,
          Remaining: 0,
          Rank: 'Gold 1',
        },
      },
      personalBest: true,
      roundData: [
        {
          WPM: 113.41,
          Replay:
            'B«2742»By«217»Byt«79»But «649»l«52»lo«213»loo«203»look«184»look,«168»look, «53»y«87»yo«105»you«16»you «54»f«50»fo«80»fou«40»foun«107»found«45»found «70»t«55»th«14»the«85»the «50»n«46»no«44»not«38»noti«94»notic«71»notice«28»notice,«92»notice, «31»d«104»di«50»did«78»didn«58»didn\'«118»didn\'t«70»didn\'t «76»y«52»yo«74»you«48»you?«149»you? «58»\'«180»\'Y«224»"Ye«960»"Yes«24»"Yes,«91»"Yes, «44»"Yes,«520»"Yes,"«281»"Yes," «235»s«151»sa«5»sai«85»said«29»said «85»A«332»Ar«137»Art«126»Arth«144»Arthu«133»Arthur«84»Arthur,«99»Arthur, «63»"«193»"y«196»"ye«65»"yes«30»"yes «95»I«110»I «50»d«45»di«78»did«39»did.«102»did. «64»I«158»It«123»It «46»w«79»wa«57»was«76»was «72»o«47»on«38»on «73»d«94»di«91»dis«90»disp«44»displ«35»displa«61»display«69»display «61»i«62»in«45»in «46»t«60»th«83»the«6»the «34»b«121»bo«63»bot«100»bott«102»botto«56»bottom«26»bottom «87»o«54»of«22»of «88»a«67»a «81»l«92»lo«125»loc«9»lock«162»locke«43»locked«106»locked «64»f«56»fi«66»fil«43»fili«154»filin«50»filing«121»filing «45»c«60»ca«91»cab«71»cabi«148»cabin«6»cabine«273»cabinet«26»cabinet «107»s«67»st«154»stu«56»stuc«108»stuck«40»stuck «99»i«46»in«26»in «54»a«50»a «89»d«295»di«114»dis«107»disu«104»disus«101»disuse«51»disused«114»disused «62»i«84»l«391»la«40»lav«68»lava«140»lavat«62»lavato«124»lavator«56»lavatory«110»lavatory «68»w«52»wi«36»wit«42»with«81»with «85»a«45»a «66»s«56»si«50»sig«83»sign«64»sign «25»o«87»on«32»on «91»t«46»th«18»th «80»th d«133»th do«37»th doo«146»th door«81»t«411»te«87»teh«13»teh «109»teh d«50»teh do«86»teh doo«121»teh door«81»t«400»th«93»the«49»the «110»d«45»do«66»doo«137»door«59»door «62»s«47»sa«37»say«69»sayi«99»sayin«47»saying«46»saying «69»\'«113»\'B«148»\'Be«113»\'Bew«113»\'Bewa«77»\'Bewar«78»\'Beware«37»\'Beware «117»o«46»of«36»of «59»t«84»th«31»the«77»the «40»L«135»Le«106»Leo«103»Leop«102»Leopa«84»Leopar«60»Leopard«14»Leopard.«313»Leopard.\'«240»Leopard.\'"«258»',
          Keystrokes: {
            averageDelay: 103,
            delay: [
              0, 296, 649, 52, 213, 203, 184, 168, 53, 87, 105, 16, 54, 50, 80, 40, 107, 45, 70, 55, 14, 85, 50, 46, 44, 38, 94, 71, 28, 92, 31, 104, 50, 78, 58, 118, 70, 76, 52, 74, 48, 149, 58, 404, 960, 24, 91, 564, 281, 235, 151, 5, 85, 29, 85, 332, 137, 126, 144, 133, 84, 99, 63, 193, 196, 65,
              30, 95, 110, 50, 45, 78, 39, 102, 64, 158, 123, 46, 79, 57, 76, 72, 47, 38, 73, 94, 91, 90, 44, 35, 61, 69, 61, 62, 45, 46, 60, 83, 6, 34, 121, 63, 100, 102, 56, 26, 87, 54, 22, 88, 67, 81, 92, 125, 9, 162, 43, 106, 64, 56, 66, 43, 154, 50, 121, 45, 60, 91, 71, 148, 6, 273, 26, 107,
              67, 154, 56, 108, 40, 99, 46, 26, 54, 50, 89, 295, 114, 107, 104, 101, 51, 114, 62, 475, 40, 68, 140, 62, 124, 56, 110, 68, 52, 36, 42, 81, 85, 45, 66, 56, 50, 83, 64, 25, 87, 32, 91, 46, 18, 888, 209, 738, 93, 49, 110, 45, 66, 137, 59, 62, 47, 37, 69, 99, 47, 46, 69, 113, 148, 113,
              113, 77, 78, 37, 117, 46, 36, 59, 84, 31, 77, 40, 135, 106, 103, 102, 84, 60, 14, 313, 240, 258,
            ],
            incorrect: [2, 44, 48, 154, 180, 180, 180, 180, 180, 181, 181, 182, 182, 182, 182],
          },
          Words: {
            averageWPM: 522,
            wpm: [0, 873, 262, 392, 204, 444, 554, 381, 2559, 355, 1118, 579, 160, 328, 327, 284, 158, 545, 153, 183, 555, 164, 148, 601, 535, 782, 524, 126, 139, 948, 1143, 296, 111, 278, 210, 2151, 369, 414, 796, 141, 232, 1415],
            incorrect: [8, 30, 35],
          },
          Accuracy: 93,
          ElapsedTime: 24.12,
          Chart: {
            wpm: [16.46, 46.95, 81.79, 92.76, 79.43, 83.61, 87.71, 89.53, 93.51, 99.13, 103.8, 105.84, 109.33, 110.97, 111.34, 112.47, 114.58, 115.12, 111.33, 113.36, 115.2],
            labels: ['look,', 'found', 'notice,', 'you?', 'said', '"yes', 'did.', 'was', 'display', 'the', 'of', 'locked', 'cabinet', 'in', 'disused', 'with', 'sign', 'the', 'saying', 'of', 'Leopard.\'"'],
            accuracy: [75, 92, 96, 97, 94, 95, 96, 96, 96, 96, 97, 97, 97, 97, 98, 97, 97, 95, 92, 93, 93],
            words: [873, 392, 444, 381, 355, 579, 328, 284, 545, 183, 164, 601, 782, 126, 948, 296, 278, 990, 414, 141, 258],
            step: 0,
          },
          Text: {
            textId: 1860,
            content: 'But look, you found the notice, didn\'t you? "Yes," said Arthur, "yes I did. It was on display in the bottom of a locked filing cabinet stuck in a disused lavatory with a sign on the door saying \'Beware of the Leopard.\'"',
            custom: 'But look, you found the notice, didn\'t you? "Yes," said Arthur, "yes I did. It was on display in the bottom of a locked filing cabinet stuck in a disused lavatory with a sign on the door saying \'Beware of the Leopard.\'"',
            author: 'Douglas Adams',
            source: "The Hitchhiker's Guide to the Galaxy",
            contributor: 'ClemenPine#2908',
          },
        },
      ],
    },
    matchData: {
      teamId: 1,
      _id: 'sF9Y5YM8DoztWEns6',
      matchId: '187976187459538944',
      locale: 'en',
      modeId: 0,
      flagId: 3,
      textId: 1860,
      textCustom: '',
      tournamentId: '',
      referralId: '',
      timeStart: 1645031427.555,
      timeEnd: 1645031727.555,
      created: 1645031415.555,
      modeData: {
        modeId: 0,
        modeName: 'Free for All',
        modeConfig: {
          TIMER: 300,
          TEAMS: {
            MAX: 1,
            SIZE: 0,
            STRICT: false,
          },
          ROUNDS: {
            LIMIT: 0,
            FIRST: 0,
          },
          TRIGGERS: {
            FIRST_TYPO: false,
            FIRST_FINISH: true,
          },
          SORT: {
            ROUND: 'grossWPM',
            GLOBAL: 'grossWPM',
          },
        },
      },
      textContent: 'But look, you found the notice, didn\'t you? "Yes," said Arthur, "yes I did. It was on display in the bottom of a locked filing cabinet stuck in a disused lavatory with a sign on the door saying \'Beware of the Leopard.\'"',
      textAppend: '',
    },
    leaveUrl: '/',
    restartUrl: '/play/regular',
    embed: false,
  };

  return (
    <>
      <Base
        meta={<Meta title={'Playground'} />}
        isLoaded={true}
        ads={{
          enableTrendiVideo: true,
        }}
      >
        <div className="container-smaller">
          <div className="flex h-game">
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
    },
  };
}

export default Index;
