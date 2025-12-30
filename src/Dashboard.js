import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";


// Adress farese write balonu unit "O" ise On Off
const vars = {
  T1: { id: "T1", label: "Taze Hava Sıcaklık Bilgisi", unit: "°C" },
  T2: { id: "T2", label: "Dönüş Hava Sıcaklık Bilgisi", unit: "°C" },
  T3: { id: "T3", label: "Üfleme Hava Sıcaklık Bilgisi", unit: "°C" },

  G1: { id: "G1", label: "Cihaz Durumu", unit: "O" , addr: 16384 },
  G2: { id: "G2", label: "Sistem Durumu", unit: "O" },
  G3: { id: "G3", label: "Filtre Durumu", unit: "O" },
  G4: { id: "G4", label: "Genel Alarm", unit: "O" },
  G5: { id: "G5", label: "Dönüş Sıcaklık Set", unit: "°C", addr: 16387 },
  G6: { id: "G6", label: "Vantilatör EC Fan Set", unit: "%" , addr: 16484 },
  G7: { id: "G7", label: "Aspiratör EC Fan Set", unit: "%" , addr: 16483},
  G8: { id: "G8", label: "Üfleme Alt Limit Set", unit: "°C" },
  G9: { id: "G9", label: "Üfleme Alt Limit", unit: "°C" },
  G10: { id: "G10", label: "Üfleme Üst Limit Set", unit: "°C" },
  G11: { id: "G11", label: "Üfleme Üst Limit", unit: "°C" },

  D1: { id: "D1", label: "Vantilatör EC Fan Durumu", unit: "O" },
  D2: { id: "D2", label: "Aspiratör EC Fan Durumu", unit: "O" },
  D3: { id: "D3", label: "Taze Hava ve Egzoz Hava Damper Durumu", unit: "O" },
  D4: { id: "D4", label: "Bypass Damper Durumu", unit: "O" },
  D5: { id: "D5", label: "Mutfak Gaz Selenoid Valve Durumu", unit: "O",},
  D6: { id: "D6", label: "Sistem Çalışma Durumu", unit: "O" },
  D7: { id: "D7", label: "Genel Filtre Durumu", unit: "O" },
  D8: { id: "D8", label: "Genel Alarım Bilgisi", unit: "O" },
  D9: { id: "D9", label: "VRF Isıtma Modu", unit: "O" },
  D10: { id: "D10", label: "VRF Soğutma Modu", unit: "O" },
  D11: { id: "D11", label: "VRF Defrost Modu", unit: "O" },
  D12: { id: "D12", label: "VRF Alarm Modu", unit: "O" },

};

