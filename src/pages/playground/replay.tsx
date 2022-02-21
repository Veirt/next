import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Replay from "../../components/Uncategorized/Replay";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";

const Index = () => {
    const quote = `I call this turf 'n' turf. It's a 16-ounce T-bone and a 24-ounce porterhouse. Also, whiskey and a cigar. I am going to consume all of this at the same time because I am a free American.`;
    const keystrokeLog = `I«763»I «33»c«42»ca«61»cal«29»call«113»call «59»t«44»th«64»thi«22»this«64»this «42»t«86»tu«93»tur«61»turf«147»turf «191»'«130»'n«156»'n'«134»'n' «125»t«80»tu«97»tur«49»turf«135»turf.«79»turf. «50»I«180»IT«61»IT'«100»IT's«48»IT's «43»IT's a«71»IT's a «78»I«413»It«90»It'«45»It's«64»It's «56»a«61»a «76»2«89»26«61»16-«515»16-o«198»16-ou«51»16-oun«126»16-ounc«54»16-ounce«28»16-ounce «68»T«160»T-«132»T-b«257»T-bo«106»T-bon«29»T-bone«40»T-bone «85»a«48»an«21»and«71»and «33»a«89»a «85»2«116»24«22»24-«189»24-o«212»24-ou«58»24-oun«111»24-ounc«67»24-ounce«26»24-ounce «44»p«62»po«27»por«92»port«127»portt«116»porte«464»porter«53»porterh«79»porterho«94»porterhou«64»porterhous«72»porterhouse«32»porterhouse.«101»porterhouse. «73»A«79»Al«83»Als«95»Also«133»Also,«195»Also, «35»w«80»wh«88»whi«28»whis«32»whisk«102»whiske«50»whiskey«85»whiskey «46»a«56»an«51»and«37»and «77»a«77»a «46»c«51»ci«86»cig«74»ciga«85»cigar«57»cigar.«44»cigar. «43»I«123»I «47»a«77»am«61»am «39»g«58»go«79»goi«23»goin«21»going«29»going «64»t«57»to«44»to «31»c«94»co«36»con«38»cons«58»consu«104»consum«113»consume«38»consume «38»a«56»al«38»all«112»all «77»o«65»of«33»of «66»t«55»th«48»thi«27»this«40»this «49»a«55»as«57»as «24»as«181»a«152»at«38»at «59»t«76»th«47»the«52»the «38»s«108»sa«64»sam«21»same«74»same «71»t«65»ti«56»tim«25»time«49»time «51»b«77»be«90»bec«50»beca«46»becau«50»becaus«28»because«52»because «34»I«88»I «34»A«46»Am«110»Am «28»Am a«47»Am a «114»Am a a«199»a«537»am«28»am «74»a«100»a «38»f«125»fr«125»fre«32»free«106»free «51»A«266»Am«78»Ame«84»Amer«30»Ameri«63»Americ«79»America«21»American«37»American.«81»`;

    //const quote = `1273 down the Rockefeller street, life is marchin' on, do you feel that? 1273 down the Rockefeller street, everything is more than surreal.`;
    //const keystrokeLog = `1«3516»12«65»127«132»1273«89»1273 «131»r«169»d«280»do«74»dow«78»down«71»down «10»t«55»th«89»the«58»the «41»R«141»Ro«87»Roc«94»Rock«67»Rocke«68»Rockef«133»Rockefe«59»Rockefel«70»Rockefell«104»Rockefelle«59»Rockefeller«49»Rockefeller «116»s«55»st«73»str«124»stre«36»stree«117»street«36»street,«67»street, «38»l«132»li«53»lif«21»life«35»life «93»i«56»is«57»is «56»m«89»ma«25»mar«46»marc«124»march«35»marchi«62»marchin«30»marchin'«154»marchin' «101»o«80»on«43»on,«130»on, «73»d«57»do«49»do «89»y«61»yo«65»you«50»you «12»f«53»fe«15»fee«102»feel«57»feel «50»t«52»th«49»tha«42»that«48»that?«304»that? «49»1«367»12«51»127«125»1273«82»1273 «93»d«178»do«94»dow«102»down«29»down «81»t«32»th«57»the«23»the «57»R«123»RO«56»ROc«90»ROck«63»ROcke«90»Rockef«881»Rockefe«71»Rockefel«40»Rockefell«153»Rockefelle«114»Rockefeller«30»Rockefeller «95»s«63»st«34»str«125»stre«26»stree«99»street«49»street,«66»street, «44»e«53»ev«132»eve«114»ever«26»every«81»everyt«44»everyth«76»everythi«92»everythig«76»everythign«18»everythign «166»t«458»e«349»ev«134»eve«111»ever«34»every«97»everyt«31»everyth«80»everythi«99»everythin«48»everything«29»everything «77»i«35»is«71»is «39»m«43»mo«39»mor«28»more«25»more «70»t«107»th«75»tha«48»than«62»than «38»s«74»su«80»sur«68»surr«98»surre«40»surrea«22»surreal«48»surreal.«129»`;

    return (
          <Base meta={<Meta title={"Playground"} />}  ads={{ enableBottomRail: true }} isLoaded={true}>
            <div className="container container-margin container-content">
                <Replay logString={keystrokeLog} quote={quote} />
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
