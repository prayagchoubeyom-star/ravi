'use client';

import React, { useEffect, useRef, memo } from 'react';

type TradingViewWidgetProps = {
    symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous widget
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": false,
        "style": "1",
        "symbol": "BINANCE:${symbol}",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "rgba(0,0,0,0)",
        "gridColor": "rgba(255, 255, 255, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "autosize": true
      }`;
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" style={{ height: "100%", width: "100%" }} ref={container}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export const MemoizedTradingViewWidget = memo(TradingViewWidget);
export { TradingViewWidget };
