import { ReviewFamilyCarousel } from '@/components/landing/FamilyReview'
// import FamiliesSay from '@/components/search/FamiliesSay/FamiliesSay'
import SearchField from '@/components/search/searchfield/SearchField'
import SearchHero from '@/components/search/searchHero/SearchHero'
import React, { Suspense } from 'react'

const page = () => {

  return (
    <div>
      <Suspense fallback={<div>Looding..</div>}>

        <SearchField />
      </Suspense>
        <SearchHero />
        <div className="bg-[#F8F9FA]">

        <ReviewFamilyCarousel />
        </div>
    </div>
  )
}

export default page