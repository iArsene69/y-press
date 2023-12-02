import React from 'react'
import CustomDialogTrigger from '../global/custom-dialog-trigger'
import Restore from './restore'

export default function Trash({children}: {children: React.ReactNode}) {
  return (
    <CustomDialogTrigger header='Trash Bin' content={<Restore />}>
        {children}
    </CustomDialogTrigger>
  )
}
