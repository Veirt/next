import { useRouter } from "next/router";
import { useEffect } from "react";

interface IProps {
    to: string
}

const Redirect = (props: IProps) => {
    const router = useRouter();

    useEffect(() => {
        if (props.to) 
            router.push(router.basePath + props.to);
    }, [router, props.to]);

    return <></>;
}

export default Redirect;