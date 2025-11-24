// Function to load categories from the API
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => {
      displayCategories(data.categories);
    });
};

// Calling the function so it actually runs
loadCategories();

// Function to display the categories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  // Looping through each category in the categories array

  for (const category of categories) {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
            <button id="btn-${category.category_id}" onclick="loadCategoryVideos(${category.category_id})" class="btn btn-sm mx-1 hover:bg-[#FF1F3D] hover:text-white">${category.category}</button>
        `;
    categoryContainer.appendChild(categoryDiv);
  }
};

//remove active class from all buttons

const removeActiveClass = () => {
  const activeButtons = document.querySelectorAll(".active");
  activeButtons.forEach((btn) => btn.classList.remove("active"));
};

const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden");
};

const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("video-container").classList.remove("hidden");
};

const loadCategoryVideos = (id) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const clickedButton = document.getElementById(`btn-${id}`);
      clickedButton.classList.add("active");
      console.log(clickedButton);
      displayVideos(data.category);
    });
};

// Function to load videos from the API
const loadVideos = (searchText = "") => {
  showLoader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const allButton = document.getElementById("btn-all");
      allButton.classList.add("active");

      displayVideos(data.videos);
    });
};

loadVideos();

document.getElementById("search-input").addEventListener("keyup", function (e) {
  const searchText = e.target.value.toLowerCase();
  loadVideos(searchText);
});

const loadVideoDetails = (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  console.log(url);

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video));
};

const displayVideoDetails = (video) => {
  console.log(video);
  document.getElementById("video_details").showModal();
  document.getElementById("details-container").innerHTML = `
    <h3 class="font-bold text-lg">${video.title}</h3>
    <p class="py-4">${video.description}</p> `;
};

// Function to display the videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  if (videos.length == 0) {
    videoContainer.innerHTML = `
    <div class=" col-span-full flex flex-col justify-center items-center py-20">
        <img src="/assets/Icon.png" alt="" />
        <h1 class="text-2xl font-bold">Oops!! There is no content</h1>
      </div>
    `;
    hideLoader();
    return;
  }
  videoContainer.innerHTML = "";
  videos.forEach((video) => {
    const videocard = document.createElement("div");

    videocard.innerHTML = `

         <div class="card bg-base-100 m-5">
          <figure class="relative">
            <img class="w-full h-[165px] object-cover" src="${
              video.thumbnail
            }" alt="" />
          </figure>
          <div class="flex px-0 py-5 gap-2 items-center ">
            <div>
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img
                    src="${video.authors[0].profile_picture}"
                  />
                </div>
              </div>
            </div>
            <div class="space-y-1">
              <h2 class="text-sm text font-semibold">${video.title}</h2>
              <p
                class="text-sm text-gray-400 flex items-center gap-1.5"
              >
                ${video.authors[0].profile_name}
                ${
                  video.authors[0].verified
                    ? `<img class="w-5 h-5" src="/assets/verified.png" alt="" />`
                    : ""
                }

                
              </p>
              <p class="text-gray-400">91K views</p>
            </div>
          </div>

         <div>
         <button onclick=loadVideoDetails('${
           video.video_id
         }') class="btn btn-block bg-[#FF1F3D] text-white mb-10">View details</button>
         </div>
        </div>
            
        `;
    videoContainer.appendChild(videocard);
  });
  hideLoader();
};
