
const Social = () => {
    const socialItems = [
        {
            image: '/assets/buttons/discordbutton.webp',
            href: 'https://discord.gg/df4paUq',
        },
        {
            image: '/assets/buttons/patreonbutton.webp',
            href: 'https://patreon.com/KeymashGame',
        },
        {
            image: '/assets/buttons/merchbutton.webp',
            href: 'https://store.keyma.sh/',
        },
        {
            image: '/assets/buttons/githubbutton.webp',
            href: 'https://github.com/keyma-sh/next',
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-6 mt-0.5">
            {socialItems.map((item, index) => ( 
                <a href="{item.href}" className="hover:opacity-70 transition ease-in-out duration-300" target="_blank" rel="noopener noreferrer" key={index}>
                    <img src={item.image} alt="social" />
                </a>
            ))}
        </div>
    )
}

export default Social;