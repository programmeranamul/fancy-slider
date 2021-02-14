const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const search = document.getElementById('search');
const durationInputBox = document.getElementById("duration");
const nothingFound = document.getElementById("nothing-found");
const errorTag = document.getElementById("error-message");
const spiner = document.getElementById("spiner");
// selected image 
let sliders = [];



// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  //If the search image is found
  if (images.length > 0) {

    imagesArea.style.display = 'block';
    nothingFound.style.display = 'none';
    gallery.innerHTML = '';
    
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  }
  //If the search image is not found
  else {
    nothingFound.style.display = 'block';
    imagesArea.style.display = 'none';
  }
  toggleSpinner();
}


// get images from api
const getImages = (query) => {
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => displayError("Something Went Wrong. Please Try Later..."))
}


//select image for slider
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  // If the image is not selected, select it
  if (item === -1) {
    sliders.push(img);
  }
  // If the image is selected, deselect it
  else {
    sliders.splice(item, 1);
  }
}



var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  //Time Can Not Negative
  let duration = durationInputBox.value;
  // If User Input A Time Value
  if (duration >= 1000 || duration == "") {
    imagesArea.style.display = 'none';
    duration = duration || 1000; 

    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
      sliderContainer.appendChild(item)
    });

    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  //If User Try To Input A Invalid Time Value;
  else {
    alert("Please Input A valid Time Value");
    return;
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  getImages(search.value)
  sliders.length = 0;
});

sliderBtn.addEventListener('click', () => {
  createSlider()
});

//Triger By Press Enter Key 
search.addEventListener("keypress", event => {
  if (event.key == "Enter")
    searchBtn.click();
});

durationInputBox.addEventListener("keypress", event => {
  if (event.key == "Enter")
    sliderBtn.click();
});


//Toggle Spinner Function
const toggleSpinner = () => {
  spiner.classList.toggle("d-none");
  imagesArea.classList.toggle("d-none");
  nothingFound.classList.toggle("d-none");
  errorTag.classList.toggle("d-none");
}

// display error
const displayError = error => {
  errorTag.style.display = "block";
  errorTag.innerText = error;
  toggleSpinner();
}