import "./css/index.css"
import IMask from "imask"

const colors = {
  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#DF6F29", "#C69347"],
  default: ["black", "gray"],
}

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

window.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const ccSecurity = document.querySelector(".cc-security .value")
securityCodeMasked.on("accept", () => {
  ccSecurity.innerText = securityCodeMasked.value.length
    ? securityCodeMasked.value
    : "123"
})

const expirationDate = document.querySelector("#expiration-date")
const expirationDataPattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: new Date().getFullYear() % 100,
      to: (new Date().getFullYear() % 100) + 5,
    },
  },
}
const expirationDataMasked = IMask(expirationDate, expirationDataPattern)

const ccExpiration = document.querySelector(".cc-expiration .value")
expirationDataMasked.on("accept", () => {
  ccExpiration.innerText = expirationDataMasked.value.length
    ? expirationDataMasked.value
    : "02/32"
})

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    return dynamicMasked.compiledMasks.find(({ regex }) => {
      return number.match(regex)
    })
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const ccNumber = document.querySelector(".cc-number")
cardNumberMasked.on("accept", () => {
  setCardType(cardNumberMasked.masked.currentMask.cardtype)

  ccNumber.innerText = cardNumberMasked.value.length
    ? cardNumberMasked.value
    : "1234 5678 9012 3456"
})

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (event) => {
  event.preventDefault()
  console.log("Hello, world!")
})

const ccHolder = document.querySelector(".cc-holder .value")
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  ccHolder.innerText = cardHolder.value.length
    ? cardHolder.value
    : "Fulano da Silva"
})
