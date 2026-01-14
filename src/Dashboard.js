import React, { useEffect, useState , useRef} from "react";
import { Ripples } from 'ldrs/react'
import { Pulsar } from 'ldrs/react'
import { ring } from 'ldrs'
import { motion } from "framer-motion";

import 'ldrs/react/Ripples.css'
import 'ldrs/react/Pulsar.css'


ring.register()

const c1 = "bg-[#60B649]";
const c2 = "bg-gray-300";


// Adress farese write balonu unit "O" ise On Off
const vars = {
  T1: { id: "T1", label: "Taze Hava Sıcaklık Bilgisi", unit: "°C" },
  T2: { id: "T2", label: "Dönüş Hava Sıcaklık Bilgisi", unit: "°C" },
  T3: { id: "T3", label: "Üfleme Hava Sıcaklık Bilgisi", unit: "°C" },
  T4: { id: "T4", label: "VRF Ambient Sıcaklık Bilgisi", unit: "°C" },

  G1: { id: "G1", label: "Cihaz Durumu", unit: "O" , addr: 16384 },
  G2: { id: "G2", label: "Sistem Durumu", unit: "O" },  
  G3: { id: "G3", label: "Filtre Durumu", unit: "K" },
  G4: { id: "G4", label: "Genel Alarm", unit: "A" },  
  G5: { id: "G5", label: "Dönüş Sıcaklık Set", unit: "°C", addr: 16387 },
  G6: { id: "G6", label: "Vantilatör EC Fan Set", unit: "%" , addr: 16484 },
  G7: { id: "G7", label: "Aspiratör EC Fan Set", unit: "%" , addr: 16483 },
  G8: { id: "G8", label: "Üfleme Alt Limit Set", unit: "O" , addr : 16394 },
  G9: { id: "G9", label: "Üfleme Alt Limit", unit: "°C" , addr: 16450},
  G10: { id: "G10", label: "Üfleme Üst Limit Set", unit: "O" , addr : 16389 },
  G11: { id: "G11", label: "Üfleme Üst Limit", unit: "°C" , addr: 16393},
  G12: { id: "G12", label: "Vantilatör O", unit: "%" },
  G13: { id: "G13", label: "Aspiratör O", unit: "%" },

  D1: { id: "D1", label: "Vantilatör EC Fan Durumu", unit: "O" },
  D2: { id: "D2", label: "Aspiratör EC Fan Durumu", unit: "O" },
  D3: { id: "D3", label: "Taze ve Egzoz Hava Damper Durumu", unit: "O" },
  D4: { id: "D4", label: "Bypass Damper Durumu", unit: "O" },
  D5: { id: "D5", label: "Mutfak Gaz Selenoid Valve Durumu", unit: "O",},

  D6: { id: "D6", label: "VRF Isıtma Modu", unit: "O" },  
  D7: { id: "D7", label: "VRF Soğutma Modu", unit: "O" },  
  D8: { id: "D8", label: "VRF Defrost Modu", unit: "O" }, 
  D9: { id: "D9", label: "VRF Alarm Modu", unit: "O" },



  A1: { id: "A1", label: "Taze Hava Filtre Kirli", unit: "A" },
  A2: { id: "A2", label: "Dönüş Hava Filtre Kirli ", unit: "A" },
  A3: { id: "A3", label: "Vantilatör EC Fan Arıza", unit: "A" },
  A4: { id: "A4", label: "Aspiratör EC Fan Arıza", unit: "A" },
  A5: { id: "A5", label: "Acil Stop Arıza", unit: "A",},
  A6: { id: "A6", label: "VRF Alarm", unit: "A" },
  A7: { id: "A7", label: "Yangın Alarm", unit: "A" },



  R1: { id: "R1", label: "Alarm Reset", unit: "O", addr: 9008 },
};

