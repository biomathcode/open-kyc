import { LogOut } from "lucide-react";

import { Button } from "~/components/ui/button";

export function SignOutButton({ onClick }: { onClick: () => any }) {
    return (
        <Button size="sm" onClick={onClick}>
            <LogOut size={16} className="mr-2" />
            Sign out
        </Button>
    );
}