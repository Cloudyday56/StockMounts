import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-base-300 border-t border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
          <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  &copy; {new Date().getFullYear()} StockMounts. All rights reserved.
              </div>
          </div>
      </div>
    </footer>
  )
}

export default Footer