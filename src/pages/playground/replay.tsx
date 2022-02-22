import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Replay from "../../components/Uncategorized/Replay";
import { Meta } from "../../layout/Meta";
import ConfigService from "../../services/ConfigService";
import Base from "../../templates/Base";

const Index = () => {
    /* Lukas */
    const quote = `It is a method sufficiently simple in theory, but it has the inconvenience of rendering the subsequent processes of elimination and development, when they occur, somewhat tedious.`;
    const keystrokeLog = `I«354»It«57»It «30»i«98»is«38»is «75»a«70»a «93»m«33»me«90»met«36»meth«60»metho«58»method«102»method «11»s«137»su«37»suf«107»suff«103»suffi«67»suffic«112»suffici«71»sufficie«72»sufficien«59»sufficient«84»sufficientl«102»sufficiently«7»sufficiently «66»s«87»si«47»sim«136»simp«86»simpl«74»simple«43»simple «72»i«63»in«137»in «61»t«52»th«86»the«48»theo«124»theor«88»theory«47»theory,«87»theory, «82»b«65»bu«67»but«104»but «23»i«55»it«101»it «59»h«102»ha«0»has«52»has «53»t«50»th«77»the«48»the «30»i«199»in«156»inc«52»inco«89»incon«215»incone«99»inconev«192»inconeve«102»inconv«1416»inconve«66»inconven«81»inconveni«69»inconvenie«158»inconvenien«94»inconvenienc«94»inconvenience«79»inconvenience «95»o«89»of«53»of «80»r«87»re«29»ren«51»rend«100»rende«91»render«57»renderi«40»renderin«72»rendering«57»rendering «95»t«74»th«12»the«31»the «67»s«105»su«80»sub«40»subs«149»subse«222»subseq«106»subsequ«91»subseque«80»subsequen«94»subsequent«26»subsequent «31»p«99»pr«73»pro«31»proc«103»proce«31»proces«222»process«103»processe«124»processes«165»processes «28»o«38»of«75»of «74»e«19»el«64»eli«177»elim«131»elimi«136»elimin«133»elimini«159»eliminia«78»eliminiat«52»eliminiati«74»eliminiatio«55»eliminiation«144»elimina«1779»eliminat«70»eliminati«72»eliminatio«18»elimination«148»elimination «21»a«77»an«75»and«68»and «50»d«76»de«131»dev«74»deve«74»devel«24»develo«155»develop«26»developm«146»developme«101»developmen«59»development«91»development,«106»development, «56»w«84»wh«69»whe«101»when«64»when «31»t«65»th«72»the«63»they«32»they «4»o«105»oc«63»occ«118»occu«103»occur«87»occur,«93»occur, «32»s«59»so«38»som«156»some«27»somew«165»somewh«70»somewha«77»somewhat«81»somewhat «39»t«86»te«56»ted«113»tedi«32»tedio«67»tediou«144»tedious«94»tedious.«124»`;

    //const quote = `Books are sometimes bound in this way, but the backs are usually rounded into an outward curve, and the fronts into an inward curve.`;
    //const keystrokeLog = `B«385»Bo«94»Boo«130»Book«52»Books«42»Books «70»a«52»ar«64»are«63»are «66»s«79»so«5»som«102»some«96»somet«11»someti«57»sometim«132»sometime«22»sometimes«157»sometimes «37»b«67»bo«68»bou«69»boun«121»bound«67»bound «25»i«67»in«147»in «53»t«30»th«107»thi«56»this«60»this «67»w«117»wa«3»way«151»way,«64»way, «54»b«55»bu«90»but«94»but «0»t«111»th«73»the«84»the «46»b«58»ba«44»bac«78»back«53»backs«53»backs «63»a«57»ar«88»are«25»are «49»u«61»us«59»usu«112»usua«46»usual«104»usuall«106»usually«10»usually «73»r«53»ro«43»rou«86»roun«112»round«39»rounde«101»rounded«118»rounded «17»i«36»in«92»int«107»into«59»into «82»a«56»an«73»an «54»o«105»ou«39»out«80»outw«97»outwa«33»outwar«67»outward«150»outward «28»c«125»cu«72»cur«78»curv«148»curve«43»curve «145»curve«1251»curve,«254»curve, «164»a«62»an«67»and«113»and «92»t«53»th«90»the«68»the «50»f«101»fr«291»fro«124»froj«356»frojf«205»fron«2841»front«40»fronts«116»fronts «10»i«100»in«142»int«65»into«95»into «46»a«108»an«63»an «53»i«125»in«143»inw«32»inwa«59»inwar«37»inward«217»inward «37»c«128»cu«105»cur«65»curv«147»curve«20»curve.«105»`

    /* Cameron */
    //const quote = `I call this turf 'n' turf. It's a 16-ounce T-bone and a 24-ounce porterhouse. Also, whiskey and a cigar. I am going to consume all of this at the same time because I am a free American.`;
    //const keystrokeLog = `I«763»I «33»c«42»ca«61»cal«29»call«113»call «59»t«44»th«64»thi«22»this«64»this «42»t«86»tu«93»tur«61»turf«147»turf «191»'«130»'n«156»'n'«134»'n' «125»t«80»tu«97»tur«49»turf«135»turf.«79»turf. «50»I«180»IT«61»IT'«100»IT's«48»IT's «43»IT's a«71»IT's a «78»I«413»It«90»It'«45»It's«64»It's «56»a«61»a «76»2«89»26«61»16-«515»16-o«198»16-ou«51»16-oun«126»16-ounc«54»16-ounce«28»16-ounce «68»T«160»T-«132»T-b«257»T-bo«106»T-bon«29»T-bone«40»T-bone «85»a«48»an«21»and«71»and «33»a«89»a «85»2«116»24«22»24-«189»24-o«212»24-ou«58»24-oun«111»24-ounc«67»24-ounce«26»24-ounce «44»p«62»po«27»por«92»port«127»portt«116»porte«464»porter«53»porterh«79»porterho«94»porterhou«64»porterhous«72»porterhouse«32»porterhouse.«101»porterhouse. «73»A«79»Al«83»Als«95»Also«133»Also,«195»Also, «35»w«80»wh«88»whi«28»whis«32»whisk«102»whiske«50»whiskey«85»whiskey «46»a«56»an«51»and«37»and «77»a«77»a «46»c«51»ci«86»cig«74»ciga«85»cigar«57»cigar.«44»cigar. «43»I«123»I «47»a«77»am«61»am «39»g«58»go«79»goi«23»goin«21»going«29»going «64»t«57»to«44»to «31»c«94»co«36»con«38»cons«58»consu«104»consum«113»consume«38»consume «38»a«56»al«38»all«112»all «77»o«65»of«33»of «66»t«55»th«48»thi«27»this«40»this «49»a«55»as«57»as «24»as«181»a«152»at«38»at «59»t«76»th«47»the«52»the «38»s«108»sa«64»sam«21»same«74»same «71»t«65»ti«56»tim«25»time«49»time «51»b«77»be«90»bec«50»beca«46»becau«50»becaus«28»because«52»because «34»I«88»I «34»A«46»Am«110»Am «28»Am a«47»Am a «114»Am a a«199»a«537»am«28»am «74»a«100»a «38»f«125»fr«125»fre«32»free«106»free «51»A«266»Am«78»Ame«84»Amer«30»Ameri«63»Americ«79»America«21»American«37»American.«81»`;

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
