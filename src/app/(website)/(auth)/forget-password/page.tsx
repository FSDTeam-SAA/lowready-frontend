import ForgatePassword from '@/components/auth/ForgatePassword'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <main>
        <Suspense fallback={<div>Loading...</div>}>

        <ForgatePassword />
        </Suspense>
    </main>
  )
}

export default page