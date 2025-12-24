import React, { useEffect, useState } from "react";


import Counter from "./Components/Counter";


import { motion } from "framer-motion";
import { Line as ChartLine } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,Filler} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


const Line = function Line(
  {label = "Placeholder", config} 
  ) {


  return(
    <div className="flex w-full bg-slate-300 h-8">

      {/* Name */}
      <div className="flex-[2] flex  h-full text-3xl justify-center items-center">
          {label}
      </div>

      {/* Value */}
      <div className="flex-[1] h-full flex items-center justify-end">
        <Counter
          value={300}
          places={[100, 10, 1]}
          fontSize={40}
          padding={0}
          gap={0}
          textColor="black"
          fontWeight={"normal"}
        />
      </div>

      {/* Unit */}
      <div className="flex-[1] h-full text-3xl  pl-5 flex items-center justify-start">
        {"C"}
      </div>
    </div>
  );
};

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:4000";

const variableConfigs = [
  { id: "T1", label: "Temperature", unit: "°C" },
  { id: "T2", label: "Force", unit: "N" },
  { id: "T3", label: "Speed", unit: "m/s" },
];

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

  const c1 = "bg-green-500";
  const c2 = "bg-gray-200";


  return (
    <div className="w-full h-screen bg-slate-300">

    {/* Top Bar */}
    <div className={`w-full h-32 ${c1} flex justify-center items-center`}>

      <div className="w-full h-full flex-[1] flex justify-center items-center ">

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

        <div className={`w-1/5   h-full ml-auto bg-gray-800 flex items-center justify-center text-white text-3xl`}>
          {new Date().toLocaleDateString()}
        </div>
    </div>

    {/* Info Tab*/}
    <div className={`w-full h-16 ${c1} flex items-center mb-12 border-black border-4`}>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> Proje Adı </div>
          <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-3xl border-l-4 border-black`}> Perleus </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-4 border-black`}> Proje No </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-4 border-black`}> 123123 </div>
    </div>

    <div className={`w-full h-16 ${c1} flex items-center mb-12 border-black border-4 `}>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> Kullanıcı Adı </div>
          <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-3xl border-l-4 border-black`}> admin </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-4 border-black`}> Cihaz No </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-4 border-black`}> 123123 </div>
    </div>

    {/* Kullanıcı set tab */}
    <div className={`w-full h-16 ${c1} flex items-center justify-center text-black text-3xl border-4 border-black`}> Kullanıcı Set Bilgileri </div>

    {/* Kullanıcı set */}
    <div className={`w-full h-[480px] ${c2} flex items-center justify-center text-black text-3xl border-4 border-t-0 border-black`}>
      
      {/* Left */}
      <div className={`w-full h-full ${c2} flex-[2] flex flex-col items-center justify-evenly text-black text-3xl `}>
        
        <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
          <div className={`w-full h-20 bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
            Cihaz Durumu
          </div>
          <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Kapalı
          </div>         
        </div>


        <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
          <div className={`w-full h-20 bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
            Sistem Durumu
          </div>
          <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Kapalı
          </div>         
        </div>


        <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
          <div className={`w-full h-20 bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
            Filtre Durumu
          </div>
          <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Kapalı
          </div>         
        </div>

        <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
          <div className={`w-full h-20 bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
            Genel Alarm
          </div>
          <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Kapalı
          </div>         
        </div>

      </div>
      
      {/* Middle */}
      <div className={`w-full h-full ${c1} flex-[1] flex-col items-center justify-center text-black text-3xl`}>
        
      </div>



      {/* Right */}
      <div className={`w-full h-full ${c2} flex-[2] flex flex-col items-center justify-evenly text-black text-3xl `}>

        {/* Right  Top*/}
        <div className={`w-full h-full bg-amber-500 flex-[2] flex flex-col items-center justify-evenly   text-black text-3xl `}>

          <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-20 bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
              Dönüş Sıcaklığı Set
            </div>
            <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              123
            </div>         
          </div>
          
          <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-20 bg-amber-100 flex-[4] flex items-center justify-center text-black text-3xl `}>
              Vantilatör EC Fan Set
            </div>
            <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              80%
            </div>       
            <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              80%
            </div>       
          </div>

          <div className={`w-full h-20 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-20 bg-amber-100 flex-[4] flex items-center justify-center text-black text-3xl `}>
              Genel Alarm
            </div>
            <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              80%
            </div>       
            <div className={`w-full h-20 bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              80%
            </div>       
          </div>

        </div>


        {/* Right  Bottom*/}
        <div className={`w-full h-full bg-amber-200 flex-[1] flex flex-col items-center justify-center text-black text-3xl `}>
          
          <div className={`w-full h-full bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-full bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
              Üfleme Üst Limit
            </div>
            <div className={`w-full h-full bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              Kapalı
            </div>         
          </div>
          
          <div className={`w-full h-full bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-full bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
              Üfleme Alt Limit
            </div>
            <div className={`w-full h-full bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              Kapalı
            </div>         
          </div>
          
          <div className={`w-full h-full bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-full bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
              Üfleme Üst Limit Set
            </div>
            <div className={`w-full h-full bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              123
            </div>         
          </div>

          <div className={`w-full h-full bg-amber-500 flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-full bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
              Üfleme Alt Limit Set
            </div>
            <div className={`w-full h-full bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
              123
            </div>         
          </div>

        </div>

      </div>

    </div>

    {/* Blank tab */}
    <div className={`w-full h-12 ${c1} flex items-center justify-center text-black text-3xl border-4 border-t-0 border-black`}>
    </div>

    {/* Kullanıcı set bottom */}
    <div className={`w-full h-24 ${c2} flex items-center justify-center text-black text-3xl border-4 border-t-0 border-black`}>

      <div className={`w-full h-full bg-amber-500 flex flex-col items-center justify-center text-black text-3xl `}>
        <div className={`w-full h-full bg-amber-500 flex items-center justify-center text-black text-3xl `}>
          <div className={`w-full h-full bg-amber-100 flex-[4] flex items-center justify-center text-black text-3xl `}>
            Mod Durumu
          </div>
          <div className={`w-full h-full bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Isıtma
          </div>       
          <div className={`w-full h-full bg-amber-300 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Kapalı
          </div>       
          <div className={`w-full h-full bg-amber-400 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Soğutma
          </div>       
          <div className={`w-full h-full bg-amber-500 flex-[1] flex items-center justify-center text-black text-3xl `}>
            Kapalı
          </div>  
        </div>

        <div className={`w-full h-full bg-amber-500 flex items-center justify-center text-black text-3xl `}>
          <div className={`w-full h-full bg-amber-100 flex-[2] flex items-center justify-center text-black text-3xl `}>
            Mod Set
          </div>
          <div className={`w-full h-full bg-amber-200 flex-[1] flex items-center justify-center text-black text-3xl `}>
            123
          </div>       
          <div className={`w-full h-full bg-amber-300 flex-[1] flex items-center justify-center text-black text-3xl `}>
            123
          </div>       
        </div>
      </div>

    </div>

    {/* Sensör  tab*/}
    <div className={`w-full h-16 ${c1} flex items-center justify-center text-black text-3xl border-4 border-t-0 border-black`}>
        Sensör Bilgileri
    </div>
            
    {/* Sensör */}
    <div className={`w-full h-fit ${c1} flex flex-col items-center justify-center text-black text-3xl border-4 border-t-0 border-black`}>

      <div className={`w-full h-12 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
        <div className={`w-full h-full bg-amber-100 flex-[5] flex items-center justify-center text-black text-3xl `}>
          Sıcaklık Bilgisi
        </div>      
        <div className={`w-full h-full bg-amber-300 flex-[1] flex items-center justify-center text-black text-3xl `}>
          123
        </div>       
        <div className={`w-full h-full bg-amber-300 flex-[1] flex items-center justify-center text-black text-3xl `}>
          mm
        </div>  
      </div>

      <div className={`w-full h-12 bg-amber-500 flex items-center justify-center text-black text-3xl `}>
        <div className={`w-full h-full bg-amber-100 flex-[5] flex items-center justify-center text-black text-3xl `}>
          Sıcaklık Bilgisi
        </div>      
        <div className={`w-full h-full bg-amber-300 flex-[1] flex items-center justify-center text-black text-3xl `}>
          123
        </div>       
        <div className={`w-full h-full bg-amber-300 flex-[1] flex items-center justify-center text-black text-3xl `}>
          mm
        </div>  
      </div>

    </div>


  </div>
  );
}
