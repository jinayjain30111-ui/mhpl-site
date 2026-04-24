(function () {
  const owners = [
    { name: "Jinay Jain", team: "PHOENIX XI", description: "Founder and CEO of MHPL. Heir of Mahadivya Textiles.", image: "images/jinay.jpeg" },
    { name: "Vyom Jain", team: "Vyom’s 15 Dhurandhar", description: "CEO of MSJ Empire.", image: "images/vj.jpeg" },
    { name: "Piyush Lodha", team: "PALTAN XI", description: "CEO of BR Traders.", image: "images/piyush.jpeg" },
    { name: "Lavish Ajmera", team: "LAVISH LEGENDS", description: "CEO of LV Frames and stakeholder of Perfect Systemz.", image: "images/la.jpeg" },
    { name: "Aditya Bista", team: "BISTA DYNASTY", description: "CEO of NM Gold and rising cricket star.", image: "images/ab.jpeg" },
    { name: "Aayush Dave", team: "DARK KNIGHTS", description: "Co-partner in Avasa Ayurveda, backed by strong political connections.", image: "images/aayush.jpeg" },
    { name: "Raahi Lakhani", team: "RAAHI STRIKERS", description: "Founder of Avasa Ayurveda and superstar of the league.", image: "images/rl.jpeg" },
    { name: "Vidit Jain", team: "FENDERLINE WARRIORS", description: "Rising tech star and CEO of Magic Lifestyle.", image: "images/vidit.jpeg" }
  ];

  let currentOwnerIndex = 0;

  function ownerAt(index) {
    const total = owners.length;
    return owners[((index % total) + total) % total];
  }

  function ownerCardHTML(owner) {
    return `
      <img src="${owner.image}" alt="${owner.name}" />
      <div class="owner-name">${owner.name}</div>
      <div class="owner-team">Owner of ${owner.team}</div>
      <div class="owner-desc">${owner.description}</div>
    `;
  }

  function renderOwners() {
    const prevCard = document.getElementById("ownerPrevCard");
    const activeCard = document.getElementById("ownerActiveCard");
    const nextCard = document.getElementById("ownerNextCard");
    if (!prevCard || !activeCard || !nextCard) return;
    prevCard.innerHTML = ownerCardHTML(ownerAt(currentOwnerIndex - 1));
    activeCard.innerHTML = ownerCardHTML(ownerAt(currentOwnerIndex));
    nextCard.innerHTML = ownerCardHTML(ownerAt(currentOwnerIndex + 1));
  }

  function stepOwners(direction) {
    const track = document.getElementById("ownersTrack");
    if (!track) return;
    track.classList.remove("slide-left", "slide-right");
    track.classList.add(direction > 0 ? "slide-left" : "slide-right");
    setTimeout(() => {
      currentOwnerIndex = (currentOwnerIndex + direction + owners.length) % owners.length;
      renderOwners();
      track.classList.remove("slide-left", "slide-right");
    }, 450);
  }

  function bindOwnersEvents() {
    const ownersBtn = document.getElementById("ownersBtn");
    const prevBtn = document.getElementById("ownersPrevBtn");
    const nextBtn = document.getElementById("ownersNextBtn");
    if (!ownersBtn) return;
    ownersBtn.addEventListener("click", () => {
      currentOwnerIndex = 0;
      renderOwners();
      window.showView("ownersView");
    });
    if (prevBtn) prevBtn.addEventListener("click", () => stepOwners(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => stepOwners(1));
  }

  window.owners = owners;
  window.bindOwnersEvents = bindOwnersEvents;
})();
