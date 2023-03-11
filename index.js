const API_KEY = "029b0458ba11858836e0cfb9";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

async function getSupportedCoded() {
  try {
    const response = await fetch(`${BASE_URL}/codes`);
    if (response.ok) {
      const data = await response.json();
      const codes = data["supported_codes"];

      return codes;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

// getSupportedCoded().then((result) => console.log(result));

async function getConversionRate(baseCodes, targetCodes) {
  try {
    const response = await fetch(
      `${BASE_URL}/pair/${baseCodes}/${targetCodes}`
    );
    if (response.ok) {
      const data = await response.json();
      const rate = data["conversion_rate"];

      return rate;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// getConversionRate("EUR", "GBP").then((result) => console.log(result));

const aCurrency = document.querySelector("#aCurrency");
const bCurrency = document.querySelector("#bCurrency");
const baseAmount = document.querySelector("#base-amount");
const baseCode = document.querySelector("#base-code");
const targetAmount = document.querySelector("#target-amount");
const targetCode = document.querySelector("#target-code");

const ErrorMsg = document.querySelector(".error-message");

let supportedCodeds = [];
let conversionRate = 0;

const updateExchangeRate = async () => {
  const baseCodeMain = baseCode.value;
  const targetCodeMain = targetCode.value;

  ErrorMsg.textContent = ".....Loading data";
  conversionRate = await getConversionRate(baseCodeMain, targetCodeMain);

  if (conversionRate === 0) {
    ErrorMsg.textContent = "There is no conversionrate";
    return;
  }

  ErrorMsg.textContent = "";
  const baseName = supportedCodeds.find((code) => code[0] === baseCodeMain)[1];
  const targetName = supportedCodeds.find(
    (code) => code[0] === targetCodeMain
  )[1];

  aCurrency.textContent = `1 ${baseName} equal`;
  bCurrency.textContent = `${conversionRate} ${targetName}`;
};

const intialize = async () => {
  //get suppported code from API
  ErrorMsg.textContent = ".....Loading data";
  supportedCodeds = await getSupportedCoded();

  if (!supportedCodeds.length) {
    ErrorMsg.textContent = "No supported Codeds";
    return;
  }

  ErrorMsg.textContent = "";

  // Put option into the select box
  supportedCodeds.forEach((code) => {
    const baseOption = document.createElement("option");
    baseOption.value = code[0];
    baseOption.textContent = code[1];
    baseCode.appendChild(baseOption);
  });

  supportedCodeds.forEach((code) => {
    const targetOption = document.createElement("option");
    targetOption.value = code[0];
    targetOption.textContent = code[1];
    targetCode.appendChild(targetOption);
  });

  // VND & USD default
  baseCode.value = "VND";
  targetCode.value = "USD";

  //update conversionRate
  await updateExchangeRate();
};

baseCode.addEventListener("change", updateExchangeRate);
targetCode.addEventListener("change", updateExchangeRate);

baseAmount.addEventListener("input", () => {
  targetAmount.value =
    Math.round(baseAmount.value * conversionRate * 10 ** 3) / 10 ** 3;
});

targetAmount.addEventListener("input", () => {
  baseAmount.value =
    Math.round((targetAmount.value / conversionRate) * 10 ** 3) / 10 ** 3;
});

intialize();
