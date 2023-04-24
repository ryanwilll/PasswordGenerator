const outputPasswordEl = document.querySelector("#password");
const passwordLengthEl = document.querySelector("#password-length");
const copyButtonEl = document.querySelector("#btn-copy");
const renewPasswordEl = document.querySelector("#renew");
const upperCaseCheckEl = document.querySelector("#uppercase-check");
const numberCheckEl = document.querySelector("#numbers-check");
const symbolCheckEl = document.querySelector("#symbol-check");
const indicatorBarEl = document.querySelector("#security-indicator-bar");

let passwordLength = 16;

copyButtonEl.addEventListener("click", copy);
renewPasswordEl.addEventListener("click", generatePassword);

passwordLengthEl.addEventListener("input", () => {
  const outputPasswordTextEl = document.querySelector("#password-length-text");
  passwordLength = passwordLengthEl.value;
  outputPasswordTextEl.innerText = passwordLength;
  generatePassword();
});

upperCaseCheckEl.addEventListener("click", generatePassword);
numberCheckEl.addEventListener("click", generatePassword);
symbolCheckEl.addEventListener("click", generatePassword);

function generatePassword() {
  let chars = "abcdefghjkmnpqrstuvwxyz";
  const upperCaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbersChars = "123456789";
  const symbolChars = "?!@&*()[]";

  if (upperCaseCheckEl.checked) {
    chars += upperCaseChars;
  }
  if (numberCheckEl.checked) {
    chars += numbersChars;
  }
  if (symbolCheckEl.checked) {
    chars += symbolChars;
  }

  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  outputPasswordEl.value = password;
  verifySecurity();
  calculateFontSize();
}

function verifySecurity() {
  // 20% Crítico ->  90% Safe

  let percent = Math.round(
    (passwordLength / 64) * 25 +
      (upperCaseCheckEl.checked ? 20 : 0) +
      (numberCheckEl.checked ? 25 : 0) +
      (symbolCheckEl.checked ? 30 : 0)
  );

  switch (true) {
    case passwordLength < 10:
      percent -= 50;
      break;
    case passwordLength < 15:
      percent -= 20;
      break;
    case passwordLength < 25:
      percent -= 5;
      break;
    case passwordLength == 64:
      percent = percent;
      break;
  }

  indicatorBarEl.style.width = `${percent}%`;

  switch (true) {
    case percent == 100:
      indicatorBarEl.classList.add("safe", "completed");
      indicatorBarEl.classList.remove("warning", "critical");
      break;
    case percent > 69:
      indicatorBarEl.classList.add("safe");
      indicatorBarEl.classList.remove("warning", "critical", "completed");
      break;
    case percent > 50:
      indicatorBarEl.classList.add("warning");
      indicatorBarEl.classList.remove("safe", "critical", "completed");
      break;
    default:
      indicatorBarEl.classList.add("critical");
      indicatorBarEl.classList.remove("safe", "warning", "completed");
      break;
  }
}

function calculateFontSize() {
  switch (true) {
    case passwordLength > 45:
      outputPasswordEl.classList.add("font-xxs");
      outputPasswordEl.classList.remove("font-sm", "font-xs");
      break;
    case passwordLength > 32:
      outputPasswordEl.classList.add("font-xs");
      outputPasswordEl.classList.remove("font-sm", "font-xxs");
      break;
    case passwordLength > 22:
      outputPasswordEl.classList.add("font-sm");
      outputPasswordEl.classList.remove("font-xs", "font-xxs");
      break;
    default:
      outputPasswordEl.classList.remove("font-sm", "font-xs", "font-xxs");
      break;
  }
}

function copy() {
  navigator.clipboard.writeText(outputPasswordEl.value);
}

generatePassword();

tippy("#renew", {
  content: "Gerar Novamente",
});
tippy("#btn-copy", {
  content: "Copiar Senha",
});
