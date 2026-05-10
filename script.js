(function () {
  const body = document.body;
  const opening = document.getElementById("opening");
  const beginBtn = document.getElementById("beginBtn");
  const main = document.getElementById("main");
  const audio = document.getElementById("bgm");
  const audioHint = document.getElementById("audioHint");
  const audioToast = document.getElementById("audioToast");
  const musicToggle = document.getElementById("musicToggle");
  const printCertificate = document.getElementById("printCertificate");
  const kickArea = document.getElementById("kickArea");
  const kickProgress = document.getElementById("kickProgress");
  const kickMessages = document.getElementById("kickMessages");
  const kickFinal = document.getElementById("kickFinal");
  const resetKicks = document.getElementById("resetKicks");
  const celebrationLayer = document.getElementById("celebrationLayer");
  const hugBtn = document.getElementById("hugBtn");
  const hugPopup = document.getElementById("hugPopup");
  const closeHug = document.getElementById("closeHug");

  const kickTexts = [
    "That was me saying hi.",
    "That was me asking for biryani.",
    "That was me saying I love you.",
    "That was me kicking Baba for annoying you.",
    "That was me practicing for the outside world."
  ];

  let started = false;
  let musicAvailable = true;
  let kickCount = 0;

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setupImageFallbacks() {
    document.querySelectorAll(".image-shell img").forEach((img) => {
      img.addEventListener("error", () => {
        const shell = img.closest(".image-shell");
        if (shell) shell.classList.add("missing");
      });
    });
  }

  async function startMusic() {
    audio.volume = 0.35;
    audio.loop = true;

    try {
      await audio.play();
      musicAvailable = true;
      musicToggle.hidden = false;
      musicToggle.classList.remove("muted");
      musicToggle.setAttribute("aria-label", "Pause music");
      musicToggle.setAttribute("aria-pressed", "true");
      audioHint.textContent = "";
    } catch (error) {
      musicAvailable = false;
      musicToggle.hidden = true;
      audioHint.textContent = "Tap to begin the letter and music.";
      audioToast.textContent = "Tap to begin the letter and music.";
      audioToast.hidden = false;
      window.setTimeout(() => {
        audioToast.hidden = true;
      }, 5200);
    }
  }

  function beginSite() {
    if (started) return;
    started = true;
    startMusic();
    opening.classList.add("hidden");
    body.classList.remove("locked");
    main.removeAttribute("aria-hidden");
    window.setTimeout(() => {
      opening.setAttribute("aria-hidden", "true");
    }, 900);
  }

  function toggleMusic() {
    if (!musicAvailable) return;

    if (audio.paused) {
      audio.play().then(() => {
        musicToggle.classList.remove("muted");
        musicToggle.setAttribute("aria-label", "Pause music");
        musicToggle.setAttribute("aria-pressed", "true");
      }).catch(() => {
        musicAvailable = false;
        musicToggle.hidden = true;
      });
    } else {
      audio.pause();
      musicToggle.classList.add("muted");
      musicToggle.setAttribute("aria-label", "Play music");
      musicToggle.setAttribute("aria-pressed", "false");
    }
  }

  function setupReveals() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
  }

  function randomKickPosition() {
    const maxX = Math.max(0, kickArea.clientWidth - 70);
    const maxY = Math.max(0, kickArea.clientHeight - 70);
    return {
      left: Math.round(16 + Math.random() * Math.max(0, maxX - 32)),
      top: Math.round(16 + Math.random() * Math.max(0, maxY - 32))
    };
  }

  function placeKick() {
    kickArea.innerHTML = "";
    if (kickCount >= kickTexts.length) return;

    const kick = document.createElement("button");
    const pos = randomKickPosition();
    kick.type = "button";
    kick.className = "kick-dot";
    kick.style.left = `${pos.left}px`;
    kick.style.top = `${pos.top}px`;
    kick.setAttribute("aria-label", `Baby kick ${kickCount + 1}`);
    kick.addEventListener("click", tapKick);
    kickArea.appendChild(kick);
  }

  function tapKick() {
    if (kickCount >= kickTexts.length) return;

    const message = document.createElement("div");
    message.className = "kick-message";
    message.textContent = kickTexts[kickCount];
    kickMessages.appendChild(message);

    kickCount += 1;
    kickProgress.textContent = `Kicks tapped: ${kickCount} / ${kickTexts.length}`;

    if (kickCount === kickTexts.length) {
      kickArea.innerHTML = "";
      kickFinal.hidden = false;
      celebrateHearts(34);
    } else {
      placeKick();
    }
  }

  function resetKickGame() {
    kickCount = 0;
    kickMessages.innerHTML = "";
    kickFinal.hidden = true;
    kickProgress.textContent = `Kicks tapped: 0 / ${kickTexts.length}`;
    placeKick();
  }

  function celebrateHearts(count) {
    if (reducedMotion()) return;

    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");
      heart.className = "heart";
      heart.textContent = Math.random() > 0.35 ? "♡" : "♥";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty("--heart-x", `${Math.random() * 180 - 90}px`);
      heart.style.setProperty("--heart-time", `${3.2 + Math.random() * 2.6}s`);
      heart.style.animationDelay = `${Math.random() * 0.9}s`;
      celebrationLayer.appendChild(heart);
      window.setTimeout(() => heart.remove(), 7000);
    }
  }

  function showHug() {
    hugPopup.hidden = false;
    celebrateHearts(24);
    closeHug.focus();
  }

  function closeHugPopup() {
    hugPopup.hidden = true;
    hugBtn.focus();
  }

  setupImageFallbacks();
  setupReveals();
  placeKick();

  beginBtn.addEventListener("click", beginSite);
  opening.addEventListener("click", beginSite);
  opening.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      beginSite();
    }
  });
  musicToggle.addEventListener("click", toggleMusic);
  printCertificate.addEventListener("click", () => window.print());
  resetKicks.addEventListener("click", resetKickGame);
  hugBtn.addEventListener("click", showHug);
  closeHug.addEventListener("click", closeHugPopup);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !hugPopup.hidden) {
      closeHugPopup();
    }
  });
}());
