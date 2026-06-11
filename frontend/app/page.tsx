import Board from '@/components/board/Board'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import React from 'react'

const page = () => {
  return (
    <div className='relative h-screen flex'>
      <Sidebar />
      <div className='w-full'>
        <Header />
        <Board />
      </div>
    </div>
  )
}

export default page