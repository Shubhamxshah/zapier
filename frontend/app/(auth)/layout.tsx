import Tick from "@/components/svg/tick"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center h-200 mx-56">
            <div className="w-1/2">
                <span className="font-bold font-mono text-3xl">
                    AI Automation starts and < br /> scales with Zapier.
                </span> <br />
                <div className="mt-8 text-lg">Orchestrate AI across your teams, tools, and processes. Turn ideas <br /> into automated action today, and power tomorrow’s business growth.
                </div>
                <div className="mt-8 text-lg">
                    <div className="flex items-center"> <Tick /> <span className="mx-4">Integrate 8,000+ apps and 300+ AI tools without code </span> </div>
                    <div className="flex items-center"> <Tick />
                        <span className="mx-4">Build AI-powered workflows in minutes, not weeks </span></div>
                    <div className="flex items-center"> <Tick /> <span className="mx-4">14-day trial of all premium features and apps </span></div>
                </div>
            </div>
            <div className="w-1/2">
                <div className="h-140 mx-20 border-2 border-gray-300 rounded-lg shadow-lg flex-col items-center justify-center">                    
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;
