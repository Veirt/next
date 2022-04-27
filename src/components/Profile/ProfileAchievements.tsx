import { FC } from 'react';
import { PlayerAchievementData } from '../../types.client.mongo';
import { useTranslation } from 'next-i18next';
import AchievementItem from '../Achievement/AchievementItem';

export interface PlayerAchievementExtendedData extends PlayerAchievementData {
  value?: number;
  achievementId: string;
  title: string;
  type: string;
}

interface IProps {
  data: PlayerAchievementExtendedData[];
}

const ProfileAchievements: FC<IProps> = (props) => {
  const { t } = useTranslation();
  const achievementsData = Object.values(props.data);

  const sections = [
    {
      key: 'maxWPM',
      string: 'page.achievements.personal_best',
    },
    {
      key: 'CasualMatchesTotal',
      string: 'page.achievements.matches_played',
    },
    {
      key: 'CasualMatchesWon',
      string: 'page.achievements.matches_won',
    },
    {
      key: 'TotalTime',
      string: 'page.achievements.playtime',
    },
  ];

  return (
    <div className="content-box">
      {sections.map((section) => (
        <div key={section.string} className={'mb-8 mt-4'}>
          <h3 className={'text-white font-semibold pb-3'}>{t(section.string)}</h3>
          <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
            {achievementsData.map((item) => item.type === section.key && <AchievementItem require={0} {...item} />)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileAchievements;
