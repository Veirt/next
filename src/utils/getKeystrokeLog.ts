import axios from 'axios';
import { toast } from 'react-toastify';
import Config from '../Config';

export default async (playerId: string, matchId: string): Promise<string> => {
  let keystrokeLog = '';
  console.log('Fetching Replay: ', `/${process.env.NODE_ENV !== 'production' ? 'dev-' : ''}logs/${playerId}/${matchId}.txt`);

  const response = await fetch(`${Config.storageUrl}/${process.env.NODE_ENV !== 'production' ? 'dev-' : ''}logs/${playerId}/${matchId}.txt`);
  const text = await response.text();
  if (text && response.status === 200) keystrokeLog = text;
  else toast.error(`Failed to fetch keystroke log for ${playerId} in match ${matchId}`);

  return keystrokeLog;
};
