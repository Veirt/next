import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Config from '../../../Config';
import {TournamentData} from "../../../types.client.mongo";
import {toast} from "react-toastify";
import useCSRF from "../../../hooks/useCSRF";
import useConfig from "../../../hooks/useConfig";
import {PlayerTournamentExtendedData} from "../../../components/Leaderboard/LeaderboardPlayerTournament";
import Redirect from '../../../components/Uncategorized/Redirect';
import Base from '../../../templates/Base';
import { Meta } from '../../../layout/Meta';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../../services/ConfigService';
import LoadingScreen from '../../../components/Uncategorized/LoadingScreen';

interface IProps {
    tournamentData: TournamentData;
    playersData: PlayerTournamentExtendedData[];
    tournamentId: string;
}

const TournamentView = (props: IProps) => {

    const { tournamentId } = props;
    const { _csrf } = useCSRF();
    const { networkStrength } = useConfig();

    const [ redirect, setRedirect ] = useState('');

    useEffect(() => {
        if (tournamentId) {
          const postData = { _csrf, networkStrength, flagId: 1, modeId: 0, locale: 'en', tournamentId, };
          axios.post(`${Config.apiUrl}/match/search`, postData, { withCredentials: true })
              .then(response => {
                  if (response && !response.data.error)
                      setRedirect('/game');
                  else
                      toast.error(response.data.error || "We were unable to start finding a match!");
              }).catch(e => console.log(e));
        }
    }, [ tournamentId, _csrf, networkStrength ]);

    return (
          <>
              {redirect && <Redirect to={redirect} />}
              <Base meta={<Meta title={'Finding Match...'} />} ads={{ enableBottomRail: true }} isLoaded>
                  <LoadingScreen />
              </Base>;
          </>
    )
}

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
  return {
      props: {
          ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
          tournamentId: String(params?.id || ''),
      }
  }
}


export default TournamentView;
