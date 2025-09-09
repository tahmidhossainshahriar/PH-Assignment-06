// Use Strict mode
"use strict";

// navbar functionality for mobile
const mobileNav = document.getElementById("mobileNav");
const overlay = document.getElementById("overlay");

// Array for cart
let carts = [];

// Show Nav
const showNav = () => {
  mobileNav.classList.remove("right-[-200px]");
  mobileNav.classList.add("right-0");
  overlay.classList.remove("hidden");
};

// Close Nav
const closeNav = () => {
  mobileNav.classList.add("right-[-200px]");
  mobileNav.classList.remove("right-0");
  overlay.classList.add("hidden");
};

// Main Features
const categoriesContainer = document.querySelector("#categoriesContainer");
const treesCardContainer = document.querySelector("#treesCardContainer");
const addtocartMainSection = document.querySelector("#add-to-cart-main-section");
const cartTotal = document.querySelector("#cart-total-price");
const mobileCartContainer = document.querySelector("#mobileCartContainer");
const cartCount = document.querySelector("#cartCount");
const loader = document.querySelector("#loader");
const treeDetail = document.querySelector("#treeDetail");
const modalContainer = document.querySelector("#modalContainer");

// Function to show loading
const showLoading = () => {
  treesCardContainer.innerHTML = `
        <div id="loader" class="justify-self-center col-span-full">
            <span class="loading loading-dots loading-xl"></span>
        </div>
    `;
};

// Function to load the category
const loadCategory = async () => {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();
  const categories = data.categories;
  showCategory(categories);
};

// Function to display categories
const showCategory = (categories) => {
  categoriesContainer.innerHTML = `
    <li id="allTrees"
        class="category-btn border border-green-700 md:border-none
        text-[#1F2937] hover:bg-green-700 hover:text-white rounded-md p-2 cursor-pointer">
        All trees
    </li>
  `;
  categories.forEach((category) => {
    const categoryName = category.category_name;
    const id = category.id;
    categoriesContainer.innerHTML += `
        <li id='${id}'
            class="category-btn border border-green-700 md:border-none
            text-[#1F2937] hover:bg-green-700 hover:text-white rounded-md p-2 cursor-pointer">
            ${categoryName}
        </li>
    `;
  });

  // load Trees category
  categoriesContainer.addEventListener("click", (e) => {
    if (e.target.localName === "li") {
      const id = e.target.id;
      id !== "allTrees" ? loadTreesByCategory(id) : loadAllTreesCategory();

      // active class feature
      const categoryBtn = document.querySelectorAll(".category-btn");
      categoryBtn.forEach((btn) => {
        btn.classList.remove("bg-green-700", "text-white");
      });
      e.target.classList.add("bg-green-700", "text-white");
    }
  });

  document.getElementById("allTrees").classList.add("bg-green-700", "text-white");
};

// Function to load trees by categories
const loadTreesByCategory = async (id) => {
  showLoading();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    showTressByCategory(data.plants);
  } catch (e) {
    console.log(e);
  }
};

// Function to show Trees By Category
const showTressByCategory = (trees) => {
  treesCardContainer.innerHTML = "";
  try {
    trees.forEach((tree) => {
      treesCardContainer.innerHTML += `
        <div id="${tree.id}" class="card p-4 bg-white h-fit shadow rounded-2xl">
          <figure class="h-48 w-full overflow-hidden rounded-xl">
              <img
                src="${tree.image}"
                alt="${tree.name}"
                class="object-cover w-full h-full"
                loading="lazy"
              />
          </figure>
          <div class="space-y-3 mt-3">
              <h2 class="card-title text-lg font-semibold text-gray-800 cursor-pointer">${tree.name}</h2>
              <p class="text-gray-600 text-sm line-clamp-2">${tree.description}</p>
             
              <div class="flex justify-between items-center">
                  <span class="badge bg-green-200 text-green-700 font-medium">${tree.category}</span>
                  <p class="font-medium text-gray-800">৳<span class="price">${tree.price}</span></p>
              </div>
             
              <button class="btn bg-green-700 hover:bg-green-800 text-white w-full rounded-full mt-2">
                  Add to Cart
              </button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};

// =========================
// Function for handle Cart
// =========================
const handleCart = (e) => {
  const parent = e.target.closest(".card");
  const id = parent.id;
  const title = parent.querySelector(".card-title").textContent;
  const price = parent.querySelector(".price").textContent;

  // Add item to cart array
  carts.push({ id, title, price: Number(price) });
  showCart();
};

// Function to show cart items
const showCart = () => {
  const totalPrice = carts.reduce((acc, cur) => acc + cur.price, 0);

  // Clear before re-render
  addtocartMainSection.innerHTML = "";

  carts.forEach((cart) => {
    const itemHTML = `
      <div id="${cart.id}" class="p-3 mb-2 shadow rounded-xl bg-[#F0FDF4] flex justify-between items-center">
        <div>
          <h5 class="font-medium">${cart.title}</h5>
          <span class="text-gray-500 text-sm">৳${cart.price}</span>
        </div>
        <i onclick="handleDeleteItem(event)"
           class="fa-solid fa-xmark text-gray-500 cursor-pointer"></i>
      </div>
    `;
    addtocartMainSection.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Update total price
  cartTotal.textContent = totalPrice;

  // Update cart count
  cartCount.textContent = carts.length;
};

// Function for delete item from cart
const handleDeleteItem = (e) => {
  const parent = e.target.closest(".p-3");
  const id = parent.id;
  carts = carts.filter((cart) => cart.id !== id);
  showCart();
};

// === Function for handle view modal ===
const handleViewModal = async (e) => {
  const id = e.target.closest(".card").id;
  const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
  const data = await res.json();
  showTreeDetail(data.plants);
};

// --- THIS IS THE CORRECTED PART FOR YOUR POP-UP DESIGN ---
const showTreeDetail = (plants) => {
  modalContainer.innerHTML = `
    <div class="relative p-6">
            <img
        class="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg mb-4"
        src="${plants.image}"
        alt="${plants.name}"
      />

            <div class="text-center md:text-left space-y-2">
        <h3 class="text-2xl font-bold text-gray-800">${plants.name}</h3>
        <p class="text-gray-700">
          <span class="font-semibold">Category:</span>
          ${plants.category}
        </p>
        <p class="text-gray-700">
          <span class="font-semibold">Price:</span>
          ${plants.price}৳
        </p>
        <p class="text-gray-700">
          <span class="font-semibold">Description:</span>
          ${plants.description}
        </p>
      </div>

            <div class="modal-action flex justify-end mt-6">
        <form method="dialog">
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full">
            Close
          </button>
        </form>
      </div>
    </div>
  `;
  treeDetail.showModal();
};
// --- END OF CORRECTED PART ---

// Function to load All Trees Category by Default
const loadAllTreesCategory = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    showTressByCategory(data.plants);
  } catch (e) {
    console.log(e);
  }
};


treesCardContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Add to Cart") {
    handleCart(e);
  }
  if (e.target.classList.contains("card-title")) {
    handleViewModal(e);
  }
});

// Call Load Category Function to load category
loadCategory();
loadAllTreesCategory();