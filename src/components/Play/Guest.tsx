import Link from "../Uncategorized/Link"

const Guest = () => {
    return (
        <>
            <div className="h1">Welcome Guest!</div>
            <p className="mt-6 text-lg block">
                Creating an account on Keymash will allow you to take advantage of all the features of the site.
                <ul className="list-disc pl-6 py-10">
                    <li>Participate in daily challenges</li>
                    <li>Save your highscores</li>
                    <li>Compete in tournaments</li>
                    <li>Show up in all leaderboards</li>
                    <li>Ability to personalize your profile</li>
                    <li>Exchange coins for in game items</li>
                </ul>
                <Link to="/auth/login" className="flex w-60 button default orange">
                    Create an account!
                </Link>
            </p>
        </>
    )
}

export default Guest;