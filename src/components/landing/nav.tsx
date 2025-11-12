import { Avatar } from "../ui/avatar";
import { Label } from "../ui/field";
import { Link } from "../ui/link";
import { SidebarLabel } from "../ui/sidebar";

function Navbar() {
    return (
        <nav className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-7xl px-4 md:px-8 mx-auto py-4 items-center justify-between  flex">
                <Link href="/" className="flex items-center gap-x-2">
                    <Avatar
                        isSquare
                        size="md"
                        className=""
                        src="/logo.svg"
                    />
                    <Label className="font-medium lg:text-2xl">
                        Open<span className="text-muted-fg">KYC</span>
                    </Label>
                </Link>
                <div className="flex items-center gap-10">

                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-sm px-4 inline-block py-2 rounded-md text-neutral-600 dark:text-neutral-400 font-medium">
                        Login</Link>
                    <Link href="/sign-up" className="text-sm px-4 inline-block py-2 rounded-md text-neutral-600 dark:text-neutral-400 font-medium">
                        Signup</Link>
                </div></div>

        </nav >
    );
}

export default Navbar;