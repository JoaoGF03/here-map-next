'use client'
import dynamic from 'next/dynamic'

import { useState } from 'react'
import { RestaurantList } from './RestaurantList'

const userPosition = { lat: -20.1813372, lng: -40.2349518 }
const restaurantList = [
  {
    name: 'Kol Restaurant',
    location: { lat: -20.3402238, lng: -40.3748352 },
  },
]

type Location = {
  lat: number
  lng: number
}

export default function MapPage() {
  const Map = dynamic(() => import('./Map'), {
    ssr: false,
  })

  const [restaurantPosition, setRestaurantPosition] = useState<Location>()

  const onClickHandler_ = (location: Location) => {
    setRestaurantPosition(location)
  }

  return (
    <div>
      <RestaurantList
        list={restaurantList}
        onClickHandler={onClickHandler_}
      />
      <Map
        apiKey={process.env.NEXT_PUBLIC_HERE_API_KEY!}
        userPosition={userPosition}
        restaurantPosition={restaurantPosition}
      />
    </div>
  )
}
