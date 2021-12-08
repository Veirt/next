import { FC } from 'react';
import {NewsletterData} from "../../types.client.mongo";
import moment from "moment";
import Link from '../Uncategorized/Link';

interface IProps extends NewsletterData {
    className?: string;
    isBig?: boolean;
    showThumbnail?: boolean;
    showUnread?: boolean;
}

const NewsItem: FC<IProps> = (props) => {
    const { className, slug, title, thumbnail, created, showUnread, isBig } = props;

    return (
        <Link to={`/news/${slug}`} className={`rounded-2xl ${className ? className : ''} news`} style={{ backgroundImage: `url('/news/${thumbnail || 1}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={`news-content ${isBig ? 'h-52' : 'h-auto'}`}>
                <div className={"mt-auto"}>
                    <div className={"text-white uppercase font-semibold text-base lg:text-lg xl:text-xl"}>{title}</div>
                    <div className={"text-sm xl:text-base text-gray-400 mt-auto"}>
                        {moment.unix(created).fromNow()} {showUnread && <span className={"inline ml-2 px-2 rounded py-0.5 text-xs uppercase bg-orange-400 text-orange-900 font-semibold"}>New</span>}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default NewsItem;
