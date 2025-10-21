
import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && container.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "OANDA:XAUUSD",
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": true,
          "studies": [
            "RSI",
            "MASimple@tv-basicstudies",
            "MACD@tv-basicstudies"
          ],
          "container_id": "tradingview-widget-container"
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container h-[500px] md:h-[600px] bg-dark-secondary rounded-lg overflow-hidden shadow-2xl border border-dark-tertiary" id="tradingview-widget-container-wrapper">
      <div id="tradingview-widget-container" ref={container} className="h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
