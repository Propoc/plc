

export default function Project( { setPage , user , visibleProjects, setSelectedProject , onLogout} ) {

    const c1 = "bg-[#60B649]";
    const c2 = "bg-gray-300";


    return (
        <div className={`w-full h-screen ${c2}`}>
        
            {/* Top Bar */}
            <div
            className={`w-full h-32 ${c1} flex justify-center items-center border-2 border-black`}
            >

                <div className={`w-full h-full  flex-[1] flex justify-center items-center `}>
                   <img
                        src="/sch.png"
                        alt="sch"
                        className="w-full h-full object-contain "
                    />
                </div>

                <div className={`w-full h-full  flex-[3] flex justify-center items-center text-5xl `}>
                    CİHAZ LİSTESİ
                </div>

                <div className="w-full h-full flex-[1] flex justify-center items-center text-5xl text-center">
                   <img
                        src="/enter.png"
                        alt="exit"
                        className="w-full h-full object-contain "
                        onClick={onLogout}
                    />
                </div>  

            </div>

            {/* Language & Date */}
            <div className={`w-full h-12 ${c2} flex items-center border-l-2 border-r-2 border-black`}>
                <button className="w-20 h-10"> <img src="/tr.png"alt="sun" className="w-full h-full object-contain"/> </button>
                <button className="w-20 h-10"> <img src="/en.png"alt="sun" className="w-full h-full object-contain"/> </button>
                <button className="w-20 h-10"> <img src="/ger.png"alt="sun" className="w-full h-full object-contain"/> </button>

                <div className={`w-1/5   h-full ml-auto  flex items-center justify-center text-black text-3xl`}>
                {new Date().toLocaleDateString()}
                </div>
            </div>

            <div
                className={`w-full h-12 ${c2} flex items-center mb-8 border-black border-4  text-black text-4xl`}
            >
                <div className={`h-full flex-[1] flex items-center justify-center `}>
                Proje Adı
                </div>
                <div className={`h-full flex-[1] flex items-center justify-center border-l-4 border-black`}>
                Proje No
                </div>
                <div className={`h-full flex-[1] flex items-center justify-center border-l-4 border-black`}>
                Cihaz No
                </div>
                <div className={`h-full flex-[1] flex items-center justify-center border-l-4 border-black`}>
                Ahu No
                </div>
                <div className={`h-full flex-[1] flex items-center justify-center border-l-4 border-black`}>
                Cihaz Adı
                </div>
            </div>


            {/* Projeler*/}
            {visibleProjects.map((p, idx) => (
            <div
                key={idx}
                className={`w-full h-12 ${c2} flex items-center mb-4 border-black border-2 cursor-pointer`}
                onClick={() => {
                    setSelectedProject(p);
                    setPage("dashboard");
                }}
            >
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}>
                {p.name}
                </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}>
                {p.projectNo}
                </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}>
                {p.deviceNo}
                </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}>
                {p.ahuNo}
                </div>
                <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}>
                {p.topic}
                </div>
            </div>
            ))}
                        

        </div> 

    );


  
}
