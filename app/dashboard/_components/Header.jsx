'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
    const path=usePathname()
    useEffect(()=>{
      console.log(path)
    },[])
  return (
    <div className='flex p-4 justify-between item-center bg-secondary shadow-sm'>
        <Image src={'/logo.svg'} width={50} height={50} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold hover:cursor-pointer transition-all ${path=='/dashboard' && 'text-blue-500 font-bold'}`}>Dashboard</li>
            <li className={`hover:text-primary hover:font-bold hover:cursor-pointer transition-all ${path=='/dashboard/questions' && 'text-blue-500 font-bold'}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold hover:cursor-pointer transition-all ${path=='/dashboard/upgrade' && 'text-blue-500 font-bold'}`}>Upgrade</li>
            <li className={`hover:text-primary hover:font-bold hover:cursor-pointer transition-all ${path=='/dashboard/how' && 'text-blue-500 font-bold'}`}>How it works</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header

