'use client'
import React from 'react'
import Logo from '../shared/Logo'
import { selectActiveBoard } from '@/store/selectors'
import { useAppSelector } from '@/store'

const Header = () => {
  const activeBoard = useAppSelector(selectActiveBoard)

  return (
    <div className='w-full h-24 bg-[#2B2C37] flex items-center border-b border-[#3E3F4E]'>
      {/* {
        <div className='px-6'>
          <Logo />
        </div>
      }

      {<div className='w-px h-full bg-[#3E3F4E]'></div>} */}

      <div className='w-full p-6 flex items-center justify-between'>
        <h1>{activeBoard?.name || 'Select a Board'}</h1>
        <div>

        </div>
      </div>
    </div>
  )
}

export default Header