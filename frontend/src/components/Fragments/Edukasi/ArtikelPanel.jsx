import React, { useState } from "react";
import Artikel from "./Artikel";

export default function ArtikelPanel({ artikel, onSelect, artikelRefs }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-6 h-[420px] mb-30 text-white">
      {artikel.map((item, index) => (
        <Artikel
          key={index}
          ref={(el) => (artikelRefs.current[index] = el)}
          item={item}
          index={index}
          active={active}
          setActive={setActive}
          onSelect={() => onSelect(item, index)}
        />
      ))}
    </div>
  );
}
