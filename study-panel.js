"use strict";
const panel = document.getElementById("study-panel");
const title = document.getElementById("study-title");
const triggers = [...document.querySelectorAll("[data-study]")];
const search = document.getElementById("glossary-search");
const terms = [...document.querySelectorAll(".glossary-list > div")];
let opener = null;
function closeStudy() {
  panel.hidden = true;
  document.body.classList.remove("study-open");
  triggers
    .filter((button) => button.hasAttribute("aria-expanded"))
    .forEach((button) => button.setAttribute("aria-expanded", "false"));
  opener?.focus();
}
function openStudy(mode, button) {
  if (!panel.contains(button)) opener = button;
  panel.hidden = false;
  document.body.classList.add("study-open");
  document.getElementById("study-script").hidden = mode !== "script";
  document.getElementById("study-glossary").hidden = mode !== "glossary";
  title.textContent = mode === "script" ? "발표 스크립트" : "용어 사전";
  triggers.forEach((control) => {
    const attribute = control.hasAttribute("aria-pressed")
      ? "aria-pressed"
      : "aria-expanded";
    control.setAttribute(attribute, String(control.dataset.study === mode));
  });
  panel.querySelector(".study-body").scrollTop = 0;
  if (mode === "glossary") search.focus();
  else title.focus();
}
triggers.forEach((button) =>
  button.addEventListener("click", () =>
    openStudy(button.dataset.study, button),
  ),
);
document.getElementById("study-close").addEventListener("click", closeStudy);
document.addEventListener("keydown", (event) => {
  if (panel.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeStudy();
  }
  // Small screens show the companion alone; keep keyboard focus in its visible controls.
  if (event.key === "Tab" && window.matchMedia("(max-width:1199px)").matches) {
    const controls = [
      ...panel.querySelectorAll("button, a[href], input"),
    ].filter((item) => item.getClientRects().length);
    const first = controls[0],
      last = controls[controls.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first || document.activeElement === title)
    ) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
panel.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width:1199px)").matches) closeStudy();
  }),
);
function filterTerms() {
  const query = search.value.trim().toLocaleLowerCase("ko");
  let visible = 0;
  terms.forEach((term) => {
    term.hidden = !term.textContent.toLocaleLowerCase("ko").includes(query);
    if (!term.hidden) visible++;
  });
  document.getElementById("glossary-count").textContent = visible
    ? `${terms.length}개 용어 중 ${visible}개 표시`
    : "검색 결과가 없습니다. 다른 단어를 입력해 보세요.";
}
search.addEventListener("input", filterTerms);
filterTerms();
