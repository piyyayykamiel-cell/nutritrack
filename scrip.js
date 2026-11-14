document.addEventListener("DOMContentLoaded", function () {

  const $ = (id) => document.getElementById(id);

  // DATABASE MAKANAN
  const foods = {
    "burger": { emoji: "🍔", calories: 350, protein: 18, carbs: 30, fat: 19 },
    "cheeseburger": { emoji: "🍔", calories: 410, protein: 22, carbs: 33, fat: 22 },
    "nasi goreng": { emoji: "🍛", calories: 330, protein: 9, carbs: 45, fat: 14 },
    "ayam goreng": { emoji: "🍗", calories: 290, protein: 25, carbs: 8, fat: 17 },
    "mie goreng": { emoji: "🍜", calories: 380, protein: 10, carbs: 50, fat: 16 },
    "pizza": { emoji: "🍕", calories: 285, protein: 12, carbs: 36, fat: 10 },
    "sate ayam": { emoji: "🍢", calories: 290, protein: 24, carbs: 12, fat: 16 },
    "soto ayam": { emoji: "🍲", calories: 250, protein: 18, carbs: 22, fat: 10 },
    "nasi putih": { emoji: "🍚", calories: 205, protein: 4, carbs: 45, fat: 0 },
    "pisang": { emoji: "🍌", calories: 105, protein: 1, carbs: 27, fat: 0 },
    "apel": { emoji: "🍎", calories: 95, protein: 0, carbs: 25, fat: 0 },
    "salad": { emoji: "🥗", calories: 140, protein: 4, carbs: 15, fat: 7 },
    "tempe goreng": { emoji: "🍘", calories: 190, protein: 11, carbs: 9, fat: 12 }
  };

  // NOTIFIKASI
  function notify(message) {
    const toast = $("toast");

    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // PROFIL
  let profile = {};

  try {
    profile = JSON.parse(
      localStorage.getItem("nutritrack_profile")
    ) || {};
  } catch (error) {
    profile = {};
  }

  function showProfile() {
    const name = profile.name || "Pengguna";

    $("displayName").textContent = "Halo, " + name + "! 👋";
    $("avatar").textContent = name.charAt(0).toUpperCase();

    $("displayAge").textContent =
      profile.age ? profile.age + " tahun" : "-";

    $("displayHeight").textContent =
      profile.height ? profile.height + " cm" : "-";

    $("displayWeight").textContent =
      profile.weight ? profile.weight + " kg" : "-";

    $("displayGoal").textContent =
      profile.goal || "Belum diatur";
  }

  // BUKA FORM PROFIL
  function openProfile() {
    $("name").value = profile.name || "";
    $("age").value = profile.age || "";
    $("height").value = profile.height || "";
    $("weight").value = profile.weight || "";

    $("goal").value =
      profile.goal || "Memahami kandungan nutrisi";

    $("profileModal").classList.remove("hidden");
  }

  $("editProfile").addEventListener("click", openProfile);

  $("closeModal").addEventListener("click", function () {
    $("profileModal").classList.add("hidden");
  });

  $("profileModal").addEventListener("click", function (event) {
    if (event.target === $("profileModal")) {
      $("profileModal").classList.add("hidden");
    }
  });

  // SIMPAN PROFIL
  $("profileForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = $("name").value.trim();
    const age = $("age").value;
    const height = $("height").value;
    const weight = $("weight").value;

    if (!name) {
      notify("Nama harus diisi!");
      return;
    }

    if (age && (Number(age) < 1 || Number(age) > 120)) {
      notify("Periksa umur yang dimasukkan.");
      return;
    }

    if (height && (Number(height) < 1 || Number(height) > 250)) {
      notify("Periksa tinggi badan.");
      return;
    }

    if (weight && (Number(weight) < 1 || Number(weight) > 500)) {
      notify("Periksa berat badan.");
      return;
    }

    profile = {
      name: name,
      age: age,
      height: height,
      weight: weight,
      goal: $("goal").value
    };

    try {
      localStorage.setItem(
        "nutritrack_profile",
        JSON.stringify(profile)
      );
    } catch (error) {
      notify("Profil gagal disimpan.");
      return;
    }

    showProfile();

    $("profileModal").classList.add("hidden");

    notify("Profil berhasil disimpan!");
  });

  // UPLOAD FOTO
  let imageUrl = null;

  function openFilePicker(camera) {
    const input = $("foodImage");

    input.value = "";

    if (camera) {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }

    input.click();
  }

  $("uploadButton").addEventListener("click", function () {
    openFilePicker(false);
  });

  $("cameraButton").addEventListener("click", function () {
    openFilePicker(true);
  });

  // PREVIEW FOTO
  $("foodImage").addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Silakan pilih foto makanan.");
      this.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      notify("Ukuran foto maksimal 8 MB.");
      this.value = "";
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    imageUrl = URL.createObjectURL(file);

    $("previewImage").src = imageUrl;

    $("uploadEmpty").classList.add("hidden");
    $("previewWrap").classList.remove("hidden");

    notify("Foto berhasil dimasukkan!");
  });

  // HAPUS FOTO
  function removePhoto() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      imageUrl = null;
    }

    $("foodImage").value = "";
    $("previewImage").removeAttribute("src");

    $("previewWrap").classList.add("hidden");
    $("uploadEmpty").classList.remove("hidden");
  }

  $("removeImage").addEventListener("click", removePhoto);

  // SARAN MAKANAN
  $("foodSuggestions").innerHTML =
    Object.keys(foods)
      .map(name => `<option value="${name}"></option>`)
      .join("");

  // ANALISIS KALORI
  function analyzeFood() {
    const name = $("foodName").value
      .trim()
      .toLowerCase();

    if (!name) {
      notify("Masukkan nama makanan terlebih dahulu!");
      $("foodName").focus();
      return;
    }

    const food = foods[name];

    if (!food) {
      notify("Makanan belum tersedia di database.");
      return;
    }

    const portion = Number($("portion").value);

    const calories = Math.round(food.calories * portion);
    const protein = Math.round(food.protein * portion * 10) / 10;
    const carbs = Math.round(food.carbs * portion * 10) / 10;
    const fat = Math.round(food.fat * portion * 10) / 10;

    $("foodEmoji").textContent = food.emoji;

    $("resultName").textContent =
      foodNameDisplay(name);

    $("resultPortion").textContent =
      portion + " Porsi";

    $("resultCalories").textContent =
      calories.toLocaleString("id-ID");

    $("resultProtein").textContent = protein + " g";
    $("resultCarbs").textContent = carbs + " g";
    $("resultFat").textContent = fat + " g";

    $("resultSection").classList.remove("hidden");

    $("resultSection").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function foodNameDisplay(name) {
    return foods[name].name || 
      name.replace(/\b\w/g, letter => letter.toUpperCase());
  }

  // TOMBOL ANALISIS
  $("analyzeButton").addEventListener("click", analyzeFood);

  $("foodName").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      analyzeFood();
    }
  });

  // SCAN ULANG
  $("scanAgain").addEventListener("click", function () {
    $("resultSection").classList.add("hidden");

    $("foodName").value = "";
    $("portion").value = "1";

    removePhoto();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // TAMPILKAN PROFIL
  showProfile();

  // BUKA FORM JIKA PROFIL BELUM ADA
  if (!profile.name) {
    openProfile();
  }

  console.log("NutriTrack berhasil dijalankan!");

});
