(function () {
  async function loadDataFromFirebase() {
    try {
      if (!window.db) return;
      const docRef = await window.db.collection("mhpl").doc("main").get();

      if (docRef.exists) {
        const data = docRef.data();
        window.isLocked = data?.isLocked ?? false;
        if (typeof window.applyFirebaseData === "function") {
          window.applyFirebaseData(data);
        }
        if (typeof data?.isLocked === "boolean" && typeof window.setLockedState === "function") {
          window.setLockedState(data.isLocked);
        }
        console.log("Firebase LOAD working");
        if (typeof window.renderAll === "function") {
          window.renderAll();
        }
      } else {
        console.log("No Firebase data found (first run)");
      }
    } catch (error) {
      console.error("Firebase load failed", error);
    }
  }

  async function saveDataToFirebase() {
    try {
      if (!window.db) return;
      await window.db.collection("mhpl").doc("main").set({
        teams: window.enrichedTeams || [],
        playerStats: window.playerStats || {},
        isLocked: !!window.isLocked
      });
      console.log("Firebase SAVE working");
    } catch (error) {
      console.error("Firebase save failed", error);
    }
  }

  window.loadDataFromFirebase = loadDataFromFirebase;
  window.saveDataToFirebase = saveDataToFirebase;
})();
