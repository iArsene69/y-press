import React from 'react'

export default function Layout({children, params}: {children: React.ReactNode; params?: string}) {
  return (
    <main className='overflow-hidden flex h-[100dvh]'>{children}</main>
  )
}
