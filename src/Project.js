

export default function Project( { setPage } ) {

    const c1 = "bg-[#60B649]";
    const c2 = "bg-gray-200";


    return (
        <div className={`w-full h-screen ${c2}`}>
        
            {/* Top Bar */}
            <div
            className={`w-full h-32 ${c1} flex justify-center items-center`}
            >

                <div className={`w-full h-full  flex-[1] flex justify-center items-center `}>
                    <img
                    src="/per.png"
                    alt="sun"
                    className="w-full h-full object-contain "
                    />
                </div>

                <div className={`w-full h-full  flex-[3] flex justify-center items-center text-5xl `}>
                    PERLUS
                </div>

                <div className="w-full h-full flex-[1] flex justify-center items-center text-5xl text-center">
                    <img
                    src="/sch.png"
                    alt="sun"
                    className="w-full h-full object-contain "
                    />
                </div>  



            </div>

            {/* Language & Date */}
            <div className={`w-full h-12 ${c2} flex items-center`}>
                <button className="w-20 h-full"> <img src="/tr.png"alt="sun" className="w-full h-full object-contain"/> </button>
                <button className="w-20 h-full"> <img src="/en.png"alt="sun" className="w-full h-full object-contain"/> </button>
                <button className="w-20 h-full"> <img src="/ger.png"alt="sun" className="w-full h-full object-contain"/> </button>

                <div className={`w-1/5   h-full ml-auto  flex items-center justify-center text-black text-3xl`}>
                {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Info Tab*/}
            <div className={`w-full h-12 ${c1} flex items-center mb-8 border-black border-2`}>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> Proje Adı </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Proje No </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Cihaz No </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> AHU No </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Mac Adresi </div>
            </div>

            <div className={`w-full h-12 ${c2} flex items-center mb-4 border-black border-2  cursor-pointer`}
                 onClick={() => setPage("dashboard")}
            >
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> perlus-nike-1 </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> MEA-2026-01-010 </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> AERO-2600038 </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> AHU-1 </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> 00:00:00:00 </div>
            </div>
            

        </div> 

    );


  
}
