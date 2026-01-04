import React, { useEffect, useState , useRef} from "react";

import { motion } from "framer-motion";


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

  D1: { id: "D1", label: "Vantilatör EC Fan Durumu", unit: "O" },
  D2: { id: "D2", label: "Aspiratör EC Fan Durumu", unit: "O" },
  D3: { id: "D3", label: "Taze Hava ve Egzoz Hava Damper Durumu", unit: "O" },
  D4: { id: "D4", label: "Bypass Damper Durumu", unit: "O" },
  D5: { id: "D5", label: "Mutfak Gaz Selenoid Valve Durumu", unit: "O",},

  D6: { id: "D6", label: "VRF Isıtma Modu", unit: "O" },  
  D7: { id: "D7", label: "VRF Soğutma Modu", unit: "O" },  
  D8: { id: "D8", label: "VRF Defrost Modu", unit: "O" }, 
  D9: { id: "D9", label: "VRF Alarm Modu", unit: "O" },



  A1: { id: "A1", label: "Taze Hava Filtre Kirli", unit: "A" },
  A2: { id: "A2", label: "Dönüş Hava Kirli ", unit: "A" },
  A3: { id: "A3", label: "Vantilatör EC Fan Arıza", unit: "A" },
  A4: { id: "A4", label: "Aspiratör EC Fan Arıza", unit: "A" },
  A5: { id: "A5", label: "Acil Durum Arıza", unit: "A",},
  A6: { id: "A6", label: "VRF Alarm", unit: "A" },
  A7: { id: "A7", label: "Yangın Alarm", unit: "A" },

  O1: { id: "O1", label: "Vantilatör O", unit: "%" },
  O2: { id: "O2", label: "Aspiratör O", unit: "%" },

  R1: { id: "R1", label: "Alarm Reset", unit: "O", add: 9008 },
};

