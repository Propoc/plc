import React, { useEffect, useState } from "react";


import Counter from "./Components/Counter";
import SplashCursor from './Components/SplashCursor'
import Hyperspeed, { hyperspeedPresets } from './Components/HyperSpeed';
import Galaxy from './Components/Galaxy';
import FloatingLines from './Components/FloatingLines';
import Threads from './Components/Threads';
import TextType from './Components/TextType';

import { motion } from "framer-motion";
import { Line as ChartLine } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,Filler} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


const Line = function Line(
  {label = "Placeholder", value = 0 , unit = "V/V" , isOpen , onClick, historyData = [] , onClear} 
  ) {

  const chartData = {
      datasets: [
        {
          label: label,
          // Map 'ts' to 'x' and 'val' to 'y'
          data: historyData.map(d => ({ x: d.ts, y: d.val })),
          borderColor: 'rgb(79, 209, 197)',
          backgroundColor: 'rgba(79, 209, 197, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    const chartOptions = {
    responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          // Force the scale to match your data exactly
          min: historyData.length > 0 ? historyData[0].ts : undefined,
          max: historyData.length > 0 ? historyData[historyData.length - 1].ts : undefined,
          ticks: {
            color: '#64748b',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5,
            callback: function(val) {
              const date = new Date(val);
              return date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit', // Added seconds to see the movement better
                hour12: false 
              });
            }
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: false,
          ticks: { color: '#64748b' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              // Using the new 'x' mapping from above
              return new Date(items[0].raw.x).toLocaleTimeString();
            },
            label: (context) => ` Value: ${context.raw.y} ${unit}`
          }
        }
      }
    };

  return(
  <div className="relative w-full mb-4"> {/* Container for absolute positioning */}

    <button 
      onClick={onClick}
      className="
        w-full h-20 flex items-center justify-center 
        rounded-full
        bg-[linear-gradient(90deg,rgba(129,230,217,1)_0%,rgba(79,209,197,1)_100%)]
        shadow-[-2px_-2px_12px_rgba(79,209,197,0.6)]
      ">

      {/* Name */}
      <div className="flex-[2] flex  h-full text-3xl justify-center items-center">
          {label}
      </div>

      {/* Value */}
      <div className="flex-[1] h-full flex items-center justify-end">
        <Counter
          value={value}
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
        {unit}
      </div>

    </button>
    {/* The Chat Bubble (Popover) */}
      {isOpen && (
        <div className="absolute left-[105%] top-[-80px] w-[450px] h-[320px] p-6 z-50 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-700">
          
          {/* Clear History Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevents closing the bubble
              onClear();
            }}
            className="absolute top-4 right-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider 
                      text-slate-400 border border-slate-700 rounded-lg hover:bg-red-500/10 
                      hover:text-red-400 hover:border-red-500/50 transition-all"
          >
            Clear History
          </button>

          {/* The Border Triangle  */}
          <div 
            className="absolute left-[-22px] top-[94px] w-0 h-0 
              border-t-[22px] border-t-transparent 
              border-r-[22px] border-r-slate-700 
              border-b-[22px] border-b-transparent"
          />

          {/* The Fill Triangle  */}
          <div 
            className="absolute left-[-20px] top-[96px] w-0 h-0 
              border-t-[20px] border-t-transparent 
              border-r-[20px] border-r-[#0f172a] 
              border-b-[20px] border-b-transparent"
          />
          
          <h3 className="text-white font-bold mb-4">{label} Historical Data</h3>
          <div className="h-52 w-full">
            <ChartLine data={chartData} options={chartOptions} />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">Dots show irregular arrival times</p>
        </div>
      )}

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

  const [activeBubble, setActiveBubble] = useState(null);


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



  return (
    <div className="w-full h-screen bg-[#060010]">

      {/*
      <SplashCursor/>
      <div className="absolute inset-0 z-0">
          <Hyperspeed  effectOptions={hyperspeedPresets.three} />
      </div>
            <div className="absolute inset-0 z-0">
        <Threads
          amplitude={0.5}
          distance={0}
          enableMouseInteraction={false}
        />
      </div>
      */}


      {/* Top Bar */}
      <div className="w-full h-24 bg-slate-500 flex justify-center items-center text-5xl">
        <div className="w-full h-full bg-slate-400 flex justify-center items-center text-5xl">
            <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="w-1/2 h-12 border-gray-400 rounded-lg text-lg text-center"
          />
        </div>

        <div className="w-full h-full bg-slate-300 flex justify-center items-center text-5xl">
          Main Menu
        </div>   

        <div className="w-full h-full bg-slate-400 flex justify-center items-center text-5xl gap-5">

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


      {/* Variable List */}
      <div className="flex flex-col gap-2 w-1/3 ml-10 mt-20">
        {variableConfigs.map((config) => {

          const sensorHistory = history[config.id] || [];
          
          const latestEntry = sensorHistory.at(-1); 
          const latestValue = latestEntry ? latestEntry.val : 0;

          return (
            <Line 
              key={config.id}
              label={config.label}
              unit={config.unit}
              value={latestValue} 
              historyData={sensorHistory}
              isOpen={activeBubble === config.id}
              onClick={() => {
                setActiveBubble(activeBubble === config.id ? null : config.id);
              }}
              onClear={() => {
                setHistory(prev => {
                  const current = prev[config.id];
                  if (!current || current.length === 0) {
                    return prev; 
                  }
                  return {
                    ...prev,
                    [config.id]: [current.at(-1)]
                  };
                });
              }}

            />
          );
        })}
      </div>




    </div>
  );
}
