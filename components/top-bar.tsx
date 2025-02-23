'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from './ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, SearchIcon, Settings, UserCircle } from 'lucide-react'


export default function StickyNavbar() {

    const router = useRouter()

    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
                    setIsVisible(false)
                } else { // if scroll up show the navbar
                    setIsVisible(true)
                }

                // remember current page location to use in the next move
                setLastScrollY(window.scrollY)
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar)

            // cleanup function
            return () => {
                window.removeEventListener('scroll', controlNavbar)
            }
        }
    }, [lastScrollY])

    return (
        <nav
            className={`z-50 border-b border-black/20 bg-background mb-8 fixed w-full transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="bg-background rounded-b-xl px-3 py-3 flex items-start justify-between gap-2">
                {/* <Link href={"/catalog"} className="flex items-center justify-center rounded-full bg-background h-9 w-9 text-[24px]">
                    <SearchIcon />
                </Link> */}
                <div></div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="h-9 w-9 rounded-full border border-black/80">
                            <AvatarImage src={""} alt="profile image" />
                            <AvatarFallback>PF</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='gap-2 text-black border-gray-300/50 justify-center items-center mt-2 bg-background mr-2'>
                        {/* TODO: REFACTOR */}
                        <Link href="/profile" className='w-full'>
                            <DropdownMenuItem className='flex justify-around items-center'>
                                <span>Profile </span>
                                <UserCircle />
                            </DropdownMenuItem>
                        </Link>
                        {/* <DropdownMenuSeparator className='bg-gray-300/50' /> */}
                        <Link href="/dev" className='w-full'>
                            <DropdownMenuItem className='flex justify-around  items-center'>
                                <span>Billing</span>
                                <CreditCard />
                            </DropdownMenuItem>
                        </Link>
                        {/* <DropdownMenuSeparator className='bg-gray-300/50' /> */}
                        <Link href="/" className='w-full'>
                            <DropdownMenuItem className='flex justify-around  items-center'>
                                <span>Settings </span>
                                <Settings />
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}