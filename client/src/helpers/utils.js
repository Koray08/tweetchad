export const focus = (el) => {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const dateCalculator = (date) => {
  const now = new Date();
  const messageTime = new Date(date);
  const diffInMilliseconds = now.getTime() - messageTime.getTime();
  const diffInSeconds = Math.round(diffInMilliseconds / 1000);
  const diffInMinutes = Math.round(diffInMilliseconds / 60000);
  const diffInHours = Math.round(diffInMilliseconds / 3600000);

  let elapsedTime;
  if (diffInSeconds < 60) {
    elapsedTime = diffInSeconds + "s";
  } else if (diffInMinutes < 60) {
    elapsedTime = diffInMinutes + "m";
  } else if (diffInHours < 24) {
    elapsedTime = diffInHours + "h";
  } else {
    const messageYear = messageTime.getFullYear();
    const currentYear = now.getFullYear();
    const showYear = messageYear !== currentYear;
    const dateOptions = {
      month: "short",
      day: "numeric",
    };
    if (showYear) {
      dateOptions.year = "numeric";
    }
    elapsedTime = messageTime
      .toLocaleString(undefined, dateOptions)
      .split(" ")
      .reverse()
      .join(" ");
  }
  return elapsedTime;
};
