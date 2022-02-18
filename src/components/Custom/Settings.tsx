import { useTranslation } from "next-i18next";
import { useState } from "react";
import { GamemodeData } from "../../types.client.mongo";
import SettingItem from "./SettingItem";

interface IProps {
    // Data
    modeId: number;
    privacy: number;
    allowGuests: number;
    textId: number;
    countdown: number;
    textCustom: string;
    gameModes: GamemodeData[];

    // Labels
    owner: boolean;

    // Functions
    handleUpdateSettings: (key: string, value: number | string) => void;

}

const Settings = (props: IProps) => {
    const { modeId, privacy, allowGuests, gameModes, textId, countdown, textCustom, owner, handleUpdateSettings } = props;
    const { t } = useTranslation();

    const [ dropdown, setDropdown ] = useState<number | null>(null);
    
    return (
        <>
            {dropdown !== null && <div className={`bg-white bg-opacity-0 fixed inset-0 w-full h-screen`} onClick={() => setDropdown(null)} />}
            <SettingItem 
                    className="3xl:rounded-l-xl"
                    label={t('page.custom.mode')} 
                    value={modeId} 
                    options={gameModes.map((item) => { return { label: item.modeName, value: item.modeId } })}
                    onUpdate={(v: number) => { setDropdown(null); handleUpdateSettings('modeId', v) }} 
                    onDropdown={() => setDropdown(dropdown !== 0 ? 0 : null)}
                    isActive={dropdown === 0}
                    isOwner={owner} 
                    textCustom={textCustom} 
            />

            <SettingItem 
                    label={t('page.custom.privacy')}
                    value={privacy} 
                    options={[
                        { label: t('page.custom.public'), value: 0 },
                        { label: t('page.custom.unlisted'), value: 1 },
                    ]}
                    onUpdate={(v: number) => { setDropdown(null); handleUpdateSettings('privacy', v) }} 
                    onDropdown={() => setDropdown(dropdown !== 1 ? 1 : null)}
                    isActive={dropdown === 1}
                    isOwner={owner} 
                    textCustom={textCustom} 
            />

            <SettingItem 
                    label={t('page.custom.guests')}
                    value={allowGuests}  
                    options={[
                        { label: t('options.no'), value: 0 },
                        { label: t('options.yes'), value: 1 },
                    ]}
                    onUpdate={(v: number) => { setDropdown(null); handleUpdateSettings('allowGuests', v); }} 
                    onDropdown={() => setDropdown(dropdown !== 2 ? 2 : null)}
                    isActive={dropdown === 2}
                    isOwner={owner} 
                    textCustom={textCustom} 
            />

            <SettingItem 
                    label={t('page.custom.text')}
                    value={textId} 
                    options={[
                        { label: t('options.random'), value: 0 },
                        { label: t('options.quotes'), value: 1 },
                        { label: t('options.dict'), value: 2 },
                        { label: t('options.custom'), value: 9 },
                    ]}
                    onUpdate={(v: number) => { 
                        if (v !== 9) setDropdown(null); 

                        handleUpdateSettings('textId', v) 
                    }} 
                    onDropdown={() => setDropdown(dropdown !== 3 ? 3 : null)}
                    isActive={dropdown === 3} 
                    isOwner={owner} 
                    isTextDropdown={(v: string) => handleUpdateSettings('textCustom', v)} 
                    textCustom={textCustom} 
            />

            <SettingItem 
                    className="3xl:rounded-r-xl"
                    label={t('page.custom.countdown')}
                    value={countdown} 
                    options={[0,1,2,3,4,5,6,7,8,9,10,11,12].map((_item, index) => { return { label: `${index + 1} seconds`, value: index + 1 } })}
                    onUpdate={(v: number) => { setDropdown(null); handleUpdateSettings('countdown', v) }} 
                    onDropdown={() => setDropdown(dropdown !== 4 ? 4 : null)}
                    isActive={dropdown === 4}
                    isOwner={owner} 
                    isCustomValue={"countdown"}
                    textCustom={textCustom} 
            />
        </>
    )
}

export default Settings;