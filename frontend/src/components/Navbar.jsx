import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
          <div className="flex items-center justify-between">
              <Link to="/" className="text-3xl font-bold text-primary font-mono tracking-tight">StockMounts</Link>
                <div className="flex items-center gap-4">
                  <Link to="/create" className="btn btn-primary">
                    + New Note
                  </Link>
              </div>
          </div>
      </div>
    </header>
  )
}

export default Navbar