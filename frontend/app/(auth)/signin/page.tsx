import GoogleSvg from '@/components/svg/google_svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import Link from 'next/link'

const Signin = () => {
    return (
        <>
            <Button className="flex w-[calc(100%-2rem)] m-4 p-4 bg-blue-400 h-16 items-center justify-between relative"> <span className='bg-white flex rounded p-2 my-4 mx-2 items-center justify-center'><GoogleSvg /> </span> <span className='text-center text-xl absolute left-1/2 transform -translate-x-1/2'> Sign in with Google </span></Button>
            <div className="flex items-center px-2 my-4 ">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className='mx-4 mb-8'>* indicates a required field. </div>
            <div className="font-bold mx-4 mb-2"> * Work Email </div>
            <Input className="w-[calc(100%-2rem)] mx-4 p-4 h-12" placeholder="Enter your work email" />
            <div className="font-bold mx-4 mt-4 mb-2"> * Password </div>
            <Input type="password" className="w-[calc(100%-2rem)] mx-4 p-4 h-12" placeholder="Create a password" />
            <div className="text-sm text-gray-500 mx-4 mt-2">By signing up, you agree to our Terms of Service and Privacy Policy. </div>
            <Button className="w-[calc(100%-2rem)] m-4 mt-8 p-4 bg-orange-500 text-white h-12 text-xl"> Log In </Button>
            <div className="flex items-center justify-center mb-4"> Dont have an account? <Link href="/signup" className='underline text-blue-400 px-2 '> Sign Up</Link></div>
        </>
    )
}

export default Signin
