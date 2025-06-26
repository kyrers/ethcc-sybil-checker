import { useState } from "react";
import { QrReader } from "react-qr-reader";
import "./App.css";

function App() {
  const [scanning, setScanning] = useState(false);
  const [db, setDb] = useState([]); // mock DB: array of scanned codes
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState(null); // 'found' | 'notfound' | null

  const handleScan = (result) => {
    if (result?.text && scanning) {
      setScanning(false);
      setScanResult(result.text);
      if (db.includes(result.text)) {
        setStatus("found");
      } else {
        setDb((prev) => [...prev, result.text]);
        setStatus("notfound");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleStart = () => {
    setScanning(true);
    setScanResult(null);
    setStatus(null);
  };

  return (
    <div className="container-mobile">
      <h2>Scan QR codes to check against database</h2>
      <div className="card">
        <div className="scanner-header-mobile">Scanner</div>
        <div className="scanner-box-mobile">
          {scanning ? (
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: "environment" }}
              onError={handleError}
              style={{ width: "100%" }}
              scanDelay={500}
            />
          ) : status === "found" ? (
            <div
              className="scan-placeholder"
              style={{ color: "#ef4444", fontSize: 32 }}
            >
              ❌ Already got flyer
            </div>
          ) : status === "notfound" ? (
            <div
              className="scan-placeholder"
              style={{ color: "#22c55e", fontSize: 32 }}
            >
              ✅ New visitor, flyer given
            </div>
          ) : (
            <div className="scan-placeholder">Scanner stopped.</div>
          )}
        </div>
        <button
          className="scan-btn"
          onClick={scanning ? () => setScanning(false) : handleStart}
        >
          {scanning ? "Stop Scanning" : "Start Scanning"}
        </button>
      </div>
      <div className="card">
        <div className="db-header-mobile">Database ({db.length} items)</div>
        <div className="db-list-mobile">
          {db.map((code, idx) => (
            <div className="db-item-mobile" key={code + idx}>
              <span className="db-code-mobile">{code}</span>
              <span className="db-status-check">✔️ In Database</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
