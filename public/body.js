const now = new Date();

const $input = document.getElementById("position-input");

const onChange = () => {
  const value = $input.value;
  const id = parseInt(value);
  const $el = document.querySelector(`#position-${id}`);

  document.querySelectorAll("[id^='position-']").forEach((el) => {
    el.classList.remove("panel-alt");
  });

  if (id >= 0 && id <= 959 && $el) {
    window.history.pushState({}, "", `#position-${id}`);
    const elementY = window.pageYOffset + $el.getBoundingClientRect().top;
    const offset = 100;
    window.scrollTo({
      top: elementY - offset,
      behavior: "smooth",
    });

    $el.classList.add("panel-alt");
  } else {
    window.history.pushState({}, "", ``);
  }
};

document.fonts.ready.then(() => {
  document.body.classList.add("font-loaded");
});

if ($input) {
  $input.addEventListener("input", onChange);
  $input.addEventListener("keydown", onChange);
  $input.addEventListener("blur", onChange);
}
