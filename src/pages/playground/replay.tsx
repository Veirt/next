import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Replay from "../../components/Uncategorized/Replay";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";

const Index = () => {
    const quote = `I call this turf 'n' turf. It's a 16-ounce T-bone and a 24-ounce porterhouse. Also, whiskey and a cigar. I am going to consume all of this at the same time because I am a free American.`;
    const keystrokeLog = `I«763»I «33»c«42»ca«61»cal«29»call«113»call «59»t«44»th«64»thi«22»this«64»this «42»t«86»tu«93»tur«61»turf«147»turf «191»'«130»'n«156»'n'«134»'n' «125»t«80»tu«97»tur«49»turf«135»turf.«79»turf. «50»I«180»IT«61»IT'«100»IT's«48»IT's «43»IT's a«71»IT's a «78»I«413»It«90»It'«45»It's«64»It's «56»a«61»a «76»2«89»26«61»16-«515»16-o«198»16-ou«51»16-oun«126»16-ounc«54»16-ounce«28»16-ounce «68»T«160»T-«132»T-b«257»T-bo«106»T-bon«29»T-bone«40»T-bone «85»a«48»an«21»and«71»and «33»a«89»a «85»2«116»24«22»24-«189»24-o«212»24-ou«58»24-oun«111»24-ounc«67»24-ounce«26»24-ounce «44»p«62»po«27»por«92»port«127»portt«116»porte«464»porter«53»porterh«79»porterho«94»porterhou«64»porterhous«72»porterhouse«32»porterhouse.«101»porterhouse. «73»A«79»Al«83»Als«95»Also«133»Also,«195»Also, «35»w«80»wh«88»whi«28»whis«32»whisk«102»whiske«50»whiskey«85»whiskey «46»a«56»an«51»and«37»and «77»a«77»a «46»c«51»ci«86»cig«74»ciga«85»cigar«57»cigar.«44»cigar. «43»I«123»I «47»a«77»am«61»am «39»g«58»go«79»goi«23»goin«21»going«29»going «64»t«57»to«44»to «31»c«94»co«36»con«38»cons«58»consu«104»consum«113»consume«38»consume «38»a«56»al«38»all«112»all «77»o«65»of«33»of «66»t«55»th«48»thi«27»this«40»this «49»a«55»as«57»as «24»as«181»a«152»at«38»at «59»t«76»th«47»the«52»the «38»s«108»sa«64»sam«21»same«74»same «71»t«65»ti«56»tim«25»time«49»time «51»b«77»be«90»bec«50»beca«46»becau«50»becaus«28»because«52»because «34»I«88»I «34»A«46»Am«110»Am «28»Am a«47»Am a «114»Am a a«199»a«537»am«28»am «74»a«100»a «38»f«125»fr«125»fre«32»free«106»free «51»A«266»Am«78»Ame«84»Amer«30»Ameri«63»Americ«79»America«21»American«37»American.«81»`;

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
