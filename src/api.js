const API_KEY =
  "57dacf67302e99a8132ffe6fa5ea37a808510f05d9e17c42827cebcafcb98d00";
const AGGREGATE_INDEX = "5";
const INVALID_SUB_INDEX = "500";

const tickersHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (e) => {
  let {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);

  if (
    (type !== AGGREGATE_INDEX && type !== INVALID_SUB_INDEX) ||
    (newPrice === undefined && type !== INVALID_SUB_INDEX)
  ) {
    return;
  }

  if (type === INVALID_SUB_INDEX) {
    currency = JSON.parse(e.data).PARAMETER;
    currency = currency.split("~")[2];
    newPrice = "-";
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice, type));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeToTickerOnWs(ticker);
};

export const getAllTickers = async () => {
  const { Data } = await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=57dacf67302e99a8132ffe6fa5ea37a808510f05d9e17c42827cebcafcb98d00"
  ).then((res) => res.json());

  return Data;
};

// Object.entries -> {a: 1, b: 2} => [['a', 1], ['b', 2]]
// Object.fromEntries -> [['a', 1], ['b', 2]] =>  {a: 1, b: 2}
