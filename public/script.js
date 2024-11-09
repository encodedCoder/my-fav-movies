// Function to calculate age from date of birth
function calculateAge(dob) {
  if (dob === "NA") return "NA";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

// Function to convert names to Title Case
function toTitleCase(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Function to create a card for each person
function createCard(name, dob, height, imgSrc) {
  const cardContainer = document.getElementById("cards-container");

  // Create card elements
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-name", name.toLowerCase());

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = name;

  const details = document.createElement("div");
  details.classList.add("card-details");

  const nameElem = document.createElement("p");
  nameElem.textContent = `Name: ${name}`;

  const dobElem = document.createElement("p");
  const age = calculateAge(dob);
  dobElem.textContent = `DOB: ${dob} (Age: ${age})`;

  const heightElem = document.createElement("p");
  heightElem.textContent = `Height: ${height}`;

  // Append elements to card
  details.appendChild(nameElem);
  details.appendChild(dobElem);
  details.appendChild(heightElem);
  card.appendChild(img);
  card.appendChild(details);

  // Append card to container
  cardContainer.appendChild(card);
}

// Function to parse filename and extract details
function parseFilename(filename) {
  const [namePart, dobPart, heightPart] = filename.split("_");
  const name = namePart ? toTitleCase(namePart.split(".")[0]) : "NA";
  const dob = dobPart && dobPart.match(/^\d{4}-\d{2}-\d{2}$/) ? dobPart : "NA";
  const height = heightPart ? heightPart.replace(/\.\w+$/, "") : "NA"; // Remove file extension
  return { name, dob, height };
}

// Fetch image filenames from server and create cards
fetch("/api/images")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((images) => {
    if (!images.length) {
      console.log("No images found.");
      return;
    }

    // Set a random background image with blur effect
    setRandomBackgroundImage(images);

    // Create contact cards
    images.forEach((imgFilename) => {
      const imgSrc = `/images/${imgFilename}`;
      const { name, dob, height } = parseFilename(imgFilename);
      createCard(name, dob, height, imgSrc);
    });
  })
  .catch((error) => {
    console.error("Error fetching images:", error);
  });

// Function to set a random background image with blur effect
function setRandomBackgroundImage(images) {
  const randomImage = images[Math.floor(Math.random() * images.length) - 1];
  const backgroundImageUrl = `/images/${randomImage}`;
  const backgroundLayer = document.querySelector(".background-layer");
  backgroundLayer.style.backgroundImage = `url('${backgroundImageUrl}')`;
}

// Function to filter cards based on search input
function filterCards(searchTerm) {
  const cards = document.querySelectorAll(".card");
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  cards.forEach((card) => {
    const name = card.getAttribute("data-name");
    if (name.includes(lowerCaseSearchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Event listener for search input
document.getElementById("search-input").addEventListener("input", (e) => {
  filterCards(e.target.value);
});
