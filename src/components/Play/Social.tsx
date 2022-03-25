
const Social = () => {
    const socialItems = [
        {
            image: '/assets/buttons/discord.svg',
            href: 'https://discord.gg/df4paUq',
        },
        {
            image: '/assets/buttons/patreon.svg',
            href: 'https://patreon.com/KeymashGame',
        },
        {
            image: '/assets/buttons/github.svg',
            href: 'https://github.com/keyma-sh/next',
        },
        {
            image: '/assets/buttons/merch.svg',
            href: 'https://keymash.creator-spring.com',
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-8 mt-0.5">
            {socialItems.map((item, index) => ( 
                <a href={item.href} className="hover:opacity-70 transition ease-in-out duration-300" target="_blank" rel="noopener noreferrer" key={index}>
                    <img src={item.image} className="w-full h-auto" alt="social" />
                </a>
            ))}
        </div>
    )
}

export default Social;