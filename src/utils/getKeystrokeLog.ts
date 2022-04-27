import axios from 'axios';
import { toast } from 'react-toastify';
import Config from '../Config';

export default async (playerId: string, matchId: string): Promise<string> => {
  let keystrokeLog = '';
  console.log('Fetching Replay: ', `/${process.env.NODE_ENV !== 'production' ? 'dev-' : ''}logs/${playerId}/${matchId}.txt`);

  const response = await axios.get(`${Config.storageUrl}/${process.env.NODE_ENV !== 'production' ? 'dev-' : ''}logs/${playerId}/${matchId}.txt`);
  if (response.status === 200) keystrokeLog = response.data;
  else toast.error(`Failed to fetch keystroke log for ${playerId} in match ${matchId}`);

  return keystrokeLog;
};