const But = function But(
  { isbool = true , result = 0,  addr = 0 , textsize = 'text-3xl' , handleWriteClick} 
  ) {

    const [hovered, setHovered] = useState(false);
    const [text, setText] = useState("");
    const [bubble, setBubble] = useState(false);

    const handleBubble = () => {

      if (isbool) {

        if (result === -1) return;
        let val = 1 - result;
        handleWriteClick(addr,val);

        return;
      }


      setBubble(!bubble);
    };

    const handleClick = () => {

      handleWriteClick(addr,parseInt(text, 10));
      return;

    };

    let display;
    let clr = "bg-gray-400";

    if (isbool)
    {
      if (result === -1) {
        display = "Undefined";
      }
      else if (result === 0) {
        display = "Kapalı";
        clr = "bg-red-500";
      }
      else if (result === 1) {
        display = "Açık";
        clr = "bg-green-500";
      }

    }
    else
    {
      display = result; 
    }




    return(
      <div className="h-fit w-fit relative">
        
      <div
        className={`
          absolute bottom-full left-1/2 -translate-x-1/2
          flex items-center gap-2
          bg-white border rounded-xl px-2 py-2 shadow-lg z-10
          transition-all duration-200 ease-out  
          ${addr && !isbool && bubble
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border px-3 py-2 rounded text-lg w-28"
          placeholder="Değer"
        />

        <button
          onClick={handleClick}
          className="bg-green-500 text-white px-2 py-1 rounded-lg text-xl"
        >
          OK
        </button>

      </div>
        
        
        <div className=" flex-[1] bg-blue-500">

        </div>

      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleBubble}
        className={`
          w-fit h-fit rounded-full
          flex items-center justify-center text-black 
          transition-transform duration-150
          ${textsize === 'text-3xl' ? "px-8 py-2" : "px-4 py-1" }
          ${addr && hovered ? "scale-125 active:scale-90 bg-amber-300 " : "scale-100 " + clr }
          ${addr ? "cursor-pointer " : "cursor-default " } 
        `  +  textsize }
      >

        {display}

      </button>
    
    
     </div>
    )

};


const Line = function Line(
  { config = { label: "Placeholder", unit: "V/V" , addr : 0 }, type = 0, history = [] , textsize = 'text-3xl' , handleWriteClick }
) {


  const sensorHistory = history[config.id] || [];
  const latestEntry = sensorHistory.at(-1);
  const latestValue = latestEntry ? latestEntry.val : -1;


    if (type === 3) {
    return (
      <div className={`w-full h-16  flex items-center justify-center`}>
        <div className={`w-full h-full  flex-[6] flex items-center justify-center text-black text-3xl `}>
          {config.label}
        </div>      
        <div className={`w-full h-full  flex-[2] flex items-center justify-center text-black text-3xl `}>
          <But isbool = {config.unit === "O"}  result = {latestValue} addr = {config.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />
        </div>      
      </div>

    );
  }

  if (type === 2) {
    return (
      <div className={`w-full h-8  flex items-center justify-cente `}>
        <div className={`w-full h-full slate-100 flex-[4] flex items-center justify-center text-black text-3xl `}>
          {config.label}
        </div>
        <div className={`w-full h-full flex-[1] flex items-center justify-center `}>
            <But isbool = {config.unit === "O"}  result = {latestValue} addr = {config.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />
        </div>       
        <div className={`w-full h-full bg-slate-100 flex-[1] flex items-center justify-center text-black text-3xl `}>
          80%
        </div>       
      </div>
    );
  }

  if (type === 1) {
    return (
      <div className={`w-full h-12  flex items-center justify-center`}>
        <div className={`w-full h-full  flex-[6] flex items-center justify-center text-black text-3xl `}>
          {config.label}
        </div>      
        <div className={`w-full h-full  flex-[1] flex items-center justify-end pr-10 text-black text-3xl `}>
          {latestValue}
        </div>      
        <div className={`w-full h-full  flex-[1] flex items-center justify-start text-black text-3xl `}>
          {config.unit}
        </div>  
      </div>

    );
  }

return(
  <div className={`w-full h-[50px] flex items-center justify-center `}>
    <div className={`w-full h-full flex-[2] flex items-center justify-center text-black ` + textsize}>
      {config.label}
    </div>
    <div className={`w-full h-ful flex-[1] flex items-center justify-center `}>

      <But isbool = {config.unit === "O"}  result = {latestValue} addr = {config.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />

    </div>         
  </div>
  );
 
};



const API_BASE =   "https://api.akscon.com" ||     // FIX IT FIX IT
  process.env.REACT_APP_API_BASE ||
  "http://localhost:4000";

  

const historyLen = 15;

const statusColors = {
  Connected: { dot: "#4ade80", shadow: "rgba(74, 222, 128, 0.5)", text: "Connected" },
  Connecting: { dot: "#facc15", shadow: "rgba(250, 204, 21, 0.5)", text: "Connecting" },
  Error: { dot: "#f87171", shadow: "rgba(248, 113, 113, 0.5)", text: "Connection Error" }
};


export default function Dashboard() {

  const initialHistory = Object.keys(vars).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  const [history, setHistory] = useState(initialHistory);

  const [status, setStatus] = useState("Connection not started");
  const [topics, setTopics] = useState("tmsig-1/data");
  const [topicFile, setTopicFile] = useState("tmsig-1");
  const [eventSource, setEventSource] = useState(null);


  const [writePreview, setWritePreview] = useState("");
  const [writeStatus, setWriteStatus] = useState("");

  const [flashBlue, setFlashBlue] = useState(false);
  

  useEffect(() => {
    if (eventSource) eventSource.close();

    setStatus("Connecting");

    const url = `${API_BASE}/stream?topics=${encodeURIComponent(topics)}`;
    const es = new EventSource(url);

    es.onopen = () => setStatus("Connected");
    es.onerror = () => setStatus("Error");

    es.onmessage = (event) => {

      setFlashBlue(true);
      setTimeout(() => {
        setFlashBlue(false);
      }, 500);


      const msg = JSON.parse(event.data);
      const json = msg.data;
      const ts = msg.timestamp;

      if (!json || typeof json !== "object") return;


      setHistory(prev => {
        const next = { ...prev };
        
        Object.keys(json).forEach(key => {
          const currentHistory = next[key] || [];
          
          const newDataPoint = {
            ts: ts,
            val: Number(json[key])
          };

          next[key] = [...currentHistory, newDataPoint].slice(-historyLen);
        });
        
        return next;
      });

            
    };


    setEventSource(es);
    return () => es.close();
 
  }, [topics]);


  const handleWriteClick = async (addr,val) => {

    setWriteStatus("Sending…");
    
    try {
      const res = await fetch(`${API_BASE}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: String(addr).trim(),
          value: String(val).trim(),
          topic: topicFile,
        }),
      });
      const json = await res.json();



      if (!res.ok) {
        setWriteStatus("❌ Server rejected write");
        console.log("Write Fail " + json.error);
        return;
      }
      setWritePreview(json.content);
      setWriteStatus("✅ Written to test.txt");
      console.log("Write Done " + json.file + " " + json.content);

    } catch {
      setWriteStatus("❌ Network error");
    }
  };


  const c1 = "bg-[#3CCE58]";
  const c2 = "bg-slate-100";

  const dotColor = flashBlue
  ? "#3b82f6" // blue-500
  : statusColors[status]?.dot || "#94a3b8";

