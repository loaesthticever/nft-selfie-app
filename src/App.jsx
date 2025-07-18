import React, { useRef, useState } from 'react';

// 🟦 List your custom‐named NFTs here (use lowercase for names):
const NFT_IMAGES = [
  { name: "azuki", img: new URL("./nfts/azuki.png", import.meta.url).href },
  { name: "milady", img: new URL("./nfts/milady.png", import.meta.url).href },
  { name: "moki", img: new URL("./nfts/moki.png", import.meta.url).href },
  { name: "mystic axie", img: new URL("./nfts/mystic-axie.png", import.meta.url).href },
  { name: "pudgy", img: new URL("./nfts/pudgy.png", import.meta.url).href },
  { name: "ronke", img: new URL("./nfts/ronke.png", import.meta.url).href },
  { name: "vitalik buterin", img: new URL("./nfts/vitalik-buterin.png", import.meta.url).href },
  { name: "yapybara", img: new URL("./nfts/yapybara.png", import.meta.url).href },
];

export default function App() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(0);
  const [selectedNft, setSelectedNft] = useState(null);

  // start camera
  const startCamera = async () => {
    setShowCamera(true);
    setSelectedNft(null);
    if (navigator.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // roll animation + sound
  const rollNft = () => {
    setRolling(true);
    setSelectedNft(null);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    let idx = 0;
    const interval = setInterval(() => {
      setCurrentRoll(idx % NFT_IMAGES.length);
      idx++;
    }, 200); // 200ms per frame

    setTimeout(() => {
      clearInterval(interval);
      audioRef.current?.pause();

      const winner = Math.floor(Math.random() * NFT_IMAGES.length);
      setCurrentRoll(winner);
      setSelectedNft(NFT_IMAGES[winner]);
      setRolling(false);
    }, 2000);
  };

  // reset
  const reset = () => {
    setShowCamera(false);
    setSelectedNft(null);
    setCurrentRoll(0);
    videoRef.current?.srcObject?.getTracks().forEach((t) => t.stop());
  };

  // share on twitter
  const shareOnTwitter = () => {
    if (!selectedNft) return;
    const msg = `you are a ${selectedNft.name} on which nft are you? nft selfie cam 🔗 https://nft-selfie-app.vercel.app/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        fontFamily: "monospace",
        background: "#f3f3f3",
        minHeight: "100vh",
        color: "#222",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "2px solid #b4b4b4",
          borderRadius: 6,
          background: "#fff",
          maxWidth: 360,
          padding: 22,
          boxShadow: "2px 2px 0 #c6c6c6",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            textTransform: "lowercase",
            margin: "0 0 18px 0",
          }}
        >
          which nft are you?
        </h1>

        {!showCamera && (
          <button
            onClick={startCamera}
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              padding: "10px 24px",
              background: "#fff",
              border: "2px solid #b4b4b4",
              borderRadius: 4,
              boxShadow: "2px 2px 0 #c6c6c6",
              cursor: "pointer",
              marginBottom: 24,
              textTransform: "lowercase",
            }}
          >
            📸 take a selfie
          </button>
        )}

        <audio ref={audioRef} src="/roll.mp3" preload="auto" />

        {showCamera && (
          <div style={{ position: "relative", display: "inline-block" }}>
            <video
              ref={videoRef}
              width="260"
              height="200"
              style={{
                borderRadius: 6,
                background: "#222",
                border: "2px solid #bbb",
                marginBottom: 18,
              }}
              autoPlay
              playsInline
              muted
            />

            <div
              style={{
                position: "absolute",
                top: "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 100,
                height: 100,
                overflow: "hidden",
              }}
            >
              <img
                src={NFT_IMAGES[currentRoll].img}
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {!rolling && (
              <button
                onClick={rollNft}
                style={{
                  fontSize: 16,
                  fontFamily: "monospace",
                  padding: "7px 16px",
                  marginTop: 12,
                  background: "#fff",
                  border: "2px solid #b4b4b4",
                  borderRadius: 3,
                  boxShadow: "2px 2px 0 #c6c6c6",
                  cursor: "pointer",
                  textTransform: "lowercase",
                }}
                disabled={rolling}
              >
                🎰 roll nft
              </button>
            )}

            {selectedNft && (
              <div style={{ marginTop: 80 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textTransform: "lowercase",
                    marginBottom: 4,
                  }}
                >
                  you are a {selectedNft.name}
                </div>
                <img
                  src={selectedNft.img}
                  alt={selectedNft.name}
                  width="70"
                  style={{
                    borderRadius: 7,
                    border: "1.5px solid #bbb",
                    background: "#fff",
                  }}
                />
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={shareOnTwitter}
                    style={{
                      fontSize: 14,
                      fontFamily: "monospace",
                      marginRight: 10,
                      border: "2px solid #b4b4b4",
                      borderRadius: 3,
                      background: "#fff",
                      boxShadow: "2px 2px 0 #c6c6c6",
                      cursor: "pointer",
                      textTransform: "lowercase",
                    }}
                  >
                    share on twitter
                  </button>
                  <button
                    onClick={reset}
                    style={{
                      fontSize: 14,
                      fontFamily: "monospace",
                      border: "2px solid #b4b4b4",
                      borderRadius: 3,
                      background: "#fff",
                      boxShadow: "2px 2px 0 #c6c6c6",
                      cursor: "pointer",
                      textTransform: "lowercase",
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
