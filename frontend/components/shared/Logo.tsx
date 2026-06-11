import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
        <Image src='/logo-light.svg' alt='logo' width={152} height={25} />
    </div>
  )
}

export default Logo