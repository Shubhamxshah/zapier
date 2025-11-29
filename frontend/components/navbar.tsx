import React from 'react'
import { Logo } from './logo'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-2 bg-zapier-header border-b border-gray-200">
        <div className='flex ml-16 items-center'>
            <Logo />
            <span className="ml-8 p-2 text-lg antialiased hover:bg-slate-100 ">Products</span>
            <span className="ml-8 p-2 text-lg antialiased hover:bg-slate-100">Solutions</span>
            <span className="ml-8 p-2 text-lg antialiased hover:bg-slate-100">Resources</span>
            <span className="ml-8 p-2 text-lg antialiased hover:bg-slate-100">Enterprise</span>
            <span className="ml-8 p-2 text-lg antialiased hover:bg-slate-100">Pricing</span>
        </div>
      <div className='flex items-center'>
        <p className="text-lg ml-8 p-2 hover:bg-slate-100">Explore Apps</p>
        <p className="text-lg ml-4 p-2 hover:bg-slate-100">Contact Sales</p>
        <p className="text-lg ml-4 p-2 hover:bg-slate-100">Log in</p>
        <Button className="text-lg ml-4 mr-16 bg-orange-600 rounded-4xl">Sign up</Button>
      </div>
    </div>
  )
}

export default Navbar
