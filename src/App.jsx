import React, { useRef, useState } from 'react';

// Your NFT pool: name + image URL (add more as needed)
const NFT_POOL = [
  {
    name: 'Bored Ape Yacht Club',
    img: 'https://i.imgur.com/YOUR_BAYC_IMAGE.png',
    caption: 'You are pure bluechip energy.'
  },
  {
    name: 'CryptoPunk',
    img: 'https://i.imgur.com/YOUR_PUNK_IMAGE.png',
    caption: 'Vintage JPEG. You were here before it was cool.'
  },
  {
    name: 'Pepe NFT',
    img: 'https://i.imgur.com/YOUR_PEPE_IMAGE.png',
    caption: 'Meme royalty. Touch grass!'
  },
  // Add more NFT options here!
];

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [nft, setNft] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // Start camera
  const startCamera = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Take photo
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 300, 225);
    const dataUrl = canvas.toDataURL();
    setPhoto(dataUrl);

    // Random NFT
    const randomNFT = NFT_POOL[Math.floor(Math.random() * NFT_POOL.length)];
    setNft(randomNFT);

    // Stop camera
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // Reset everything
  const reset = () => {
    setPhoto(null);
    setNft(null);
  };

  // Twitter share link
  const getTwitterLink = () => {
    const text = encodeURIComponent(
      `I just found out I'm a "${nft?.name}" NFT! 😂 Try it yourself: [your site link here]`
    );
    return `https://twitter.com/intent/tweet?text=${text}`;
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: 40 }}>
      <h1>Which NFT Are You?</h1>
      {!photo && !showCamera && (
        <button onClick={startCamera} style={{ fontSize: 20, padding: 12 }}>
          📸 Take a Selfie
        </button>
      )}
      {showCamera && (
        <div>
          <video ref={videoRef} width="300" height="225" style={{ borderRadius: 12 }} autoPlay />
          <br />
          <button onClick={takePhoto} style={{ fontSize: 20, padding: 12, marginTop: 8 }}>
            Snap!
          </button>
        </div>
      )}
      <canvas ref={canvasRef} width="300" height="225" style={{ display: 'none' }} />

      {photo && nft && (
        <div style={{ marginTop: 30 }}>
          <img src={photo} alt="Your selfie" width="200" style={{ borderRadius: 12 }} />
          <div style={{ margin: '20px 0' }}>
            <strong style={{ fontSize: 22 }}>{nft.name}</strong>
            <br />
            <img src={nft.img} alt={nft.name} width="120" style={{ borderRadius: 10, margin: '12px 0' }} />
            <div style={{ fontSize: 16, color: '#888', margin: '10px 0' }}>{nft.caption}</div>
          </div>
          <a
            href={getTwitterLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#1da1f2', color: 'white', padding: '10px 22px', borderRadius: 8, textDecoration: 'none',
              fontSize: 17, marginRight: 12
            }}
          >
            Share on Twitter
          </a>
          <a
            href="https://twitter.com/YOUR_TWITTER_HANDLE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#eee', color: '#111', padding: '10px 22px', borderRadius: 8, textDecoration: 'none',
              fontSize: 17, marginRight: 12
            }}
          >
            Follow me
          </a>
          <button onClick={reset} style={{ fontSize: 16, marginLeft: 8, marginTop: 8 }}>Try Again</button>
          <div style={{ marginTop: 18, fontSize: 15, color: '#888' }}>
            Donate: <span style={{ fontFamily: 'monospace' }}>0xYourWalletAddressHere</span>
          </div>
        </div>
      )}
    </div>
  );
}
