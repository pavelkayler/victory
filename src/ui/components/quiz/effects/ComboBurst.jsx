import { useEffect, useMemo, useRef } from "react";

import { launchComboConfetti } from "./comboConfetti.js";

const ComboBurst = ({ streak, visible }) => {
  const comboRef = useRef(null);
  const prevStreakRef = useRef(streak);

  const toneClass = useMemo(() => {
    if (streak >= 10) return "combo-burst--orange";
    if (streak >= 8) return "combo-burst--amber";
    if (streak >= 4) return "combo-burst--yellow";
    return "combo-burst--green";
  }, [streak]);

  useEffect(() => {
    const prev = prevStreakRef.current;

    if (
      visible &&
      streak >= 10 &&
      comboRef.current &&
      (prev < 10 || streak % 5 === 0)
    ) {
      const rect = comboRef.current.getBoundingClientRect();
      const origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };

      launchComboConfetti({
        particleCount: 60,
        spread: 60,
        startVelocity: 18,
        origin,
      });
    }

    prevStreakRef.current = streak;
  }, [streak, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      key={streak}
      ref={comboRef}
      className={`combo-burst ${toneClass}`}
    >
      <div className="combo-burst__content">
        <i className="bi bi-fire combo-burst__icon" aria-hidden />
        <div className="combo-burst__text">
          <div className="combo-burst__label">Серия</div>
          <div className="combo-burst__value">x{streak}</div>
        </div>
      </div>
    </div>
  );
};

export { ComboBurst };
