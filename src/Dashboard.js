import React, { useEffect, useState } from "react";


import Counter from "./Components/Counter";


import { motion } from "framer-motion";
import { Line as ChartLine } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,Filler} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


const vars = {
  T1: { id: "T1", label: "Taze Hava Sıcaklık Bilgisi", unit: "°C" },
  T2: { id: "T2", label: "Dönüş Hava SIcaklık Bilgisi", unit: "°C" },
  T3: { id: "T3", label: "Üfleme Hava Sıcaklık Bilgisi", unit: "°C" },

  G1: { id: "G1", label: "Cihaz Durmu", unit: "O" },
  G2: { id: "G2", label: "Sistem Durumu", unit: "O" },
  G3: { id: "G3", label: "Filtre Durumu", unit: "O" },
  G4: { id: "G4", label: "Genel Alarm", unit: "O" },
  G5: { id: "G5", label: "Dönüş Sıcaklık Set", unit: "°C" },
  G6: { id: "G6", label: "Vantilatör EC Fan Set", unit: "%" },
  G7: { id: "G7", label: "Aspiratör EC Fan Set", unit: "%" },
  G8: { id: "G8", label: "Üfleme Üst Limit", unit: "O" },
  G9: { id: "G9", label: "Üfleme Alt Limit", unit: "O" },
  G10: { id: "G10", label: "Üfleme Üst Limit Set", unit: "°C" },
  G11: { id: "G11", label: "Üfleme Üst Limit Set", unit: "°C" },

};


const Line = function Line(
  {config = { label: "Placeholder" , unit:"V/V"} , type = 0 , history = []} 
  ) {

  let result = "0";

  if (config.unit == "O"){
    result = "Kapalı"
  }
  if (config.unit == "%"){
    result = "0%"
  }

  const sensorHistory = history[config.id] || [];
  
  const latestEntry = sensorHistory.at(-1); 
  const latestValue = latestEntry ? latestEntry.val : 0;


  if (type === 3) {
    return (
      <div className={`w-full h-8 flex items-center justify-center `}>
        <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-2xl `}>
          {config.label}
        </div>
        <div className={`w-full h-ful flex-[1] flex items-center justify-center `}>
          <button className= {`w-fit h-fit bg-gray-400 rounded-full px-8 flex items-center justify-center text-black text-2xl `} >  {result} </button> 
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
          <button className= {`w-fit h-fit bg-gray-400 rounded-full px-8 p flex items-center justify-center text-black text-3xl `} >  {result} </button> 
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
          <Counter
            value={latestValue}
            places={[100, 10, 1]}
            fontSize={40}
            padding={0}
            gap={0}
            textColor="black"
            fontWeight={"normal"}
          />
        </div>      
        <div className={`w-full h-full  flex-[1] flex items-center justify-start text-black text-3xl `}>
          {config.unit}
        </div>  
      </div>

    );
  }


  return(
      <div className={`w-full h-[40px] flex items-center justify-center `}>
        <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-3xl `}>
          {config.label}
        </div>
        <div className={`w-full h-ful flex-[1] flex items-center justify-center `}>
          <button className= {`w-fit h-fit bg-gray-400 rounded-full px-8 py-2 flex items-center justify-center text-black text-3xl `} >  {result} </button> 
        </div>         
      </div>
  );
};

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:4000";


const historyLen = 15;

const statusColors = {
  Connected: { dot: "#4ade80", shadow: "rgba(74, 222, 128, 0.5)", text: "Connected" },
  Connecting: { dot: "#facc15", shadow: "rgba(250, 204, 21, 0.5)", text: "Connecting" },
  Error: { dot: "#f87171", shadow: "rgba(248, 113, 113, 0.5)", text: "Connection Error" }
};


export default function Dashboard() {
  const [history, setHistory] = useState({ T1: [], T2: [], T3: [] });
  const [status, setStatus] = useState("Connection not started");


  const [topics, setTopics] = useState("tmsig-1/data");
  const [eventSource, setEventSource] = useState(null);



  useEffect(() => {
    if (eventSource) eventSource.close();

    setStatus("Connecting");

    const url = `${API_BASE}/stream?topics=${encodeURIComponent(topics)}`;
    const es = new EventSource(url);

    es.onopen = () => setStatus("Connected");
    es.onerror = () => setStatus("Error");

    es.onmessage = (event) => {

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
          console.log(`✅ ${key} updated. Points:`, next[key].length);
        });
        
        return next;
      });
    };

    setEventSource(es);
    return () => es.close();
 
  }, [topics]);

  const c1 = "bg-[#3CCE58]";
  const c2 = "bg-slate-100";


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

      <div className="w-full h-full flex-[1] flex justify-center items-center ">
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
              backgroundColor: statusColors[status]?.dot || "#94a3b8",
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
              backgroundColor: statusColors[status]?.dot || "#94a3b8",
              boxShadow: `0 0 40px ${statusColors[status]?.shadow || "rgba(0,0,0,0)"}`,
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
        
        <Line config={vars.G1}/>
        <Line config={vars.G2}/>
        <Line config={vars.G3}/>
        <Line config={vars.G4}/>

      </div>
      
      {/* Middle */}
      <div className={`w-full h-full ${c1} flex-[1] flex flex-col items-center justify-center text-black text-3xl`}>
        
        <div  className={`w-full h-full bg-slate-100 flex-[1] border-black border-l-2 border-r-2  flex flex-col items-center justify-center text-black text-3xl `}>

          <Line config={vars.G5}/>

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
    
          <Line config={vars.G6} type = {2} />
          <Line config={vars.G7} type = {2} />


        </div>

        {/* Right  Bottom*/}
        <div className={`w-full h-full bg-slate-100 flex-[2] flex flex-col items-center justify-evenly text-black text-3xl `}>
          
          <Line config={vars.G8} type = {3}/>
          <Line config={vars.G9} type = {3}/>
          <Line config={vars.G10} type = {3}/>
          <Line config={vars.G11} type = {3}/>

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
    <div className={`w-full h-fit ${c2} flex flex-col items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>


       <Line unit={1} config = {vars.T1} type={1} history={history}/>
       <Line unit={1} config = {vars.T2} type={1} history={history}/>
       <Line unit={1} config = {vars.T3} type={1} history={history}/>

    </div>


  </div>
  );
}
