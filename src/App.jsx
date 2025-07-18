import React, { useRef, useState } from 'react';

// Import images dynamically from nfts folder
const nftCount = 5; // Change this to the number of images you have
const NFT_IMAGES = Array.from({ length: nftCount }, (_, i) => ({
  name: `NFT #${i + 1}`,
  img: new URL(`./nfts/nft${i + 1}.png`, import.meta.url).href,
}));

export default function App() {
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [currentRoll, setCurrentRoll] = useState(0);
  const audioRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    setShowCamera(true);
    setSelectedNft(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Start rolling animation
  const rollNft = () => {
    setRolling(true);
    setSelectedNft(null);
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    let rollIdx = 0;
    let interval = setInterval(() => {
      setCurrentRoll(rollIdx % NFT_IMAGES.length);
      rollIdx++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      audioRef.current.pause();
      // Pick a winner
      const winner = Math.floor(Math.random() * NFT_IMAGES.length);
      setCurrentRoll(winner);
      setSelectedNft(NFT_IMAGES[winner]);
      setRolling(false);
    }, 2000); // Roll for 2 seconds
  };

  // Reset
  const reset = () => {
    setShowCamera(false);
    setSelectedNft(null);
    setCurrentRoll(0);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: 40 }}>
      <h1>Which NFT Are You?</h1>
      {!showCamera && (
        <button onClick={startCamera} style={{ fontSize: 20, padding: 12 }}>
          📸 Take a Selfie
        </button>
      )}

      <audio ref={audioRef} src="./roll.mp3" preload="auto" />

      {showCamera && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <video
            ref={videoRef}
            width="320"
            height="240"
            style={{ borderRadius: 12, background: '#111' }}
            autoPlay
            playsInline
            muted
          />
          {/* NFT Rolling animation */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '20px',
            transform: 'translateX(-50%)',
            width: 120,
            height: 120,
            zIndex: 2,
            pointerEvents: 'none',
            transition: 'all 0.25s',
          }}>
            <img
              src={NFT_IMAGES[currentRoll].img}
              alt=""
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                boxShadow: rolling ? '0 0 20px #f0f' : '0 0 10px #aaa',
                border: rolling ? '4px solid #f0f' : '3px solid #222',
                background: '#fff',
                transition: 'all 0.15s',
              }}
            />
          </div>
          {!rolling && (
            <button
              onClick={rollNft}
              style={{
                fontSize: 20,
                padding: 12,
                marginTop: 14,
                marginBottom: 10,
                position: 'absolute',
                left: '50%',
                bottom: '-55px',
                transform: 'translateX(-50%)'
              }}
              disabled={rolling}
            >
              🎰 Roll NFT!
            </button>
          )}
          {selectedNft && (
            <div style={{ marginTop: 160 }}>
              <strong style={{ fontSize: 22 }}>{selectedNft.name}</strong>
              <div style={{ margin: '18px 0' }}>
                <img src={selectedNft.img} alt={selectedNft.name} width="120" style={{ borderRadius: 16 }} />
              </div>
              <button onClick={reset} style={{ fontSize: 16, marginTop: 8 }}>Try Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
