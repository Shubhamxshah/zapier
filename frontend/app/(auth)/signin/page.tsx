'use client'

import GoogleSvg from '@/components/svg/google_svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { use, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';


const signinSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type SigninFormData = z.infer<typeof signinSchema>;

const Signin = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema)
    });

    const onSubmit = (data: SigninFormData) => {
        console.log('Form submitted:', data);
        // Handle form submission here
        axios.post(`${BACKEND_URL}/api/v1/user/signin`, data)
            .then(response => {
                console.log('Signin successful:', response.data);
                // Redirect or perform any other actions upon successful signin
                router.push('/dashboard');
            })
            .catch(error => {
                console.error('Error during signin:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Button type="button" className="flex w-[calc(100%-2rem)] m-4 p-4 bg-blue-400 h-16 items-center justify-between relative"> <span className='bg-white flex rounded p-2 my-4 mx-2 items-center justify-center'><GoogleSvg /> </span> <span className='text-center text-xl absolute left-1/2 transform -translate-x-1/2'> Sign up with Google </span></Button>
            <div className="flex items-center px-2 my-4 ">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className='mx-4 mb-8'>* indicates a required field. </div>
            <div className="font-bold mx-4 mb-2"> * Work Email </div>
            <Input
                {...register('email')}
                className={`w-[calc(100%-2rem)] mx-4 p-4 h-12 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your work email"
                type="email"
            />
            {errors.email && (
                <div className="text-red-500 text-sm mx-4 mt-1">{errors.email.message}</div>
            )}
            <div className="font-bold mx-4 mt-4 mb-2"> * Password </div>
            <Input
                {...register('password')}
                className={`w-[calc(100%-2rem)] mx-4 p-4 h-12 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Create a password"
                type="password"
            />
            {errors.password && (
                <div className="text-red-500 text-sm mx-4 mt-1">{errors.password.message}</div>
            )}
            <div className="text-sm text-gray-500 mx-4 mt-2">By signing in, you agree to our Terms of Service and Privacy Policy. </div>
            <Button type="submit" className="w-[calc(100%-2rem)] m-4 mt-8 p-4 bg-orange-500 text-white h-12 text-lg"> Get Started </Button>
            <div className="flex items-center justify-center mb-4"> Dont have an account? <Link href="/signup" className='underline text-blue-400 px-2 '> Sign Up</Link></div>
        </form>
    )
}

export default Signin
