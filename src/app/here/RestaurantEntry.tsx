'use client'

type Props = any


export function RestaurantEntry(props: Props) {
  const handleClick = () => {
    props.onClickHandler(props.data.location)
  }
  // Add basic styling for each restaurant entry
  const entryStyle = {
    display: 'inline-block',
    padding: '10px',
    margin: '5px',
    border: '1px solid gray',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  return (
    <div
      style={entryStyle}
      onClick={handleClick}
    >
      {props.data.name}
    </div>
  )
}

