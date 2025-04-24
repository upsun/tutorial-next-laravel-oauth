import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <Button>
          <Link href="/dashboard">Go to the Dashboard</Link>
        </Button>
    </div>
  );
}
