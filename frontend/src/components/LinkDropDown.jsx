import React from 'react'
import { Link } from 'react-router-dom'

export default function LinkDropDown({url, name}) {
  return (
    <Link to={url} className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>{name}</Link>
  )
}
