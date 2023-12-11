'use client'
import {RestaurantEntry} from './RestaurantEntry'

type Props = any

export function RestaurantList(props: Props) {
  const entries = props.list

  const list = entries.map((entry:any) => {
    return (
      <RestaurantEntry
        data={entry}
        onClickHandler={props.onClickHandler}
        key={Math.random()}
      ></RestaurantEntry>
    )
  })
  return (
    <div
      id="restaurant-list"
      style={{ display: 'grid' }}
    >
      {list}
    </div>
  )
}

