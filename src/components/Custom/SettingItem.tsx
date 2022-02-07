
interface IProps {
    isOwner: boolean;
    label: string;
    value: number;
    options: {
        value: number;
        label: string;
    }[];

    // Dropdown active
    onUpdate: (v: number) => void;
    onDropdown: () => void;
    isTextDropdown?: (v: string) => void;
    isCustomValue?: string;
    isActive?: boolean;

    // Optional Params
    textCustom: string;

    // Style
    className?: string;
}

const Settings = (props: IProps) => {

    const { label, value, options, textCustom, onDropdown, onUpdate, isTextDropdown, isOwner, isActive, isCustomValue, className } = props;
    const buttonCSS = `bg-gray-750 text-left text-center px-2 ${isOwner ? 'hover:bg-gray-775 focus:outline-none' : 'pointer-events-none'} transition ease-in-out duration-300 py-3 text-white font-semibold text-sm`;

    return (
        <div className={"w-full sm:w-1/2 md:w-1/3 xl:w-28 relative"}>
            <button type="button" className={`w-full ${className || ''} ${buttonCSS}`} disabled={!isOwner} onClick={() => onDropdown()}>
                <div className={"text-xxs text-gray-400"}>{label}</div>
                <span>{(value === 9 && isTextDropdown) ? options[3]?.label : options[value]?.label}</span>
            </button>

            {isActive && (
                <div className={"dropdown dropdown-gap w-48"}>
                    {options.map((item, index) => (!isCustomValue || isCustomValue === 'countdown' && index >= 6) && (
                        <button key={index} type={"button"} onClick={() => onUpdate(item.value)} className={`item`}>
                            {item.label}
                        </button>
                    ))}

                    {(isTextDropdown && value === 9) && (
                        <textarea
                            className={"block text-sm w-full bg-gray-775 p-2 text-white border-t-2 border-white focus:outline-none focus:shadow"}
                            onChange={(e) => isTextDropdown(String(e.target.value || ''))}
                            rows={3}
                            defaultValue={textCustom || ''}
                            maxLength={1000}
                            placeholder={"Please enter your Custom text here - 5 characters minimum."}
                        />
                    )}
                </div> 
            )}
        </div>
    )
}

export default Settings;