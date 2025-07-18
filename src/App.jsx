import React, { useRef, useState } from 'react';

// 🟦 List your custom-named NFTs here (use lowercase for names):
const NFT_IMAGES = [
  { name: "cryptopunk", img: new URL('./nfts/punk.png', import.meta.url).href },
  { name: "mystic axie", img: new URL('./nfts/mystic-axie.png', import.meta.url).href },
  { name: "milady", img: new URL('./nfts/milady.png', import.meta.url).href },
  { name: "pepe", img: new URL('./nfts/pepe.png', import.meta.url).href },
  // ...add more!
];

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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    let rollIdx = 0;
    let interval = setInterval(() => {
      setCurrentRoll(rollIdx % NFT_IMAGES.length);
      rollIdx++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (audioRef.current) audioRef.current.pause();
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

  // Share on Twitter
  const shareOnTwitter = () => {
    if (!selectedNft) return;
    const msg = `i just got "${selectedNft.name}" on which nft are you? nft selfie cam 🔗 [paste your app link here]`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div
      style={{
        fontFamily: 'monospace',
        background: '#f3f3f3',
        minHeight: '100vh',
        paddingTop: 40,
        color: '#222',
        margin: 0,
      }}>
      <div
        style={{
          border: '2px solid #b4b4b4',
          borderRadius: 6,
          background: '#fff',
          maxWidth: 360,
          margin: '40px auto',
          padding: 22,
          boxShadow: '2px 2px 0 #c6c6c6',
          position: 'relative'
        }}
      >
        <h1 style={{
          fontSize: 28,
          textTransform: 'lowercase',
          letterSpacing: 0,
          margin: '0 0 18px 0',
          fontWeight: 600
        }}>
          which nft are you?
        </h1>

        {!showCamera && (
          <button
            onClick={startCamera}
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              padding: '10px 24px',
              background: '#fff',
              border: '2px solid #b4b4b4',
              borderRadius: 4,
              boxShadow: '2px 2px 0 #c6c6c6',
              cursor: 'pointer',
              marginBottom: 24,
              textTransform: 'lowercase'
            }}
          >
            📸 take a selfie
          </button>
        )}

        <audio ref={audioRef} src="/roll.mp3" preload="auto" />

        {showCamera && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <video
              ref={videoRef}
              width="260"
              height="200"
              style={{
                borderRadius: 6,
                background: '#222',
                border: '2px solid #bbb',
                marginBottom: 18,
              }}
              autoPlay
              playsInline
              muted
            />
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '-45px',
              transform: 'translateX(-50%)',
              width: 90,
              height: 90,
              zIndex: 2,
              pointerEvents: 'none',
              transition: 'all 0.25s',
            }}>
              <img
                src={NFT_IMAGES[currentRoll].img}
                alt=""
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  background: '#fff',
                  border: rolling ? '3px solid #222' : '2px solid #bbb',
                  boxShadow: rolling ? '0 0 12px #eee' : 'none',
                }}
              />
            </div>
            {!rolling && (
              <button
                onClick={rollNft}
                style={{
                  fontSize: 16,
                  fontFamily: 'monospace',
                  padding: '7px 16px',
                  marginTop: 12,
                  background: '#fff',
                  border: '2px solid #b4b4b4',
                  borderRadius: 3,
                  boxShadow: '2px 2px 0 #c6c6c6',
                  cursor: 'pointer',
                  textTransform: 'lowercase'
                }}
                disabled={rolling}
              >
                🎰 roll nft
              </button>
            )}
            {selectedNft && (
              <div style={{ marginTop: 80, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'lowercase', marginBottom: 4 }}>
                  {selectedNft.name}
                </div>
                <img
                  src={selectedNft.img}
                  alt={selectedNft.name}
                  width="70"
                  style={{ borderRadius: 7, border: '1.5px solid #bbb', background: '#fff' }}
                />
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={shareOnTwitter}
                    style={{
                      fontSize: 14,
                      fontFamily: 'monospace',
                      marginRight: 10,
                      border: '2px solid #b4b4b4',
                      borderRadius: 3,
                      background: '#fff',
                      boxShadow: '2px 2px 0 #c6c6c6',
                      cursor: 'pointer',
                      textTransform: 'lowercase'
                    }}
                  >
                    share on twitter
                  </button>
                  <button
                    onClick={reset}
                    style={{
                      fontSize: 14,
                      fontFamily: 'monospace',
                      border: '2px solid #b4b4b4',
                      borderRadius: 3,
                      background: '#fff',
                      boxShadow: '2px 2px 0 #c6c6c6',
                      cursor: 'pointer',
                      textTransform: 'lowercase'
                    }}
                  >
                    try again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
