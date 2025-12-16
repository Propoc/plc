import React, { useEffect, useState } from "react";


const API_BASE =
  
  "http://localhost:3456";

const VARS = ["T1", "T2", "T3"];


export default function Dashboard() {
  const [data, setData] = useState({});
  const [meta, setMeta] = useState({}); // { T1: { lastUpdated } }
  const [status, setStatus] = useState("connecting");
  const [debug, setDebug] = useState([]);
  const [flash, setFlash] = useState({});
  const [topics, setTopics] = useState("tmsig-1/data");
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    if (eventSource) eventSource.close();

    setStatus("connecting");

    const url = `${API_BASE}/stream?topics=${encodeURIComponent(topics)}`;
    const es = new EventSource(url);

    es.onopen = () => setStatus("connected");
    es.onerror = () => setStatus("error");

    es.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (!msg.data || typeof msg.data !== "object") return;

      const json = msg.data;
      const ts = msg.timestamp;

      // Debug log
      setDebug(prev => {
        const next = [{ topic: msg.topic, timestamp: ts, data: json }, ...prev];
        return next.slice(0, 10);
      });

      // Merge data + update timestamps
      setData(prev => {
        const next = { ...prev };
        Object.keys(json).forEach(k => {
          next[k] = json[k];
        });
        return next;
      });

      setMeta(prev => {
        const next = { ...prev };
        Object.keys(json).forEach(k => {
          next[k] = { lastUpdated: ts };
        });
        return next;
      });

      // Flash only updated keys
      Object.keys(json).forEach(k => {
        setFlash(f => ({ ...f, [k]: true }));
        setTimeout(() => {
          setFlash(f => ({ ...f, [k]: false }));
        }, 800);
      });
    };

    setEventSource(es);
    return () => es.close();
  }, [topics]);

  return (
    <div className="p-5 font-sans">

      {/* Topic Input */}
      <div className="mb-4 w-1/2">
        <label className="font-bold">Subscribe topics:</label>
        <input
          type="text"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-400 rounded text-lg"
        />
      </div>

      {/* Status */}
      <div className={`w-1/2 text-white text-center font-bold py-2 rounded mb-5
        ${status === "connected" ? "bg-green-600" :
          status === "error" ? "bg-red-600" : "bg-yellow-600"}`}>
        {status === "connected" ? "Connected" :
         status === "error" ? "Connection failed" : "Connecting…"}
      </div>

      {/* Variable List */}
      <div className="flex flex-col gap-3 w-1/3">
        {VARS.map(v => (
          <div
            key={v}
            className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 flex items-center"
          >

            {/* Name*/}
            <div className="flex-[2] bg-slate-300 font-bold text-lg text-center">
              {v}
            </div>

            {/* Value */}
            <div className="flex-1 bg-blue-200  text-lg text-right pr-3">
              {data[v] !== undefined ? data[v] : "—"}
            </div>

            {/* Unit */}
            <div className="flex-1 bg-blue-300 text-lg text-left pl-3">
              {"mm"}
            </div>


            {/* Flash (25%) */}
            <div className="flex-1  bg-blue-200 flex justify-end pr-3">
              <div
                className={`w-7 h-7 rounded-full transition-colors duration-1000 ${
                  flash[v] ? "bg-green-700" : "bg-gray-400"
                }`}
              />
            </div>

            {/* Last updated (25%) */}
            <div className="flex-1 text-sm pt-1 pb-1 bg-blue-100 text-gray-600 text-left pl-3">
              {meta[v]?.lastUpdated
                ? new Date(meta[v].lastUpdated).toLocaleTimeString()
                : "—"}
            </div>

          </div>
        ))}
      </div>

      {/* Debug */}
      <div className="mt-6 w-1/2">
        <h3 className="text-lg font-bold mb-2">Debug Log</h3>
        <div className="bg-black text-blue-200 p-3 rounded h-52 overflow-y-auto text-sm">
          {debug.map((e, i) => (
            <div key={i}>
              <div className="text-white font-bold">
                {e.topic} — {new Date(e.timestamp).toLocaleTimeString()}
              </div>
              {JSON.stringify(e.data)}
              <hr className="border-gray-700 my-1" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
