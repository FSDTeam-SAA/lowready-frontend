import FamiliesSay from '@/components/search/FamiliesSay/FamiliesSay'
import SearchField from '@/components/search/searchfield/SearchField'
import SearchHero from '@/components/search/searchHero/SearchHero'
import React from 'react'

const page = () => {
  return (
    <div>
        <SearchField />
        <SearchHero />
        <FamiliesSay />
    </div>
  )
}

export default page