// Drag-to-scroll روی لیست
(function () {
  const scroller = document.querySelector(".team-list");
  if (!scroller) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  scroller.addEventListener("mousedown", (e) => {
    isDown = true;
    scroller.classList.add("is-dragging");
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    scroller.classList.remove("is-dragging");
  });

  scroller.addEventListener("mouseleave", () => {
    isDown = false;
    scroller.classList.remove("is-dragging");
  });

  scroller.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startX) * 1; // سرعت درگ
    scroller.scrollLeft = scrollLeft - walk;
  });

  // درگ لمسی (موبایل) خود مرورگر انجام می‌شود؛ نیازی به کد اضافه نیست.
})();