const But = function But(
  { display = "O" , result = 0,  addr = 0 , textsize = 'text-3xl' , handleWriteClick} 
  ) {

    const [text, setText] = useState("");
    const [bubble, setBubble] = useState(false);

    let final;
    let clr = "bg-amber-200";
    let isbool = display === "O";


    const handleBubble = () => {       // Bubble aç kapa eğer on offsa direk gönder

      if (isbool && addr !== 0) {

        if (result === -1) return;


        let val = 1 - result;
        handleWriteClick(addr,val);
        return;
      }


      setBubble(!bubble);
    };

    const handleClick = () => {  // Text gönder

      handleWriteClick(addr,parseInt(text, 10));
      return;

    };


    if (display === "O")
    {
      if (result === -1) {
        final = "Undefined";
      }
      else if (result === 0) {
        final = "Kapalı";
        clr = "bg-red-500";
      }
      else if (result === 1) {
        final = "Açık";
        clr = "bg-green-500";
      }
    }

    else if (display === "K")
    {
      if (result === -1) {
        final = "Undefined";
      }
      else if (result === 0) {
        final = "Temiz";
        clr = "bg-green-500";
      }
      else if (result === 1) {
        final = "Kirli";
        clr = "bg-red-500";
      }
    }

    else if (display === "A")
    {
      if (result === -1) {
        final = "Undefined";
      }
      else if (result === 0) {
        final = "Normal";
        clr = "bg-green-500";
      }
      else if (result === 1) {
        final = "Alarm";
        clr = "bg-green-500";
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
      final = (final / 10).toFixed(1).replace('.', ',');
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
        
        
      <button
        onClick={handleBubble}
        
        className={`
          w-fit h-fit rounded-full cursor-default ${clr}
          flex items-center justify-center text-black
          ${textsize === "text-3xl" ? "px-8 py-2" : "px-4 py-1"}  
          ${addr !== 0 ? "cursor-pointer hover:scale-125 hover:bg-amber-500" : ""}
        `+ textsize}
      >
        {final}
        
      </button>
    
    
     </div>
    )

};


const Line = function Line(
  { config = { label: "Placeholder", unit: "V/V" , addr : 0 }, type = 0, history = [] , textsize = 'text-3xl' , extra , handleWriteClick }
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
          <But display = {config.unit}   result = {latestValue} addr = {config.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />
        </div>      
      </div>

    );
  }

  if (type === 2) {

      const extraHistory = history[extra.id] || [];
      const extraEntry = extraHistory.at(-1);
      const extraValue = extraEntry ? extra.val : -1;


    return (
      <div className={`w-full h-8  flex items-center justify-cente `}>
        <div className={`w-full h-full slate-100 flex-[4] flex items-center justify-center text-black text-3xl `}>
          {config.label}
        </div>
        <div className={`w-full h-full flex-[1] flex items-center justify-center `}>
            <But display = {config.unit}   result = {latestValue} addr = {config.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />
        </div>       
        <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl `}>
            <But display = {extra.unit}   result = {extraValue} addr = {extra.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />
        </div>       
      </div>
    );
  }

  if (type === 1) {

    let final = (latestValue / 10).toFixed(1).replace('.', ',');

    return (
      <div className={`w-full h-12 flex items-center justify-center`}>
        <div className={`w-full h-full  flex-[6] flex items-center justify-center text-black text-3xl `}>
          {config.label}
        </div>    
        <div className={`w-full h-full flex-[1] flex items-center justify-end pr-8 text-black text-3xl `}>
          {final}
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

      <But display = {config.unit}  result = {latestValue} addr = {config.addr} textsize={textsize}  handleWriteClick = {handleWriteClick } />

    </div>         
  </div>
  );
 
};



const API_BASE = process.env.REACT_APP_API_BASE ||  "http://localhost:4000";   // FIX IT FIX I

  

const historyLen = 15;

const statusColors = {
  Connected: { dot: "#4ade80", shadow: "rgba(74, 222, 128, 0.5)", text: "Connected" },
  Connecting: { dot: "#facc15", shadow: "rgba(250, 204, 21, 0.5)", text: "Connecting" },
  Error: { dot: "#f87171", shadow: "rgba(248, 113, 113, 0.5)", text: "Connection Error" }
};


export default function Dashboard( { setPage } ) {

  const initialHistory = Object.keys(vars).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  const [history, setHistory] = useState(initialHistory);
  const [alarmHistory, setAlarmHistory] = useState([]);

  const [status, setStatus] = useState("Connection not started");
  const [topic, setTopic] = useState("tmsig-1/data");


  const [writeStatus, setWriteStatus] = useState(0); // 0 Ready 1 Busy
  const [flashBlue, setFlashBlue] = useState(false);
  
  const eventSourceRef = useRef(null);

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

      setFlashBlue(true);
      setTimeout(() => {
        setFlashBlue(false);
      }, 500);


      const msg = JSON.parse(event.data);


      if (msg.alarm) {  
        setAlarmHistory(msg.alarms || []);
        return;
      }



      const json = msg.data;
      const ts = msg.timestamp;

      if (!json || typeof json !== "object") return;


      setHistory(prev => {
        const next = { ...prev };
        
        Object.keys(json).forEach(key => {
          const currentHistory = next[key] || [];
          
          const newDataPoint = {
            val: Number(json[key])
          };

          next[key] = [...currentHistory, newDataPoint].slice(-historyLen);
        });
        
        return next;
      });

            
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
 
  }, []);


  const handleWriteClick = async (addr,val) => {

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



      if (!res.ok) {
        setWriteStatus(0);
        console.log("Write Fail " + json.error);
        return;
      }
      setWriteStatus(0);
      console.log("Write Done " + json.file + " " + json.content);

    } catch {
      console.log("Write Catch ");
    }
  };

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

  const c1 = "bg-[#60B649]";
  const c2 = "bg-gray-300";

  const dotColor = flashBlue
  ? "#3b82f6"
  : statusColors[status]?.dot || "#94a3b8";

  const shadowColor = flashBlue
    ? "rgba(59,130,246,0.8)"
    : statusColors[status]?.shadow || "rgba(0,0,0,0)";

  const writeColor = writeStatus
  ? "#3b82f6"
  : statusColors[status]?.dot || "#94a3b8";


  return (
    <div className={`w-full h-screen ${c2}`}>
      
    {/* Top Bar */}
    <div
      className={`w-full h-32 ${c1} flex justify-center items-center`}
    >

      <div className={`w-full h-full  flex-[1] flex justify-center items-center `}>
        <div className={`w-full h-full ml-4 flex justify-center items-center `}>
          <img
            src="/per.png"
            alt="sun"
            className="w-full h-full object-contain"
          />
        </div>

      </div>

      <div className="w-full h-full flex-[3] flex justify-center items-center text-5xl text-center">
        AKSCON OTOMASYON KONTROL SİSTEMLERİ
      </div>  


      <div className="w-full h-full flex-[1] flex justify-center items-center">

        <div className={`w-fit h-fit flex flex-[1] justify-center items-center `}>
        {/* Outer Pulsing Glow */}
          <motion.div
            animate={{
              scale: [1, 1, 1],
              opacity: [0.5, 0.1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-16 h-16 rounded-full blur-xl"
            style={{
              backgroundColor: writeColor,
            }}
          />

          {/* Inner Solid Bubble */}
          <motion.div
            animate={{
              scale: [1, 1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-12 h-12 rounded-full shadow-2xl border-4 border-white/40"
            style={{
              backgroundColor: writeColor,
              boxShadow: `0 0 40px ${shadowColor}`,
            }}
          />
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

        <div className={`w-fit h-fit flex flex-[1] justify-center items-center cursor-pointer`}>
          <img
            src="/enter.png"
            alt="sun"
            className="w-20 h-20 object-contain]"
            onClick={() => setPage("project")}
          />
        </div>


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
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Perlus </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Proje No </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> tmsig-1 </div>
    </div>

    <div className={`w-full h-12 ${c1} flex items-center mb-8 border-black border-2 `}>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl`}> Kullanıcı Adı </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> admin </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> Cihaz No </div>
          <div className={`w-full h-full flex-[1] flex items-center justify-center text-black text-3xl border-l-2 border-black`}> 123123 </div>
    </div>

    {/* Kullanıcı set tab */}
    <div className={`w-full h-12 ${c1} flex items-center justify-center text-black text-3xl border-2 border-black`}> Kullanıcı Set Bilgileri </div>

    {/* Kullanıcı set */}
    <div className={`w-full h-[360px] ${c2} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
      
      {/* Left */}
      <div className={`w-full h-full ${c2} flex-[5] flex flex-col items-center justify-evenly text-black text-3xl `}>
        
        <Line config={vars.G1} history={history} handleWriteClick={handleWriteClick}/>
        <Line config={vars.G2} history={history} />
        <Line config={vars.G3} history={history} />
        <Line config={vars.G4} history={history} />

      </div>
      
      {/* Middle */}
      <div className={`w-full h-full ${c2} flex-[3] flex flex-col items-center justify-center text-black text-3xl`}>
        
        <div  className={`w-full h-full flex-[1] border-black border-l-2 border-r-2  flex flex-col items-center justify-center text-black text-3xl `}>

          <Line config={vars.G5} history={history} handleWriteClick={handleWriteClick}/>

        </div>

      <div className={`w-full h-full  flex-[1] border-t-2 border-black border-l-2 border-r-2 flex flex-col items-center justify-center text-black text-3xl`}>

          <div className={`w-full h-8  flex items-center justify-center text-black text-3xl `}>
            <div className={`w-full h-full flex-[2] flex items-center justify-center text-black text-3xl `}>


              <button
                className={`
                  w-fit h-fit rounded-full
                  flex items-center justify-center text-black bg-amber-200  px-8 py-4
                  transition-transform duration-150
                  hover:scale-125 hover:bg-amber-500
                  active:scale-90 
                `}
                onClick={() => handleWriteClick(9008, 1)}
              >
                ALARM RESET
              </button>

            </div>   
          </div>
        </div>
      </div>


      {/* Right */}
      <div className={`w-full h-full ${c2} bg-blue-600 flex-[5] flex flex-col items-center justify-evenly`}>

        {/* Right  Top*/}
        <div className={`w-full h-full flex-[2] flex flex-col items-center justify-evenly`}>
    
          <Line config={vars.G6} history={history} type = {2} textsize="text-2xl" handleWriteClick={handleWriteClick} extra ={vars.O1}/>
          <Line config={vars.G7} history={history} type = {2} textsize="text-2xl" handleWriteClick={handleWriteClick} extra ={vars.O2}/>


        </div>

        {/* Right  Bottom*/}
        <div className={`w-full h-full flex-[4] flex flex-col items-center justify-evenly text-black text-3xl `}>
          
          <Line config={vars.G8} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G9} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G10} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>
          <Line config={vars.G11} history={history} textsize="text-2xl" handleWriteClick={handleWriteClick}/>

        </div>

      </div>

    </div>

    {/* Mod tab */}
    <div className={`w-full h-24 ${c2} flex items-center justify-evenly text-black text-3xl border-2 border-t-0 border-black gap-16`}>
             
      <div className={`w-20 h-20 flex flex-[1] items-center justify-center `}>
        <img
          src="/sun.png"
          alt="sun"
          className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,180,0,0.8)]"
        />
      </div>

    </div>

    {/* Sensör  tab*/}
    <div className={`w-full h-12 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
        Sensör Bilgileri
    </div>
            
    {/* Sensör */}
    <div className={`w-full h-fit ${c2} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
      
      <div className={`w-full h-fit ${c2} flex flex-[1] flex-col items-center justify-center text-black text-3xl  border-black`}>
          <Line config = {vars.T1} history={history}  type={1} />
          <Line config = {vars.T2} history={history}  type={1} />
      </div>

      <div className={`w-full h-fit ${c2} flex flex-[1] flex-col items-center justify-center text-black text-3xl  border-black`}>
        <Line config = {vars.T3} history={history}  type={1} />
        <Line config = {vars.T4} history={history}  type={1} />
      </div>

    </div>

    
    {/* Durum  tab*/}
    <div className={`w-full h-12 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
        Durum Bilgileri
    </div>
            
    {/* Durum */}
    <div className={`w-full h-fit ${c2} flex items-center justify-center text-black text-3xl gap-2  border-2 border-t-0 border-black`}>


      <div className={`w-full h-fit ${c2} flex flex-[1] flex-col items-center justify-center text-black text-3xl  border-black`}>
          
        <Line config={vars.D1} history={history} type={3}/>
        <Line config={vars.D2} history={history} type={3}/>            
        <Line config={vars.D3} history={history} type={3}/>
        <Line config={vars.D4} history={history} type={3}/>
        <Line config={vars.D5} history={history} type={3}/>

      </div>

      <div className={`w-full h-fit ${c2} flex flex-[1] flex-col items-center justify-center text-black text-3xl  border-black`}>


        <Line config={vars.D6} history={history} type={3}/>
        <Line config={vars.D7} history={history} type={3}/>
        <Line config={vars.D8} history={history} type={3}/>
        <Line config={vars.D9} history={history} type={3}/>

      </div>




    </div>
    
    {/* Arıza tab*/}
    <div className={`w-full h-12 ${c1} flex items-center justify-center text-black text-3xl border-2 border-t-0 border-black`}>
        Arıza Bilgileri
    </div>

    <div className={`w-full h-fit ${c2} flex items-center justify-center text-red-600 text-3xl border-2 border-t-0 border-black`}>
      <div className={`w-full h-12 ${c2} flex flex-[1] items-center justify-center text-red-600 text-3xl  border-black`}>
        Tarih
      </div>
      <div className={`w-full h-12 ${c2} flex flex-[1] items-center justify-center text-red-600 text-3xl border-l-2 border-r-2 border-black`}>
        Saat
      </div>
      <div className={`w-full h-12 ${c2} flex flex-[5] items-center justify-center text-red-600 text-3xl  border-black`}>
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
