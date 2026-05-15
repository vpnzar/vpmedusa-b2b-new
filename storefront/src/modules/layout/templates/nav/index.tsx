import TopBar from "../../components/nav/top-bar"
import MainHeader from "../../components/nav/main-header"
import Navbar from "../../components/nav/navbar"

export default function Nav() {
    return (
        <>
            <header className="w-full bg-white">
                <TopBar />
                <MainHeader />
            </header>
            {/* Navbar тепер самостійний і має sticky top-0 */}
            <Navbar />
        </>
    )
}