import { useState, useRef } from "react";

export default function Lens({ src }) {
  const [showLens, setShowLens] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });

  const imgRef = useRef(null);

  const lensSize = 150;
  const zoom = 2;

  const handleMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPos({ x, y });
    setSize({ w: rect.width, h: rect.height }); // ✅ simpan ukuran di state
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      onMouseMove={handleMove}
    >
      {/* IMAGE */}
      <img
        ref={imgRef}
        src={src}
        alt="zoom"
        className="w-full h-[420px] object-cover rounded-xl"
      />

      {/* LENS */}
      {showLens && (
        <div
          className="absolute rounded-full border-2 border-white shadow-xl pointer-events-none"
          style={{
            width: lensSize,
            height: lensSize,
            top: pos.y - lensSize / 2,
            left: pos.x - lensSize / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${size.w * zoom}px ${size.h * zoom}px`, // ✅ pakai state, bukan ref langsung
            backgroundPosition: `-${pos.x * zoom - lensSize / 2}px -${
              pos.y * zoom - lensSize / 2
            }px`,
          }}
        />
      )}
    </div>
  );
}
