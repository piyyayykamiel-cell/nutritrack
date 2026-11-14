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


// AMBIL ELEMEN HTML
const $ = id => document.getElementById(id);

const profileKey = "nutritrack_profile";
let profile = loadProfile();
let selectedImage = null;
let currentResult = null;


// PENYIMPANAN PROFIL
function loadProfile() {
  try {
    return JSON.parse(
      localStorage.getItem(profileKey)
    ) || {};
  } catch {
    return {};
  }
}

function saveProfileData() {
  localStorage.setItem(
    profileKey,
    JSON.stringify(profile)
  );
}


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


// TAMPILKAN PROFIL
function displayProfile() {
  const name = profile.name || "Pengguna";

  $("displayName").textContent =
    `Halo, ${name}! 👋`;

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


// BUKA MODAL PROFIL
function openProfile() {
  $("name").value = profile.name || "";
  $("age").value = profile.age || "";
  $("height").value = profile.height || "";
  $("weight").value = profile.weight || "";

  $("goal").value =
    profile.goal || "Memahami kandungan nutrisi";

  $("profileModal").classList.remove("hidden");
}


// SIMPAN PROFIL
$("profileForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const age = Number($("age").value);
  const height = Number($("height").value);
  const weight = Number($("weight").value);

  if (age && (age < 1 || age > 120)) {
    return showToast("Periksa kembali umur.");
  }

  if (height < 0 || weight < 0) {
    return showToast("Periksa kembali data profil.");
  }

  profile = {
    name: $("name").value.trim(),
    age: $("age").value,
    height: $("height").value,
    weight: $("weight").value,
    goal: $("goal").value
  };

  saveProfileData();
  displayProfile();

  $("profileModal").classList.add("hidden");

  showToast("Profil berhasil disimpan!");
});


// TOMBOL PROFIL
$("editProfile").addEventListener("click", openProfile);

$("closeModal").addEventListener("click", () => {
  $("profileModal").classList.add("hidden");
});

$("profileModal").addEventListener("click", event => {
  if (event.target === $("profileModal")) {
    $("profileModal").classList.add("hidden");
  }
});


// UPLOAD FOTO
$("uploadButton").addEventListener("click", () => {
  $("foodImage").click();
});

$("cameraButton").addEventListener("click", () => {
  $("foodImage").setAttribute("capture", "environment");
  $("foodImage").click();
});

$("foodImage").addEventListener("change", function(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return showToast("Pilih file gambar.");
  }

  if (file.size > 8 * 1024 * 1024) {
    return showToast("Ukuran gambar maksimal 8 MB.");
  }

  if (selectedImage) {
    URL.revokeObjectURL(selectedImage);
  }

  selectedImage = URL.createObjectURL(file);

  $("previewImage").src = selectedImage;

  $("uploadContent").classList.add("hidden");

  $("previewContainer").classList.remove("hidden");

  showToast("Foto berhasil dimasukkan!");
});


// HAPUS FOTO
$("removeImage").addEventListener("click", () => {
  if (selectedImage) {
    URL.revokeObjectURL(selectedImage);
  }

  selectedImage = null;

  $("foodImage").value = "";
  $("previewImage").src = "";

  $("previewContainer").classList.add("hidden");

  $("uploadContent").classList.remove("hidden");
});


// HITUNG KALORI
function analyzeFood() {
  const inputName = $("foodName").value.trim().toLowerCase();

  if (!inputName) {
    showToast("Masukkan nama makanan terlebih dahulu!");
    $("foodName").focus();
    return;
  }

  const food = foodDatabase[inputName];

  if (!food) {
    showToast(
      "Makanan belum ada dalam database contoh."
    );
    return;
  }

  const portion = Number($("portion").value);

  currentResult = {
    ...food,
    portion: portion,

    calories: Math.round(food.calories * portion),

    protein: Math.round(food.protein * portion * 10) / 10,

    carbs: Math.round(food.carbs * portion * 10) / 10,

    fat: Math.round(food.fat * portion * 10) / 10
  };

  showResult();
}


// TAMPILKAN HASIL
function showResult() {
  const result = currentResult;

  $("foodEmoji").textContent = result.emoji;

  $("resultName").textContent = result.name;

  $("resultPortion").textContent =
    result.portion + " Porsi";

  $("resultCalories").textContent =
    result.calories.toLocaleString("id-ID");

  $("resultProtein").textContent =
    result.protein + " g";

  $("resultCarbs").textContent =
    result.carbs + " g";

  $("resultFat").textContent =
    result.fat + " g";

  $("resultSection").classList.remove("hidden");

  $("resultSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// TOMBOL ANALISIS
$("analyzeButton").addEventListener("click", analyzeFood);

$("foodName").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    analyzeFood();
  }
});


// SCAN ULANG
$("scanAgain").addEventListener("click", () => {
  currentResult = null;

  $("resultSection").classList.add("hidden");

  $("foodName").value = "";

  $("portion").value = "1";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// SARAN NAMA MAKANAN
$("foodSuggestions").innerHTML =
  Object.values(foodDatabase).map(food => {
    return `<option value="${food.name}"></option>`;
  }).join("");


// JALANKAN WEBSITE
displayProfile();

// Jika profil belum diisi, buka pengaturan profil.
if (!profile.name) {
  openProfile();
}