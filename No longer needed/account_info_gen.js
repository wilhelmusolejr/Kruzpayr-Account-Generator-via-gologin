const firstNames = [
  "Juan",
  "Juann",
  "Jose",
  "Joose",
  "Josse",
  "Andres",
  "Andrees",
  "Abndres",
  "Emilio",
  "Rafael",
  "Carlos",
  "Miguel",
  "Migueel",
  "Manuel",
  "Mannuel",
  "Fernando",
  "Antonio",
  "Maria",
  "Mariia",
  "Isabel",
  "Carmen",
  "Rosa",
  "Roosa",
  "Teresa",
  "Terresa",
  "Lourdes",
  "Lourrdes",
  "Clarita",
  "Claritata",
  "Angela",
  "Angoola",
  "Dolores",
  "Beatriz",
];

const lastNames = [
  "Dela Cruz",
  "Santos",
  "Reyes",
  "Garcia",
  "Mendoza",
  "Torres",
  "Gonzales",
  "Fernandez",
  "Ramos",
  "Aquino",
  "Castro",
  "Domingo",
  "Villanueva",
  "Aguilar",
  "Bautista",
  "Salazar",
  "Navarro",
  "Rivera",
  "Velasco",
  "Ocampo",
];

const surnames = [
  "Dela Cruz",
  "Reyes",
  "Santos",
  "Garcia",
  "Mendoza",
  "Torres",
  "Gonzales",
  "Ramos",
  "Fernandez",
  "Castro",
  "Domingo",
  "Aguilar",
  "Lopez",
  "Navarro",
  "Villanueva",
  "Cortez",
  "Alvarez",
  "Bautista",
  "Salazar",
  "Morales",
];

function generateAccountData() {
  let firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  let randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  let randomDigit = Math.floor(Math.random() * (999 - 100 + 1)) + 100;

  let username = `${firstName}${randomDigit}`;
  let password = `boktitelo1`;
  let email = `${firstName}${lastName}@gmail.com`;

  let month = Math.floor(Math.random() * (10 - 12 + 1)) + 12;
  let day = Math.floor(Math.random() * (29 - 20 + 1)) + 20;
  let year = Math.floor(Math.random() * (2001 - 1990 + 1)) + 1990;

  return {
    user_id: username.toLowerCase(),
    user_password: password.toLowerCase(),
    email: email.toLowerCase(),
    first_name: firstName.toLowerCase(),
    last_name: lastName.toLowerCase(),
    birth_dt: `${year}-${month}-${day}`,
    question_code: 1,
    question_answer: randomSurname.toLowerCase(),
  };
}

export default generateAccountData;
