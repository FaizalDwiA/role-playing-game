// ==== VARIABEL DASAR GAME ====
let xp = 0; // Pengalaman awal pemain
let health = 100; // Kesehatan awal pemain
let gold = 50; // Emas awal pemain
let currentWeapon = 0; // Indeks senjata yang sedang dipakai
let fighting; // Indeks monster yang sedang dilawan
let monsterHealth; // Health monster saat ini
let inventory = ["stick"]; // Inventaris pemain

// ==== ELEMENT HTML ====
const button1 = document.querySelector("#button1"); // Tombol aksi 1
const button2 = document.querySelector("#button2"); // Tombol aksi 2
const button3 = document.querySelector("#button3"); // Tombol aksi 3
const text = document.querySelector("#text"); // Elemen teks narasi
const xpText = document.querySelector("#xpText"); // Tampilan XP
const healthText = document.querySelector("#healthText"); // Tampilan kesehatan
const goldText = document.querySelector("#goldText"); // Tampilan emas
const monsterStats = document.querySelector("#monsterStats"); // Panel info monster
const monsterName = document.querySelector("#monsterName"); // Nama monster
const monsterHealthText = document.querySelector("#monsterHealth"); // Health monster
const buttons = [button1, button2, button3]; // Array tombol untuk looping

// ==== DATA GAME ====
const weapons = [
  // Daftar senjata
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];

const monsters = [
  // Daftar monster
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 },
];

const locations = [
  // Lokasi-lokasi game
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

// ==== INISIALISASI TOMBOL SAAT PERTAMA ====
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// ==== FUNGSI INTI UNTUK UPDATE TAMPILAN ====
function update(location) {
  monsterStats.style.display = "none"; // Sembunyikan status monster
  location["button text"].forEach((text, i) => {
    buttons[i].innerText = text;
    buttons[i].onclick = location["button functions"][i];
  });
  text.innerHTML = location.text;
}

// ==== FUNGSI NAVIGASI ====
function goTown() {
  update(locations[0]);
}
function goStore() {
  update(locations[1]);
}
function goCave() {
  update(locations[2]);
}

// ==== BELI DARAH ====
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

// ==== BELI SENJATA / JUAL SENJATA ====
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      const newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    const soldWeapon = inventory.shift(); // Hapus senjata pertama
    currentWeapon--;
    text.innerText = "You sold a " + soldWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// ==== PILIHAN MONSTER ====
function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function fightDragon() {
  fighting = 2;
  goFight();
}

// ==== MULAI PERTARUNGAN ====
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

// ==== SERANGAN ====
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";

  // Efek animasi flash
  text.classList.add("flash-hit");
  setTimeout(() => text.classList.remove("flash-hit"), 300);

  // Musuh menyerang
  health -= getMonsterAttackValue(monsters[fighting].level);

  // Serangan balik pemain
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You miss.";
  }

  // Update UI
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  // Cek hasil pertarungan
  if (health <= 0) return lose();
  if (monsterHealth <= 0) return fighting === 2 ? winGame() : defeatMonster();

  // Peluang senjata rusak
  if (Math.random() <= 0.1 && inventory.length > 1) {
    const brokenWeapon = inventory.pop();
    currentWeapon--;
    text.innerText += " Your " + brokenWeapon + " breaks.";
  }
}

// ==== HITUNG DAMAGE MUSUH ====
function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

// ==== CEK APAKAH SERANGAN KENA ====
function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

// ==== DODGE ====
function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

// ==== MENANGKAN PERTARUNGAN ====
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

// ==== KALAH ====
function lose() {
  update(locations[5]);
}

// ==== MENANG GAME ====
function winGame() {
  update(locations[6]);
}

// ==== ULANG GAME ====
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

// ==== EASTER EGG ====
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}

// ==== LOGIKA GAME RAHASIA ====
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11)); // Angka acak 0–10
  }

  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  numbers.forEach((num) => (text.innerText += num + "\n"));

  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) lose();
  }
}
