// DATABASE CONTOH MAKANAN

const foodDatabase = {
  "burger": {
    name: "Burger",
    emoji: "🍔",
    calories: 350,
    protein: 18,
    carbs: 30,
    fat: 19
  },

  "cheeseburger": {
    name: "Cheeseburger",
    emoji: "🍔",
    calories: 410,
    protein: 22,
    carbs: 33,
    fat: 22
  },

  "nasi goreng": {
    name: "Nasi Goreng",
    emoji: "🍛",
    calories: 330,
    protein: 9,
    carbs: 45,
    fat: 14
  },

  "ayam goreng": {
    name: "Ayam Goreng",
    emoji: "🍗",
    calories: 290,
    protein: 25,
    carbs: 8,
    fat: 17
  },

  "mie goreng": {
    name: "Mie Goreng",
    emoji: "🍜",
    calories: 380,
    protein: 10,
    carbs: 50,
    fat: 16
  },

  "pizza": {
    name: "Pizza",
    emoji: "🍕",
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10
  },

  "sate ayam": {
    name: "Sate Ayam",
    emoji: "🍢",
    calories: 290,
    protein: 24,
    carbs: 12,
    fat: 16
  },

  "soto ayam": {
    name: "Soto Ayam",
    emoji: "🍲",
    calories: 250,
    protein: 18,
    carbs: 22,
    fat: 10
  },

  "nasi putih": {
    name: "Nasi Putih",
    emoji: "🍚",
    calories: 205,
    protein: 4,
    carbs: 45,
    fat: 0
  },

  "pisang": {
    name: "Pisang",
    emoji: "🍌",
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0
  },

  "apel": {
    name: "Apel",
    emoji: "🍎",
    calories: 95,
    protein: 0,
    carbs: 25,
    fat: 0
  },

  "salad": {
    name: "Salad",
    emoji: "🥗",
    calories: 140,
    protein: 4,
    carbs: 15,
    fat: 7
  },

  "tempe goreng": {
    name: "Tempe Goreng",
    emoji: "🍘",
    calories: 190,
    protein: 11,
    carbs: 9,
    fat: 12
  }
};


// MENGAMBIL ELEMENT HTML

const $ = (id) => document.getElementById(id);

let profile = {};

let imageUrl = null;


// NOTIFIKASI

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


// PROFIL PENGGUNA

function loadProfile() {
  try {
    profile = JSON.parse(
      localStorage.getItem("nutritrack_profile")
    ) || {};
  } catch {
    profile = {};
  }
}

function displayProfile() {
  const name = profile.name || "Pengguna";

  $("displayName").textContent = "Halo, " + name + "! 👋";

  $("avatar").textContent =
    name.charAt(0).toUpperCase();

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


// TUTUP FORM PROFIL

$("closeModal").addEventListener("click", () => {
  $("profileModal").classList.add("hidden");
});

$("profileModal").addEventListener("click", (event) => {
  if (event.target === $("profileModal")) {
    $("profileModal").classList.add("hidden");
  }
});


// SIMPAN PROFIL

$("profileForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("name").value.trim();
  const age = $("age").value;
  const height = $("height").value;
  const weight = $("weight").value;

  if (!name) {
    showToast("Masukkan nama terlebih dahulu.");
    return;
  }

  if (age && (Number(age) < 1 || Number(age) > 120)) {
    showToast("Periksa kembali umur.");
    return;
  }

  if (height && (Number(height) < 1 || Number(height) > 250)) {
    showToast("Periksa kembali tinggi badan.");
    return;
  }

  if (weight && (Number(weight) < 1 || Number(weight) > 500)) {
    showToast("Periksa kembali berat badan.");
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
  } catch {
    showToast("Profil gagal disimpan.");
    return;
  }

  displayProfile();

  $("profileModal").classList.add("hidden");

  showToast("Profil berhasil disimpan!");
});


// UPLOAD FOTO

$("uploadButton").addEventListener("click", () => {
  $("foodImage").removeAttribute("capture");
  $("foodImage").click();
});


// BUKA KAMERA

$("cameraButton").addEventListener("click", () => {
  $("foodImage").setAttribute("capture", "environment");
  $("foodImage").click();
});


// TAMPILKAN FOTO

$("foodImage").addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("File harus berupa gambar.");

    event.target.value = "";
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    showToast("Ukuran foto maksimal 8 MB.");

    event.target.value = "";
    return;
  }

  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }

  imageUrl = URL.createObjectURL(file);

  $("previewImage").src = imageUrl;

  $("uploadEmpty").classList.add("hidden");

  $("previewWrap").classList.remove("hidden");

  showToast("Foto berhasil diunggah!");
});


// HAPUS FOTO

function clearImage() {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }

  imageUrl = null;

  $("foodImage").value = "";

  $("previewImage").removeAttribute("src");

  $("previewWrap").classList.add("hidden");

  $("uploadEmpty").classList.remove("hidden");
}

$("removeImage").addEventListener("click", clearImage);


// SARAN NAMA MAKANAN

$("foodSuggestions").innerHTML =
  Object.values(foodDatabase)
    .map(food => `<option value="${food.name}"></option>`)
    .join("");


// ANALISIS MAKANAN

function analyzeFood() {

  const foodName = $("foodName")
    .value
    .trim()
    .toLowerCase();

  const food = foodDatabase[foodName];

  if (!foodName) {
    showToast("Masukkan nama makanan!");
    $("foodName").focus();
    return;
  }

  if (!food) {
    showToast("Makanan belum tersedia di database.");
    return;
  }

  const portion = Number($("portion").value);

  const calories = Math.round(
    food.calories * portion
  );

  const protein = Math.round(
    food.protein * portion * 10
  ) / 10;

  const carbs = Math.round(
    food.carbs * portion * 10
  ) / 10;

  const fat = Math.round(
    food.fat * portion * 10
  ) / 10;


  // TAMPILKAN HASIL

  $("foodEmoji").textContent = food.emoji;

  $("resultName").textContent = food.name;

  $("resultPortion").textContent =
    portion + " Porsi";

  $("resultCalories").textContent =
    calories.toLocaleString("id-ID");

  $("resultProtein").textContent =
    protein + " g";

  $("resultCarbs").textContent =
    carbs + " g";

  $("resultFat").textContent =
    fat + " g";


  $("resultSection").classList.remove("hidden");

  $("resultSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// TOMBOL ANALISIS

$("analyzeButton").addEventListener(
  "click",
  analyzeFood
);

$("foodName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    analyzeFood();
  }
});


// SCAN MAKANAN LAGI

$("scanAgain").addEventListener("click", () => {

  $("resultSection").classList.add("hidden");

  $("foodName").value = "";

  $("portion").value = "1";

  clearImage();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// JALANKAN WEBSITE

loadProfile();

displayProfile();

if (!profile.name) {
  openProfile();
}