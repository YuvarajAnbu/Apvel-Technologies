const header = document.querySelector("header");
const openNav = document.querySelector(".open-nav");
const closeNav = document.querySelectorAll(".close-nav");
const navLinks = document.querySelectorAll("header ul li, .landing button");

const openSidebar = () => {
  document.body.style.overflowY = "hidden";
  document.documentElement.style.overflowY = "hidden";
  header.classList.add("active");
};
const closeSidebar = () => {
  document.body.style.overflowY = "auto";
  document.documentElement.style.overflowY = "auto";
  header.classList.remove("active");
};

//navlinks scroll to container on click
navLinks.forEach((el) => {
  el.addEventListener("click", () => {
    document
      .getElementById(el.getAttribute("data-target"))
      .scrollIntoView({ behavior: "smooth" });
    closeSidebar();
  });
});

//open and close sidebar
openNav.addEventListener("click", openSidebar);
closeNav.forEach((el) => {
  el.addEventListener("click", closeSidebar);
});

//close sidebar if user resizes
window.addEventListener("resize", () => {
  if (
    document.querySelector("header").classList.contains("active") &&
    window.innerWidth > 1050
  ) {
    closeSidebar();
  }
});

//current year for footer copyright
document.querySelector(".year").innerHTML = new Date().getFullYear();

//localization
const selectContainer = document.querySelector(".locale");
const selectBtn = document.querySelector(".locale .btn");
const selectBtnSpan = document.querySelector(".locale .btn span");
const optionsContainer = document.querySelector(".locale .options");

const locales = ["en", "fr"]; //supported locales
let locale = "fr"; //current locale

// When the page content is ready...
document.addEventListener("DOMContentLoaded", async () => {
  // Translate the page to the default locale or locale saved in local-storage
  let sLocale = localStorage.getItem("locale");
  if (sLocale) locale = sLocale;

  //populate options on locale dropdown
  locales.forEach((el) => {
    if (el === locale) {
      selectBtnSpan.innerText = locale;
    } else {
      let option = document.createElement("li");
      option.innerText = el;
      optionsContainer.append(option);
    }
  });
  document.body.classList.add("hide");
  await translate();
  document.body.classList.remove("hide");
});

async function translate() {
  try {
    // loading json file
    const resp = await fetch(`/lang/${locale}.json`);
    const translations = await resp.json();

    //saving selected locale to cookie
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;

    //getting all element with attributes
    document.querySelectorAll("[data-i18n-key]").forEach((el) => {
      //getting its key
      const key = el.getAttribute("data-i18n-key");
      //getting translation text
      const translation = translations[key];
      //populating translation
      el.innerText = translation;
    });

    //getting all element with placeholder attributes
    document.querySelectorAll("[data-i18n-key-ph]").forEach((el) => {
      //getting its key
      const key = el.getAttribute("data-i18n-key-ph");
      //getting translation text
      const translation = translations[key];
      //populating translation
      el.placeholder = `${translation} ${el.required ? "*" : ""}`;
    });
  } catch (err) {
    console.log(err);
  }
}

selectBtn.addEventListener("click", () => {
  selectContainer.classList.toggle("open");
});

selectContainer.addEventListener("blur", (e) => {
  selectContainer.classList.remove("open");
});

optionsContainer.addEventListener("click", (e) => {
  //setting locale
  locale = e.target.innerHTML.trim();
  //changing span and clicked options innertext
  e.target.innerHTML = selectBtnSpan.innerHTML;
  selectBtnSpan.innerHTML = locale;
  selectContainer.classList.remove("open");

  //translating
  translate();
});