const shadowColor = flashBlue
  ? "rgba(59,130,246,0.8)"
  : statusColors[status]?.shadow || "rgba(0,0,0,0)";

  return (
    <div className={`w-full h-screen ${c2}`}>
      
    {/* Top Bar */}
    <div
      className={`w-full h-32 bg-gradient-to-r from-green-300 via-[#3CCE58] to-green-300 flex justify-center items-center`}
    >

      <div className={`w-full h-full  flex-[1] flex justify-center items-center `}>

      </div>

      <div className="w-full h-full flex-[3] flex justify-center items-center text-5xl text-center">
        AKSCON OTOMASYON KONTROL SİSTEMLERİ
      </div>   

      <div className="w-full h-full flex-[1] flex justify-center items-center">
        {/* Outer Pulsing Glow */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.3, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 rounded-full blur-xl"
          style={{
            backgroundColor: dotColor,
          }}
        />

        {/* Inner Solid Bubble */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-20 h-20 rounded-full shadow-2xl border-4 border-white/40"
          style={{
            backgroundColor: dotColor,
            boxShadow: `0 0 40px ${shadowColor}`,
          }}
        />
      </div>

    </div>

    {/* Language & Date */}
    <div className={`w-full h-12 ${c2} flex items-center`}>
        <button className="w-20 h-full  bg-red-300"></button>
        <button className="w-20 h-full  bg-blue-300"></button>
        <button className="w-20 h-full  bg-yellow-300"></button>

        <div className={`w-1/5   h-full ml-auto  flex items-center justify-center text-black text-3xl`}>
          {new Date().toLocaleDateString()}
        </div>
    </div>

    {/* Info Tab*/}
    <div className={`w-full h-12 ${c1} flex items-center mb-8 border-black border-2`}>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> Proje Adı </div>
          <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Perleus </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Proje No </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> 123123 </div>
    </div>

    <div className={`w-full h-12 ${c1} flex items-center mb-8 border-black border-2 `}>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> Kullanıcı Adı </div>
          <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> admin </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Cihaz No </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> 123123 </div>
    </div>

    {/* Kullanıcı set tab */}
    <div className={`w-full h-16 ${c1} flex items-center justify-center text-black text-3xl border-2 border-black`}> KULLANICI SET BİLGİLERİ </div>

    {/* Kullanıcı set */}
    <div className={`w-full h-[300px] ${c2} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
      
      {/* Left */}
      <div className={`w-full h-full ${c2} flex-[2] flex flex-col items-center justify-evenly text-black text-3xl `}>
        
        <Line config={vars.G1} history={history} handleWriteClick={handleWriteClick}/>
        <Line config={vars.G2} history={history}/>
        <Line config={vars.G3} history={history}/>
        <Line config={vars.G4} history={history}/>

      </div>
      
      {/* Middle */}
      <div className={`w-full h-full ${c1} flex-[1] flex flex-col items-center justify-center text-black text-3xl`}>
        
        <div  className={`w-full h-full bg-slate-100 flex-[1] border-black border-l-2 border-r-2  flex flex-col items-center justify-center text-black text-3xl `}>

          <Line config={vars.G5} history={history} handleWriteClick={handleWriteClick}/>

        </div>

      <div className={`w-full h-full bg-slate-100 flex-[1] border-t-2 border-black border-l-2 border-r-2 flex flex-col items-center justify-center text-black text-3xl`}>

          <div className={`w-full h-8 bg-slate-100 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-full bg-slate-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
              Alarm Reset
            </div>   
          </div>

        </div>

          
      </div>



      {/* Right */}
      <div className={`w-full h-full ${c2} bg-blue-600 flex-[2] flex flex-col items-center justify-evenly`}>

        {/* Right  Top*/}
        <div className={`w-full h-full bg-slate-100 flex-[1] flex flex-col items-center justify-evenly`}>
    
          <Line config={vars.G6} history={history} type = {2} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G7} history={history} type = {2} textsize="text-2xl" handleWriteClick={handleWriteClick}/>


        </div>

        {/* Right  Bottom*/}
        <div className={`w-full h-full bg-slate-100 flex-[2] flex flex-col items-center justify-evenly text-black text-3xl `}>
          
          <Line config={vars.G8} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G9} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G10} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G11} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>

        </div>

      </div>

    </div>

    {/* Blank tab */}
    <div className={`w-full h-24 ${c2} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>

      <div className={`w-16 h-16 ${c1} flex items-center justify-center `}>

      </div>

    </div>

    {/* Sensör  tab*/}
    <div className={`w-full h-16 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
        Sensör Bilgileri
    </div>
            
    {/* Sensör */}
    <div className={`w-full h-fit ${c2} flex flex-col items-center justify-center text-black text-3xl gap-2 border-2 border-t-0 border-black`}>


       <Line config = {vars.T1} history={history}  type={1} />
       <Line config = {vars.T2} history={history}  type={1} />
       <Line config = {vars.T3} history={history}  type={1} />

    </div>

    
    {/* Durum  tab*/}
    <div className={`w-full h-16 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
        Sensör Bilgileri
    </div>
            
    {/* Durum */}
    <div className={`w-full h-fit ${c2} flex flex-col items-center justify-center text-black text-3xl gap-2  border-2 border-t-0 border-black`}>

      {Array.from({ length: 12 }, (_, i) => {
        const key = `D${i + 1}`;
        return (
          <Line
            key={key}
            config={vars[key]}
            history={history}
            type={3}
          />
        );
      })}

    </div>
    
    {/* Arıza tab*/}
    <div className={`w-full h-16 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
        Arıza Bilgileri
    </div>

  </div>
  );


  
}
