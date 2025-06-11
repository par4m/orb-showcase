import Link from "next/link"

export default function Navbar() {
    return (
        <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/uc-ospo-logo.svg" alt="UC OSPO Network" className="h-8 w-auto" />
            <span className="text-xl font-bold text-sky-700">UC ORB</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="font-medium">
              Home
            </Link>
            <Link href="/repositories" className="font-medium font-bold text-sky-700">
              Repositories
            </Link>
            <Link href="/about" className="font-medium">
              About
            </Link>
            <Link href="/connect" className="font-medium">
              Connect
            </Link>
          </nav>
        </div>
      </header>
    )
}
