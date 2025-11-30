import Image from 'next/image'
import { Button } from './ui/button'
import GoogleSvg from './svg/google_svg'

const HeroComponent = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-16 lg:py-24">
                <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-8">
                    <div className="text-lg">SCALE AI AGENTS WITH ZAPIER</div>
                    <h1 className="font-dmserif text-4xl sm:text-5xl lg:text-6xl mt-4 leading-tight">
                        <span className="whitespace-nowrap">The Most Connected AI</span><br/>
                        <span className="whitespace-nowrap">Orchestration platform</span>
                    </h1>

                    <div className="text-lg sm:text-xl mt-8">Build and ship AI workflows in minutes—no IT </div>
                    <div className="text-lg sm:text-xl mb-8">bottlenecks, no complexity. Just results.</div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button className='bg-orange-500 text-white' size={'xl'}>Start free with Email</Button>
                        <Button className='bg-background text-black border-2 border-black' size="xl"> <GoogleSvg />Start free with Google</Button>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                    <Image
                        src="https://res.cloudinary.com/zapier-media/image/upload/f_auto/q_auto/v1745602193/Homepage/hero-illo_orange_ilrzpu.png"
                        alt="Description"
                        width={600}
                        height={400}
                        className="w-full max-w-md h-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default HeroComponent
