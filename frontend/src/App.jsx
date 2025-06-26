import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./App.css";

function App() {
  const [scanning, setScanning] = useState(false);
  const [db, setDb] = useState([
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
    "0987654321",
    "1234567890",
  ]); // mock DB: array of scanned codes
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState(null); // 'found' | 'notfound' | null

  const html5QrCodeRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (scanning && readerRef.current && !html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
      html5QrCodeRef.current
        .start(
          { facingMode: "environment" },
          { fps: 10 },
          (decodedText) => {
            handleScan({ text: decodedText });
          },
          () => {}
        )
        .catch(() => {});
    } else if (!scanning && html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(() => {});
      html5QrCodeRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

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

  const handleStart = () => {
    setScanning(true);
    setScanResult(null);
    setStatus(null);
  };

  const handleScanButtonClick = () => {
    if (scanning) {
      setScanning(false);
    } else {
      handleStart();
    }
  };

  return (
    <div className="container-mobile">
      <h2>Scan QR codes to check against database</h2>
      <div className="card flex-shrink-0">
        <div className="scanner-header-mobile">Scanner</div>
        <div className="scanner-box-mobile">
          {scanning ? (
            <div id="reader" ref={readerRef} />
          ) : status === "found" ? (
            <div
              className="scan-placeholder"
              style={{ color: "#ef4444", fontSize: "x-large" }}
            >
              ❌ Already scanned
            </div>
          ) : status === "notfound" ? (
            <div
              className="scan-placeholder"
              style={{ color: "#22c55e", fontSize: "x-large" }}
            >
              ✅ Not scanned yet
            </div>
          ) : (
            <div className="scan-placeholder">Scanner stopped.</div>
          )}
        </div>
        <button className="scan-btn" onClick={handleScanButtonClick}>
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
