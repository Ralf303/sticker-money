async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEmojiNumber(number: number) {
  switch (number) {
    case 1:
      return "1️⃣";
    case 2:
      return "2️⃣";
    case 3:
      return "3️⃣";
    case 4:
      return "4️⃣";
    case 5:
      return "5️⃣";
    case 6:
      return "6️⃣";

    default:
      return "";
  }
}

export { sleep, getEmojiNumber };
