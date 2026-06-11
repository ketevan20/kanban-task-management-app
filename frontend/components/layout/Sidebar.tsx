'use client'
import { useEffect, useState } from 'react'
import Logo from '../shared/Logo'
import Image from 'next/image'
import { selectActiveBoard, selectAllBoards } from '@/store/selectors'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchBoard, fetchBoards } from '@/store/thunks/boardThunks'

const Sidebar = () => {
    const dispatch = useAppDispatch()
    const [isHidden, setIsHidden] = useState(false)
    const boards = useAppSelector(selectAllBoards)
    const activeBoard = useAppSelector(selectActiveBoard)
    const boardsCount = boards.length

    useEffect(() => {
        dispatch(fetchBoards())
    }, [dispatch])

    if (isHidden) {
        return (
            <button onClick={() => setIsHidden(false)} className='absolute w-14 bottom-8 left-0 p-5 bg-[#635FC7] flex items-center justify-center rounded-tr-3xl rounded-br-3xl'>
                <Image src='/icon-show-sidebar.svg' alt='show sidebar icon' width={16} height={11} />
            </button>
        )
    };

    function handleBoardClick(boardId: string) {
        dispatch(fetchBoard(boardId))
    }

    return (
        <div className="fixed w-75 h-screen py-8 pr-6 bg-[#2B2C37] flex flex-col justify-between border-r border-[#3E3F4E]">
            <div className='flex flex-col gap-12'>
                <div className='ml-6'><Logo /></div>
                <div className='flex flex-col gap-5'>
                    <p className='ml-6 uppercase'>All boards ({boardsCount})</p>
                    <div className='flex flex-col gap-1'>
                        {
                            boards.map(board => (
                                <button onClick={() => handleBoardClick(board._id)} key={board._id} className={`py-3 rounded-tr-3xl rounded-br-3xl ${activeBoard?._id === board._id ? 'bg-[#635FC7] text-white' : 'hover:bg-[#A8A4FF] hover:text-white'}`}>
                                    <div className='pl-6 flex items-center gap-4'>
                                        <Image src='/icon-board.svg' alt='board icon' width={16} height={16} />
                                        <p>{board.name}</p>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-5 ml-6'>
                <div className="bg-[#20212C] py-3.5 flex gap-6 items-center justify-center rounded-md">
                    <Image src='/icon-light-theme.svg' alt='light theme icon' width={16} height={16} />
                    <Image src='/icon-dark-theme.svg' alt='dark theme icon' width={16} height={16} />
                </div>
                <button onClick={() => setIsHidden(!isHidden)} className='flex items-center gap-4'>
                    <Image src='/icon-hide-sidebar.svg' alt='hide sidebar icon' width={16} height={16} />
                    <p>Hide Sidebar</p>
                </button>
            </div>
        </div>
    )
}

export default Sidebar