import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto border-b border-gray-800/50">
      <Link href="/" className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        VEO STUDIO
      </Link>
      <div className="flex gap-8 items-center font-bold text-sm uppercase tracking-widest text-gray-400">
        <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
        <Link href="/lab" className="hover:text-white transition-colors">AI Lab</Link>
        <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
        <SignedOut>
          <SignInButton>
            <Button className="bg-white text-black hover:bg-gray-200">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