const But = function But(
  { display = "O" , result = 0,  addr = 0 , textsize = 'text-2xl' , handleWriteClick , loading} 
  ) {

    const [text, setText] = useState("");
    const [bubble, setBubble] = useState(false);
    
    let final;  
    let clr = "bg-gradient-to-r from-blue-400 via-sky-500 to-blue-400 ring-1 ring-black/5";
    let clrt = "bg-gradient-to-r from-teal-300 via-teal-400 to-teal-300 ring-1 ring-black/5";
    let clrf = "bg-gradient-to-r from-red-300 via-rose-400 to-red-300 ring-1 ring-black/5";
    let clrx = "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 ring-1 ring-black/5";
    let isbool = display === "O" || display === "K" || display === "O" || display === "A"  ;

    const bg =
    result === -1
      ? clr
      : display === "O"
        ? result === 1 ? clrt : clrf
        : result === 1 ? clrf : clrt;


    const handleBubble = () => {   // Bubble aç kapa eğer on offsa direk gönder
      setBubble(!bubble);
    };

    const handleClick = () => {  // Text gönder
      handleWriteClick(addr,parseInt(text, 10));
      setBubble(false);
      return;

    };
    
    const handleCheckboxChange = () => {  // Switch
      
      handleWriteClick(addr, result ? 0 : 1);
      return;

    }

    if (display === "O")
    {
      if (result === -1) {
        final = "Undefined";
      }
      else if (result === 0) {
        final = "Kapalı";
      }
      else if (result === 1) {
        final = "Açık";
      }
    }
    else if (display === "K")
    {
      if (result === -1) {
        final = "Undefined";
      }
      else if (result === 0) {
        final = "Temiz";
      }
      else if (result === 1) {
        final = "Kirli";
      }
    }
    else if (display === "A")
    {
      if (result === -1) {
        final = "Undefined";
      }
      else if (result === 0) {
        final = "Normal";
      }
      else if (result === 1) {
        final = "Alarm";
      }

    }
    else if (display === "%")
    {
      final = result;  
      final = `${(final / 10).toFixed(1).replace('.', ',')}%`;
    }
    else
    {
      final = result; 
      final = `${(final / 10).toFixed(1).replace('.', ',')} ${display}`;
    }


    if (isbool) { 

      if (addr !== 0){  // Aç Kapa Switch
        return(
          <div className="h-full w-full relative">
            <label className=' h-full w-full flex select-none items-center justify-center'>
              <div className='relative'>
                <input
                  type='checkbox'
                  onChange={handleCheckboxChange}
                  className='sr-only peer'
                />
                <div
                  className={`box block  rounded-full  cursor-pointer
                    ${ textsize === "text-3xl" ? "h-12 w-24": "h-10 w-20"}
                    ${ loading ? "bg-gray-500 cursor-wait ": result? "bg-green-600": "bg-red-600"}
                    
                `}
                ></div>
                <div
                  className={`absolute left-1 top-1 flex items-center cursor-pointer justify-center rounded-full bg-white transition-transform
                    ${textsize === "text-3xl" ? "h-10 w-10" : "h-8 w-8"}
                    ${ loading ? "cursor-wait ": ""}
                    ${
                      result
                        ? textsize === "text-3xl"
                          ? "translate-x-12"
                          : "translate-x-10"
                        : "translate-x-0"
                    }
                  `}
                ></div>
              </div>
            </label>
          </div>
        )
      }

      else {   // Okumalı Bool

        return(
          <button
            className={`
              w-3/4 h-3/4 rounded-full cursor-default  ${textsize} ${bg}
              flex items-center justify-center text-black
              ${textsize === "text-3xl" ? "px-8 py-2" : textsize === "text-2xl" ? "px-2 py-1" : "px-1 py-0"}  
            `} >
            {final}
          </button>
        ) 
      }

  }
  else {      

    if (addr !== 0) {   // Değerli Giriş 

      return(
        <div className={"relative h-full w-full flex justify-center items-center"}>
          <div
            className={`
              absolute bottom-full left-1/2 -translate-x-1/2
              flex items-center gap-2 h-fit w-fit
              bg-zinc-600 border-zinc-600 rounded-xl px-2 py-2 shadow-lg z-20
              transition-all duration-200 ease-out  
              ${bubble
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-90 pointer-events-none"}
            `}
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border px-2 py-2 rounded text-lg w-28 h-12"
              placeholder="Değer"

            />

            <button
              onClick={handleClick}
              className="bg-green-500 h-12 w-12 rounded-lg text-xl text-gray-200 flex items-center justify-center"
            >
              OK
            </button>

          </div>
            
          <motion.button
            initial={{ scale: 1, rotate: 0 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={
              !loading
                ? {
                    rotate: [0, -2, 2, -1, 1, 0],
                    scale: [1, 1.1, 1.25, 1.5, 1.25],
                  }
                : {}
            }
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onClick={handleBubble}
            className={`
              w-full h-3/4 rounded-full cursor-pointer  ${textsize}
              flex items-center justify-center text-black
              ${loading ? "bg-gray-500 cursor-wait" : `${clr} hover:bg-none hover:bg-orange-700`}
            `}
          >
            {final}
          </motion.button>

        </div>
      ) 
    }

    else {        // Değerli Okuma
     return(
        <button
          className={`
            w-full h-3/4 rounded-full cursor-default ${clrx} ${textsize}
            flex items-center justify-center text-black bg-emerald-700
            ${textsize === "text-3xl" ? "px-8 py-2" : textsize === "text-2xl" ? "px-2 py-1" : "px-1 py-0"}  
          `} >
          {final}
        </button>
        ) 
      }

    }
};


const Line = function Line(
  { config = { label: "Placeholder", unit: "V/V" , addr : 0 }, type = 0, history = [] , textsize = 'text-3xl' , extra , handleWriteClick , loading}
) {


  const sensorHistory = history[config.id] || [];
  const latestEntry = sensorHistory.at(-1);
  const latestValue = latestEntry ? latestEntry.val : -1;

  switch (type) {


      case 6: { //Set
        return (
          <div className="w-full h-16  flex items-center justify-cente">
            <div className={`h-full flex-[6] min-w-0 flex items-center justify-center text-black ${textsize}`}>
              {config.label}
            </div>
            <div className="h-full flex-[3] min-w-0 max-w-40 flex items-center justify-center ">
              <But display={config.unit} result={latestValue} addr={config.addr} textsize={textsize} handleWriteClick={handleWriteClick} loading={loading} />
            </div>
            <div className="h-full flex-[1] min-w-0 flex items-center justify-center">
              {loading && <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black"></l-ring>}
            </div>
          </div>
        );
      }


      case 5: {   // Analar

      let bg;
      if (latestValue === 1) {
        if (config.id === "G2") bg = "[#60B649]";
        else if (config.id === "G3") bg = "yellow";
        else if (config.id === "G4") bg = "red";
        else {
          bg = "none";
        }
      } 
      else {
        bg = "none"
      }

        return (
          <div className={`w-full h-16 flex items-center justify-center `}>
            <div className={`h-full flex-[1] min-w-0 flex items-center justify-center `}>
                {bg !== "none" && (
                  <Pulsar size="40" speed="3" color={bg} />
                )}
            </div>
            <div className={`h-full flex-[4] min-w-0 flex items-center justify-center ${textsize}`}>
              {config.label}
            </div>
            <div className={`h-full flex-[2] min-w-0 flex items-center justify-center`}>
              <But display={config.unit} result={latestValue} addr={config.addr} textsize={textsize} handleWriteClick={handleWriteClick} loading={loading} />
            </div>
            <div className={`h-full flex-[1] min-w-0 flex items-center justify-center `}>
              {loading && <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black"></l-ring>}
            </div>
          </div>
        );
      }

      case 4: //Reset
        return (
          <motion.button
            onClick={() => handleWriteClick(9008, 1)}
            disabled={loading}
            className={`w-40 h-28 rounded-full text-3xl flex items-center justify-center text-black px-6 py-6 cursor-pointer select-none ${
              loading ? "bg-amber-400 cursor-wait" : "bg-rose-400 hover:bg-amber-500"
            }`}
            animate={loading ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={loading ? { duration: 1.4, ease: "easeInOut", repeat: Infinity } : { duration: 0.15 }}
            whileHover={!loading ? { scale: 1.25 } : {}}
            whileTap={!loading ? { scale: 0.9 } : {}}
          >
            ALARM RESET
          </motion.button>
        );

      case 3:  //Durumlar
        return (
          <div className="w-full h-16 flex items-center justify-center">
            <div className={`h-full flex-[6] min-w-0 flex items-center justify-center text-black ${textsize}`}>
              {config.label}  
            </div>
            <div className={`h-full flex-[2] min-w-0 max-w-52 flex items-center justify-center text-black ${textsize}`}>
              <But display={config.unit} result={latestValue} addr={config.addr} textsize={textsize} handleWriteClick={handleWriteClick} />
            </div>
          </div>
        );

      case 2: {  // İkili
        const extraHistory = history[extra.id] || [];
        const extraValue = extraHistory.at(-1)?.val ?? -1; // Using the .val property as discussed earlier

        return (
          <div className="w-full h-14 flex items-center justify-center ">
            <div className={`h-full flex-[10] min-w-0 flex items-center justify-center text-black ${textsize}`}>
              {config.label}
            </div>
            <div className="h-full flex-[3] min-w-0 max-w-24 flex items-center justify-center">
              <But display={config.unit} result={latestValue} addr={config.addr} textsize="text-xl" handleWriteClick={handleWriteClick} />
            </div>
            <div className="h-full flex-[3] min-w-0 max-w-24 flex items-center justify-center text-black">
              <But display={extra.unit} result={extraValue} addr={extra.addr} textsize="text-xl" />
            </div>
            <div className="h-full flex-[2] flex items-center justify-center">
              {loading && <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black"></l-ring>}
            </div>
          </div>
        );
      }

      case 1: { //Sensörler
        const final = (latestValue / 10).toFixed(1).replace(".", ",");
        return (
          <div className="w-full h-12 flex items-center justify-center ">
            <div className={`h-full flex-[6] flex items-center justify-center text-black ${textsize}`}>
              {config.label}
            </div>
            <div className={`h-full flex-[1] flex items-center justify-end pr-4 text-black ${textsize}`}>
              {final}
            </div>
            <div className={`h-full flex-[1] flex items-center justify-start text-black ${textsize}`}>
              {config.unit}
            </div>
          </div>
        );
      }

      default: //Sağ Alt
        return (
          <div className="w-full h-14 flex items-center justify-cente">
            <div className={`h-full flex-[6] min-w-0 flex items-center justify-center text-black ${textsize}`}>
              {config.label}
            </div>
            <div className="h-full flex-[3] min-w-0 max-w-36 flex items-center justify-center">
              <But display={config.unit} result={latestValue} addr={config.addr} textsize={textsize} handleWriteClick={handleWriteClick} loading={loading} />
            </div>
            <div className="h-full flex-[1] min-w-0 flex items-center justify-center">
              {loading && <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black"></l-ring>}
            </div>
          </div>
        );
    }

};



const API_BASE = process.env.REACT_APP_API_BASE ||  "http://localhost:4000"; 


const historyLen = 15;


export default function Dashboard( { setPage , project , user } ) {

  const initialHistory = Object.keys(vars).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  const addrToVarId = Object.values(vars).reduce((acc, v) => {
    if (typeof v.addr === "number") {
      acc[v.addr] = v.id;
    }
    return acc;
  }, {});


  const [history, setHistory] = useState(initialHistory);
  const [alarmHistory, setAlarmHistory] = useState([]);

  const [status, setStatus] = useState("Connection not started");
  const [topic, setTopic] = useState("none");

  const [dataPulse, setDataPulse] = useState(false);
  const [writeStatus, setWriteStatus] = useState(0); // 0 Ready 1 Busy (Addr) Written but awaiting confirmation
  const [weatherConfig, setWeatherConfig] = useState(null);

  const writeBufferRef = useRef(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (project.topic) {
      setTopic(project.topic);
    }
  }, [project.topic]);

  useEffect(() => {

    setStatus("Connecting");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }


    const url =
    `${API_BASE}/stream` +
    `?topic=${encodeURIComponent(topic)}`

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => setStatus("Connected");
    es.onerror = () => setStatus("Error");

    es.onmessage = (event) => {

      const msg = JSON.parse(event.data);

      console.log (msg);

      // 🔍 SET ALARM
      if (msg.alarm) {  
        setAlarmHistory(msg.alarms || []);
        return;
      }

      const json = msg.data;
      const ts = msg.timestamp;
      if (!json || typeof json !== "object") return;

      let writeBuffer = writeBufferRef.current;
      // 🔍 WRITE CHECK 
      if (writeBuffer) {
        const addrNum = writeBuffer.addr;
        const valNum = writeBuffer.val;

        const varId = addrToVarId[addrNum];
        if (!varId) return; // no writable var for this addr

        const receivedRaw = json[varId];
        if (receivedRaw == null) return;

        const receivedVal = Number(receivedRaw);

        if (receivedVal === valNum) {
          console.log("Write confirmed", varId, "addr:", addrNum, "val:", receivedVal );
          writeBufferRef.current = null;
          setWriteStatus(0);
        }
      }

      
    // 🔍 SET HISTORY  
    setHistory(prev => {
        const next = { ...prev };
        
        Object.keys(json).forEach(key => {
          const currentHistory = next[key] || [];
          
          const newDataPoint = {
            val: Number(json[key])      // Valuelar int oluyor
          };

          next[key] = [...currentHistory, newDataPoint].slice(-historyLen);
        });
        
        setDataPulse(true);
        setTimeout(() => setDataPulse(false), 500);
        return next;
      });
            
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
 
  }, [topic]);


  const handleWriteClick = async (addr,val) => {

    if (writeStatus === 1) {
      console.log("Write is busy")
      return;
    }
    else if (writeStatus === 2) {
      console.log("Waiting write confirmation")
      return;
    }

    setWriteStatus(1);
    
    try {
      const res = await fetch(`${API_BASE}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: String(addr).trim(),
          value: String(val).trim(),
          topic: topic,
        }),
      });
      const json = await res.json();



      if (res.error) {
        setWriteStatus(0);
        console.log("Write Fail " + json.error);
        return;
      }
      setWriteStatus(2);
      writeBufferRef.current = { addr, val };
      console.log("Write Done " + json.file + " " + json.content);

    } catch {
      setWriteStatus(0);
      console.log("Write Catch ");
    }
  };

  async function clearHistory() {
  try {
    const res = await fetch(`${API_BASE}/clear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topic,
      }),
    });

    const json = await res.json();
    console.log("Cleared" , json);
  } catch (err) {
    console.error("Clear failed:", err);
  }
}

  function getAlarmLabel(code) {
  return vars?.[code]?.label || code;
  }

  function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("tr-TR");
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }


  const statusColorMap = {
    "Connection not started": "#9ca3af", 
    "Connecting": "#f59e0b",     
    "Connected": "#2971FE",       
    "Error": "#ef4444"         
  };
  const statusSpeedMap = {
    "Connection not started": "1", 
    "Connecting": "0.5",     
    "Connected": "2",       
    "Error": "2"         
  };

  const statusColor = statusColorMap[status] || "#9ca3af";
  const statusSpeed = statusSpeedMap[status] || "1";

  const buffer = writeBufferRef.current;

  const isLoading = (addr) =>
    !!buffer &&
    buffer.addr === addr &&
    writeStatus !== 0;


  useEffect(() => {
    const d6Val = history["D6"]?.at(-1)?.val;
    const d7Val = history["D7"]?.at(-1)?.val;
    const d8Val = history["D8"]?.at(-1)?.val;

    let newConfig;

    if (d6Val === 1) {
      newConfig = {
        src: "/sun.png",
        alt: "sun",
        shadow: "drop-shadow-[0_0_12px_rgba(255,180,0,0.8)]",
      };
    } else if (d7Val === 1) {
      newConfig = {
        src: "/snow.png",
        alt: "wind",
        shadow: "drop-shadow-[0_0_12px_rgba(150,200,255,0.8)]",
      };
    } else if (d8Val === 1) {
      newConfig = {
        src: "/wind.png",
        alt: "snow",
        shadow: "drop-shadow-[0_0_12px_rgba(220,240,255,0.9)]",
      };
    } else {
    }

    setWeatherConfig(newConfig);
  }, [history]);

  return (
    <div className={`w-full h-screen ${c2}`}>
      
    {/* Top Bar */}
    <div
      className={`w-full h-32 ${c1} flex justify-center items-center border-2 border-black`}
    >

      <div className={`h-full flex-[1] flex justify-center items-center `}>
        <img
          src="/per.png"
          alt="sun"
          className="w-full h-full ml-4 object-contain"
        />
      </div>

      <div className="h-full flex-[3] flex justify-center items-center text-4xl text-center">
        {project.name.toUpperCase()}
      </div>  

      <div className="h-full flex-[1] flex justify-center items-center">

        <div className={`h-fit flex flex-[1] justify-center items-center `}>
          {dataPulse && (<Pulsar size="80" speed="2" color="red"/>)}

        </div>

        <div className="h-full flex-[1] flex justify-center items-center">

          <Ripples size="100" speed={statusSpeed} color={statusColor}  />

        </div>

        <div className={`h-full flex flex-[1] justify-center items-center cursor-pointer`}>
          <img
            src="/enter.png"
            alt="exit"
            className="w-full h-full object-contain"
            onClick={() => setPage("project")}
          />
        </div>

      </div>

      

    </div>

    {/* Language & Date */}
    <div className={`w-full h-12 ${c2} flex items-center border-l-2 border-r-2 border-black`}>

        <button className="w-20 h-10"> <img src="/tr.png"alt="sun" className="w-full h-full object-contain"/> </button>
        <button className="w-20 h-10"> <img src="/en.png"alt="sun" className="w-full h-full object-contain"/> </button>
        <button className="w-20 h-10"> <img src="/ger.png"alt="sun" className="w-full h-full object-contain"/> </button>

        <div className={`w-2/5   h-full ml-auto  flex items-center justify-center text-black text-3xl`}>
          {user}
        </div>

        <div className={`w-1/5   h-full ml-auto  flex items-center justify-center text-black text-3xl`}>
          {new Date().toLocaleDateString()}
        </div>
    </div>

    {/* Info Tab*/}

    <div
        className={`w-full h-12 ${c1} flex items-center border-black border-2 text-black text-3xl`}
    >
        <div className={`h-full flex-[1] flex items-center justify-center `}>
        Proje Adı
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        Proje No
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        Cihaz No
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        Ahu No
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        Cihaz Adı
        </div>
    </div>

    <div
        className={`w-full h-12 ${c1} flex items-center border-black border-l-2 border-r-2 border-b-2 text-black text-3xl`}
    >
        <div className={`h-full flex-[1] flex items-center justify-center `}>
        {project.name}
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        {project.projectNo}
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        {project.deviceNo}
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
        {project.ahuNo}
        </div>
        <div className={`h-full flex-[1] flex items-center justify-center border-l-2 border-black`}>
         {project.topic}
        </div>
    </div>

    <div className={`w-full h-8 ${c2} flex items-center justify-center text-black text-3xl border-l-2 border-r-2 border-black`}>

    </div>

    {/* Kullanıcı set tab */}
    <div className={`w-full h-14 ${c1} flex items-center justify-center text-black text-3xl border-2 border-black`}> 
      KULLANICI SET BİLGİLERİ 
    </div>

    {/* Kullanıcı set */}
    <div className={`w-full h-[400px] ${c2} flex items-center justify-center border-2 border-t-0 border-black`}>
      
      {/* Left */}
      <div className={`w-full h-full ${c2} flex-[5] flex flex-col items-center justify-evenly text-black text-3xl `}>
        
        <Line config={vars.G1} history={history} textsize = 'text-2xl' type={5} handleWriteClick={handleWriteClick} loading={isLoading(vars.G1.addr)}/>
        <Line config={vars.G2} history={history} textsize = 'text-2xl' type={5}/>
        <Line config={vars.G3} history={history} textsize = 'text-2xl' type={5}/>
        <Line config={vars.G4} history={history} textsize = 'text-2xl' type={5}/>

      </div>
      
      {/* Middle */}
      <div className={`w-full h-full ${c2} flex-[5] flex flex-col items-center justify-center`}>
        
        <div  className={`w-full h-full flex-[1] border-black border-l-2 border-r-2  flex flex-col items-center justify-center`}>

          <Line config={vars.G5} history={history} type={6} handleWriteClick={handleWriteClick} loading={isLoading(vars.G5.addr)}/>

        </div>

        <div className={`w-full h-full  flex-[1] border-t-2 border-black border-l-2 border-r-2 flex items-center justify-center`}>

          <Line config={vars.R1} history={history} type={4} handleWriteClick={handleWriteClick} loading={isLoading(vars.R1.addr)}/>

        </div>

      </div>


      {/* Right */}
      <div className={`w-full h-full ${c2} bg-blue-600 flex-[5] flex flex-col items-center justify-evenly`}>

        {/* Right  Top*/}
        <div className={`w-full h-full flex flex-col items-center justify-evenly`}>
    
          <Line config={vars.G6} history={history} type={2} textsize="text-2xl" handleWriteClick={handleWriteClick} loading={isLoading(vars.G6.addr)} extra ={vars.G12}/>
          <Line config={vars.G7} history={history} type={2} textsize="text-2xl" handleWriteClick={handleWriteClick} loading={isLoading(vars.G7.addr)} extra ={vars.G13}/>

          
          <Line config={vars.G8} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick} loading={isLoading(vars.G8.addr)}/>
          <Line config={vars.G9} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick} loading={isLoading(vars.G9.addr)}/>
          <Line config={vars.G10} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick} loading={isLoading(vars.G10.addr)}/>
          <Line config={vars.G11} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick} loading={isLoading(vars.G11.addr)}/>

        </div>

      </div>

    </div>

    {/* Mod tab */}
    <div className={`w-full h-32 ${c2} flex items-center justify-evenly border-2 border-t-0 border-black gap-16`}>
             
      <div className={`w-24 h-24 flex flex-[1] items-center justify-center `}>

        {weatherConfig && (
          <img
            src={weatherConfig.src}
            alt={weatherConfig.alt}
            className={`w-full h-full object-contain ${weatherConfig.shadow || ""}`}
          />
        )}

      </div>

    </div>

    {/* Sensör  tab*/}
    <div className={`w-full h-14 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
      SENSÖR BİLGİLERİ
    </div>
            
    {/* Sensör */}
    <div className={`w-full h-32 ${c2} flex items-center justify-center border-2 border-t-0 border-black`}>
      
      <div className={`h-fit ${c2} flex flex-[1] flex-col items-center gap-2 justify-around border-black`}>
          <Line config = {vars.T1} history={history}  type={1} />
          <Line config = {vars.T2} history={history}  type={1} />
      </div>

      <div className={`h-fit ${c2} flex flex-[1] flex-col items-center gap-2 justify-around  border-black`}>
        <Line config = {vars.T3} history={history}  type={1} />
        <Line config = {vars.T4} history={history}  type={1} />
      </div>

    </div>

    
    {/* Durum  tab*/}
    <div className={`w-full h-14 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
      DURUM BİLGİLERİ
    </div>
            
    {/* Durum */}
    <div className={`w-full h-[400px] ${c2} flex items-center justify-center border-2 border-t-0 border-black`}>


      <div className={`w-full h-fit ${c2} flex flex-[1] flex-col items-center gap-2 justify-around border-black`}>
          
        <Line config={vars.D1} history={history} type={3}/>
        <Line config={vars.D2} history={history} type={3}/>            
        <Line config={vars.D3} history={history} type={3}/>
        <Line config={vars.D4} history={history} type={3}/>
        <Line config={vars.D5} history={history} type={3}/>

      </div>

      <div className={`w-full h-fit ${c2} flex flex-[1] flex-col items-center gap-4 justify-around border-black`}>


        <Line config={vars.D6} history={history} type={3}/>
        <Line config={vars.D7} history={history} type={3}/>
        <Line config={vars.D8} history={history} type={3}/>
        <Line config={vars.D9} history={history} type={3}/>

      </div>




    </div>
    
    {/* Arıza tab*/}
    <div className={`relative w-full h-14 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
      <button
        className=" absolute right-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-400 via-sky-500 to-blue-400
          text-white text-lg shadow-lg shadow-black/20 hover:scale-125 transition
        "
        onClick={clearHistory}
      >
        Temizle
      </button>


      Arıza Bilgileri
    </div>

    <div className={`w-full h-fit ${c2} flex items-center justify-center text-red-600 text-3xl border-2 border-t-0 border-black`}>
      <div className={`w-full h-12 ${c2} flex flex-[1] items-center justify-center  border-black`}>
        Tarih
      </div>
      <div className={`w-full h-12 ${c2} flex flex-[1] items-center justify-center border-l-2 border-r-2 border-black`}>
        Saat
      </div>
      <div className={`w-full h-12 ${c2} flex flex-[5] items-center justify-center border-black`}>
        Açıklama
      </div>
    </div>

    {[...alarmHistory].reverse().map((entry, i) => (
      <div
        key={i}
        className={`w-full h-fit ${c2} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}
      >
        <div className={`w-full h-12 ${c2} flex flex-[1] items-center justify-center`}>
          {formatDate(entry.timestamp)}
        </div>

        <div className={`w-full h-12 ${c2} flex flex-[1] items-center justify-center border-l-2 border-r-2 border-black`}>
          {formatTime(entry.timestamp)}
        </div>

        <div className={`w-full h-12 ${c2} flex flex-[5] items-center justify-center`}>
          {entry.alarms.map(getAlarmLabel).join(", ")}
        </div>
      </div>
    ))}

  </div>
  );


  
}
