import React from 'react'
import { Link } from 'react-router-dom'

export default function LinkNavbar({url, name, style = ''}) {
  return (
    <Link to={url} className={`text-white hover:text-indigo-500 ${style}`}>{name}</Link>
  )
}
