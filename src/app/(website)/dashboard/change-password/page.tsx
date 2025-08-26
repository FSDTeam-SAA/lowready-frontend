import { ChangePassword } from '@/components/dashboard/changePassword/ChangePasswordForm'
import ProfileCard from '@/components/dashboard/profile/profile-card'
import React from 'react'

const page = () => {
  return (
   <div className="flex flex-col lg:flex-row gap-5 p-5">
     {/* Profile Card */}
          <div className="w-full lg:w-1/3">
            <ProfileCard />
          </div>
          {/* ChangePassword Form */}
        <div className="w-full lg:w-2/3">
        <ChangePassword />
        </div>
    </div>
  )
}

export default page