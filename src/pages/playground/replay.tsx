import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Replay from "../../components/Uncategorized/Replay";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";

const Index = () => {
    const quote = `I woke up this morning and figured I'd call you in case I'm not here tomorrow, I'm hopin' that I can borrow a peace of mind, I'm behind on what's really important.`;
    const keystrokeLog = `I«419»I «62»w«70»wo«88»wok«6»woke«110»woke «44»u«79»up«27»up «82»t«42»th«80»thi«76»this«47»this «7»m«74»mo«76»mor«54»morn«53»morni«71»mornin«42»morning«70»morning «72»a«76»an«39»and«53»and «54»f«104»fi«7»fig«73»figu«134»figur«45»figure«45»figured«102»figured «70»I«72»I'«138»I'd«7»I'd «102»c«40»ca«43»cal«39»call«135»call «72»y«39»yo«72»you«71»you «9»i«105»in«104»in «327»c«133»ca«39»cas«72»case«70»case «6»I«178»I'«104»I'm«133»I'm «106»o«134»ot«100»ot «37»ot h«39»n«400»no«73»not«37»not «102»h«7»he«70»her«37»here«71»here «69»t«38»to«69»tom«38»tomo«99»tomor«38»tomorr«167»tomorro«39»tomorrow«115»tomorrow,«39»tomorrow, «71»I«148»I'«136»I'm«164»I'm «100»h«106»ho«73»hop«69»hopi«102»hopin«39»hoping«36»hoping «142»hoping«229»hopin«168»hopin'«133»hopin' «137»t«7»th«133»tha«40»that«38»that «72»I«101»I «38»c«38»ca«69»can«38»can «40»b«242»bo«136»bor«40»borr«104»borro«104»borrow«71»borrow «70»a«40»a «71»p«72»pe«71»pea«72»peac«39»peace«40»peace «69»o«41»of«70»of «40»m«39»mi«102»min«38»mind«40»mind,«102»mind, «70»I«104»I'«151»I'm«130»I'm «37»b«38»be«103»beh«68»behi«69»behin«38»behind«68»behind «39»o«71»on«7»on «39»w«70»wh«51»wha«69»what«41»what'«70»what's«39»what's «69»r«39»re«39»rea«6»real«71»reall«133»really«38»really «40»i«104»im«38»imp«39»impo«39»impor«37»import«100»importa«68»importan«70»important«70»important.«67»`;

    return (
        <Base meta={<Meta title={"Playground"} />} isLoaded={true}>
            <div className={"flex h-screen"}>
                <div className={"m-auto max-w-screen-lg"}>
                    <Replay logString={keystrokeLog} quote={quote} />
                </div> 
            </div>
        </Base>
    )
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
        }
    }
  }

export default Index;
