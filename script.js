  // Skills Section - Adding skills as tags (Tag Input field)

// Skills Section - Adding skills as tags (Tag Input field)
const ul = document.querySelector("#tag-list"),
  input = document.querySelector("#tag-input"),
  tagNumb = document.querySelector(".details span");

let maxTags = 20,
  tags = ["html", "css"];

countTags();
createTag();

// Update the tag count
function countTags() {
  input.focus();
  tagNumb.innerText = maxTags - tags.length;
}

// Create and insert tag elements
function createTag() {
  ul.querySelectorAll("li").forEach((li) => li.remove());
  tags
    .slice()
    .reverse()
    .forEach((tag) => {
      let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
      ul.insertAdjacentHTML("afterbegin", liTag);
    });
  countTags();
}

// Remove a specific tag
function remove(element, tag) {
  const index = tags.indexOf(tag);
  tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
  element.parentElement.remove(); // Remove the corresponding tag from the UI
  countTags(); // Update the count
}

// Add a tag when "Enter" is pressed
function addTag(e) {
  if (e.key == "Enter") {
     let tag = e.target.value.replace(/\s+/g, ' ');
     if (tag.length > 1 && !tags.includes(tag)) {
         if (tags.length < 20) {
             tag.split(',').forEach(tag => {  // Split the tags using a comma
                 tags.push(tag);
                 createTag();
             });
         }
     }
     e.target.value = "";
  }
  }

input.addEventListener("keyup", addTag);

// Event listener for the "Remove All" button
const removeBtn = document.querySelector(".details button");
removeBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent the default behavior (like form submission or page refresh)
  tags = []; // Clear the tags array
  ul.querySelectorAll("li").forEach((li) => li.remove()); // Remove all tags from the UI
  countTags(); // Update the count
});

// Work Experience Section Popup

const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  companyNameTag = popupBox.querySelector("input[placeholder='Company Name']"),
  positionTag = popupBox.querySelector("input[placeholder='Position']"),
  startDateTag = popupBox.querySelector("#start-date"),
  endDateTag = popupBox.querySelector("#end-date"),
  reasonOfResignTag = popupBox.querySelector("#reason-of-resign-text"),
  resignRadioTag = popupBox.querySelector("#resign"),
  firedRadioTag = popupBox.querySelector("#fired"),
  onTimeWorkTag = popupBox.querySelector("#on-time-work-description"),
  teamWorkTag = popupBox.querySelector("#teamwork-description"),
  communicationTag = popupBox.querySelector("#communication-description"),
  languageTag = popupBox.querySelector("#language-description"),
  trustTag = popupBox.querySelector("#trust-description"),
  extraAbilitiesTag = popupBox.querySelector("#extra-abilities-description"),
  extraActivitiesTag = popupBox.querySelector("#extra-activities-description"),
  workingDetailsTag = popupBox.querySelector("#working-details-description"),
  addBtn = popupBox.querySelector(".add-btn");

let workExperiences = JSON.parse(localStorage.getItem("work-experience") || "[]");
let isUpdate = false, updateId;

// Star rating management
const starFields = ["on-time-work", "teamwork", "communication", "language", "trust", "extra-activities"];

// Helper function to set stars based on the rating
function setStars(ratingBox, count) {
  const stars = ratingBox.querySelectorAll(".stars i");
  stars.forEach((star, index) => {
    star.classList.toggle("active", index < count);
  });
}

// Function to reset the form and star ratings
function resetForm() {
  popupTitle.innerText = "Add a New Work Experience"; // Reset the title
  companyNameTag.value = ""; // Clear company name
  positionTag.value = ""; // Clear position
  startDateTag.value = ""; // Clear start date
  endDateTag.value = ""; // Clear end date
  reasonOfResignTag.value = ""; // Clear reason of resign

  // Reset radio buttons
  resignRadioTag.checked = false; 
  firedRadioTag.checked = false; 

  // Clear text fields
  onTimeWorkTag.value = ""; 
  teamWorkTag.value = ""; 
  communicationTag.value = ""; 
  languageTag.value = ""; 
  trustTag.value = ""; 
  extraAbilitiesTag.value = ""; 
  extraActivitiesTag.value = ""; 
  workingDetailsTag.value = ""; 

  // Reset star ratings
  starFields.forEach((field) => {
    const ratingBox = popupBox.querySelector(`.rating-box[data-field="${field}"]`);
    setStars(ratingBox, 0); // Unmark all stars
  });

  // Reset button text
  addBtn.innerText = "Add Work Experience"; 
}

// Show the popup for adding a new work experience
addBox.addEventListener("click", () => {
  resetForm(); // Reset all fields
  popupBox.classList.add("show"); // Show the popup
  document.querySelector("body").style.overflow = "hidden"; // Prevent scrolling
});


// Close the popup
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto"; // Allow scrolling
});

// Display the work experiences
function showWorkExperiences() {
  document.querySelectorAll(".note").forEach((li) => li.remove()); // Clear existing entries
  workExperiences.forEach((experience, id) => {
    const timeDuration = `${experience.startDate} - ${experience.endDate}`; 
    const liTag = `
      <li class="note">
        <div class="details">
          <p>${experience.companyName}</p>
          <span>Position: ${experience.position}</span>
          <span>Time Duration: ${timeDuration}</span>
        </div>
        <div class="bottom-content">
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="menu">
              <li onclick="updateWorkExperience(${id})"><i class="uil uil-pen"></i>Edit</li>
              <li onclick="deleteWorkExperience(${id})"><i class="uil uil-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>
    `;
    addBox.insertAdjacentHTML("afterend", liTag); // Insert into the DOM
  });
}

// Delete a work experience
function deleteWorkExperience(experienceId) {
  const confirmDel = confirm("Are you sure you want to delete this Work Experience?");
  if (!confirmDel) return; // User canceled
  workExperiences.splice(experienceId, 1); // Remove from array
  localStorage.setItem("work-experience", JSON.stringify(workExperiences)); // Update local storage
  showWorkExperiences(); // Refresh list
}

// Update a work experience (used for editing)
function updateWorkExperience(experienceId) {
  const experience = workExperiences[experienceId];
  updateId = experienceId;
  isUpdate = true;

  // Populate form fields for updating
  popupTitle.innerText = "Update a Work Experience";
  addBtn.innerText = "Update Work Experience";
  companyNameTag.value = experience.companyName;
  positionTag.value = experience.position;
  startDateTag.value = experience.startDate;
  endDateTag.value = experience.endDate;
  reasonOfResignTag.value = experience.reasonOfResign;
  resignRadioTag.checked = experience.resignRadio; 
  firedRadioTag.checked = experience.firedRadio;
  onTimeWorkTag.value = experience.onTimeWork;
  teamWorkTag.value = experience.teamWork;
  communicationTag.value = experience.Communication;
  languageTag.value = experience.Language; 
  trustTag.value = experience.Trust; 
  extraAbilitiesTag.value = experience.extraAbilities;
  extraActivitiesTag.value = experience.extraActivities;
  workingDetailsTag.value = experience.workingDetails;

  // Set the star ratings
  starFields.forEach((field) => {
    const ratingBox = popupBox.querySelector(`.rating-box[data-field="${field}"]`);
    const starCount = experience[field] || 0; // Default to 0 if not set
    setStars(ratingBox, starCount); // Set the stars for each field
  });

  // Show the popup for editing
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden"; // Prevent scrolling
}

// Save or update the work experience
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const companyName = companyNameTag.value.trim();
  const position = positionTag.value.trim();
  const startDate = startDateTag.value;
  const endDate = endDateTag.value;
  const reasonOfResign = reasonOfResignTag.value.trim();
  const resignRadio = resignRadioTag.checked;
  const firedRadio= firedRadioTag.checked;
  const onTimeWork = onTimeWorkTag.value.trim();
  const teamWork = teamWorkTag.value.trim();
  const Communication = communicationTag.value.trim();
  const Language = languageTag.value.trim();
  const Trust = trustTag.value.trim();
  const extraAbilities = extraAbilitiesTag.value.trim();
  const extraActivities = extraActivitiesTag.value.trim();
  const workingDetails = workingDetailsTag.value.trim();

  const starCounts = {}; // Object to store star counts

  starFields.forEach((field) => {
    const ratingBox = popupBox.querySelector(`.rating-box[data-field="${field}"]`);
    starCounts[field] = ratingBox.querySelectorAll(".fa-star.active").length; // Get number of active stars
  });


  if (companyName && position && startDate && endDate) { // Validate data
    const workExperienceInfo = {
      companyName,
      position,
      startDate,
      endDate,
      reasonOfResign,
      resignRadio,
      firedRadio,
      onTimeWork,
      teamWork,
      Communication,
      Language,
      Trust,
      extraAbilities,
      extraActivities,
      workingDetails,
      ...starCounts,
    };
  
    if (!isUpdate) {
      workExperiences.push(workExperienceInfo); // Add new entry
    } else {
      workExperiences[updateId] = workExperienceInfo; // Update existing entry
      isUpdate = false; // Reset flag
    }
  
    localStorage.setItem("work-experience", JSON.stringify(workExperiences)); // Save to local storage
    showWorkExperiences(); // Refresh displayed list
    closeIcon.click(); // Close the popup
    }
  });

  
  // Function to show a contextual menu for editing or deleting
  function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
      if (e.target.tagName !== "I" || e.target !== elem) {
        elem.parentElement.classList.remove("show");
      }
    });
  }
  
  // Display the existing work experiences on page load
  showWorkExperiences();


// Get all the form pages and the progress bar
const formPages = document.querySelectorAll('.page');
const progressBar = document.querySelector('.progress-bar');

// Initialize the current step and total steps
let currentStep = 1;
const totalSteps = formPages.length;

// Initialize the form to show only the first step on load and scroll to the top
function initializeForm() {
  formPages.forEach((page, index) => {
    page.style.display = index === 0 ? 'block' : 'none'; // Show only the first step
  });
  updateProgressBar(); // Initialize the progress bar
  window.scrollTo(0, 0); // Scroll to the top of the page
}

// Update the progress bar based on the current step
function updateProgressBar() {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 75; // Adjust percentage
  progressBar.style.width = `${progress}%`;
}

// Function to show the current step and scroll to the top
function showStep(step) {
  formPages.forEach((page, index) => {
    page.style.display = index === step - 1 ? 'block' : 'none'; // Display the correct step
  });
  formPages[step - 1].scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to the top
}

// Event listeners for the "Next" and "Back" buttons
document.querySelector('.firstNext').addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    updateProgressBar();
  }
});

document.querySelector('.prev-1').addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgressBar();
  }
});

document.querySelector('.next-1').addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    updateProgressBar();
  }
});

document.querySelector('.prev-2').addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgressBar();
  }
});

document.querySelector('.next-2').addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    updateProgressBar();
  }
});

document.querySelector('.prev-3').addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgressBar();
  }
});

document.querySelector('.submit').addEventListener('click', () => {
  progressBar.style.width = '100%'; // Fill progress bar completely
  
  // Optional: Delay the reload to allow the progress bar to fill
  setTimeout(() => {
    location.reload();
  }, 1000); // Delay of 1 second
});

// Initialize the form to show only the first step on load
initializeForm();

// General Information Profile pic preview

document.addEventListener('DOMContentLoaded', function() {
    var fileInput = document.getElementById('profile-pic');
    var imagePreview = document.getElementById('img-pic');

    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                imagePreview.src = e.target.result;
            };

            reader.readAsDataURL(fileInput.files[0]);
        } else {
            imagePreview.src = 'img/default-image.jpg'; // Provide a default image source
        }
    });
});

// Profile picture remove button function

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    var profilePicInput = document.getElementById("profile-pic");
    var imgPreview = document.getElementById("img-pic");
    var removeButton = document.querySelector(".btn.btn-danger"); // The remove button

    // Function to remove the image and reset the input
    function removeProfilePic() {
        imgPreview.src = ""; // Clear the previewed image
        profilePicInput.value = ""; // Reset the file input
    }

    // Attach event listener to the remove button
    removeButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent any default behavior
        removeProfilePic(); // Call the remove function
    });

    // File input change event for preview
    profilePicInput.addEventListener("change", function () {
        if (profilePicInput.files && profilePicInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result; // Set the previewed image
            };
            reader.readAsDataURL(profilePicInput.files[0]); // Read the file to get its data URL
        }
    });
});

// NIC Image preview section

document.addEventListener("DOMContentLoaded", function () {
    // Elements for NIC Front
    var nicFrontInput = document.getElementById("nic-front"); // File input for NIC Front
    var nicFrontImg = document.getElementById("img-nic-front"); // Image element for NIC Front preview
    var nicFrontRemove = document.getElementById("remove-nic-front"); // Remove button for NIC Front

    // Elements for NIC Back
    var nicBackInput = document.getElementById("nic-back"); // File input for NIC Back
    var nicBackImg = document.getElementById("img-nic-back"); // Image element for NIC Back preview
    var nicBackRemove = document.getElementById("remove-nic-back"); // Remove button for NIC Back

    // Handle image preview for a specific input and image
    function handleImagePreview(fileInput, imagePreview) {
        fileInput.addEventListener("change", function () {
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    imagePreview.src = e.target.result; // Set the previewed image
                };

                reader.readAsDataURL(fileInput.files[0]);
            }
        });
    }

    // Handle removing the image and resetting the input field
    function handleRemove(fileInput, imagePreview, defaultIcon) {
        fileInput.value = ""; // Reset the file input
        imagePreview.src = defaultIcon; // Reset to default icon
    }

    // Default icon for reset
    var defaultIcon = "http://100dayscss.com/codepen/upload.svg";

    // Attach preview functionality
    handleImagePreview(nicFrontInput, nicFrontImg);
    handleImagePreview(nicBackInput, nicBackImg);

    // Attach remove functionality to both buttons
    nicFrontRemove.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default behavior
        handleRemove(nicFrontInput, nicFrontImg, defaultIcon); // Reset NIC Front
    });

    nicBackRemove.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default behavior
        handleRemove(nicBackInput, nicBackImg, defaultIcon); // Reset NIC Back
    });
});

// Passport preview image and remove

document.addEventListener("DOMContentLoaded", function () {
  // Elements for Passport image 1
  var passport1Input = document.getElementById("passport1"); // File input for Passport image 1
  var passport1Img = document.getElementById("passport-img1"); // Image element for Passport image 1 preview
  var passport1Remove = document.getElementById("remove-passport1"); // Remove button for Passport image 1

  // Elements for Passport Imane 2
  var passport2Input = document.getElementById("passport2"); // File input for Passport Imane 2
  var passport2Img = document.getElementById("passport-img2"); // Image element for Passport Imane 2 preview
  var passport2Remove = document.getElementById("remove-passport2"); // Remove button for Passport Imane 2

  // Handle image preview for a specific input and image
  function handleImagePreview(fileInput, imagePreview) {
      fileInput.addEventListener("change", function () {
          if (fileInput.files && fileInput.files[0]) {
              var reader = new FileReader();

              reader.onload = function (e) {
                  imagePreview.src = e.target.result; // Set the previewed image
              };

              reader.readAsDataURL(fileInput.files[0]);
          }
      });
  }

  // Handle removing the image and resetting the input field
  function handleRemove(fileInput, imagePreview, defaultIcon) {
      fileInput.value = ""; // Reset the file input
      imagePreview.src = defaultIcon; // Reset to default icon
  }

  // Default icon for reset
  var defaultIcon = "http://100dayscss.com/codepen/upload.svg";

  // Attach preview functionality
  handleImagePreview(passport1Input, passport1Img);
  handleImagePreview(passport2Input, passport2Img);

  // Attach remove functionality to both buttons
  passport1Remove.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default behavior
      handleRemove(passport1Input, passport1Img, defaultIcon); // Reset NIC Front
  });

  passport2Remove.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default behavior
      handleRemove(passport2Input, passport2Img, defaultIcon); // Reset NIC Back
  });
});

// Drivers license preview image and remove

document.addEventListener("DOMContentLoaded", function () {

    // Elements for Driver's License
    var LicenseInput = document.getElementById("license-pic"); // File input for Driver's License
    var LicenseImg = document.getElementById("img-license-pic"); // Image element for Driver's License preview
    var LicenseRemove = document.getElementById("remove-license-img"); // Remove button for Driver's License

    // Handle image preview for a specific input and image
    function handleImagePreview(fileInput, imagePreview) {
        fileInput.addEventListener("change", function () {
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    imagePreview.src = e.target.result; // Set the previewed image
                };

                reader.readAsDataURL(fileInput.files[0]);
            }
        });
    }

    // Handle removing the image and resetting the input field
    function handleRemove(fileInput, imagePreview, defaultIcon) {
        fileInput.value = ""; // Reset the file input
        imagePreview.src = defaultIcon; // Reset to default icon
    }

    // Default icon for reset
    var defaultIcon = "";

    // Attach preview functionality
    handleImagePreview(LicenseInput, LicenseImg);

    LicenseRemove.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default behavior
        handleRemove(LicenseInput, LicenseImg, defaultIcon); // Reset NIC Back
    });
});

// NIC, Passprot, Driver's License tab panel

// Make sure the DOM is fully loaded before running the script
$(document).ready(function () {
    // Select the nav-pills items and add a click event listener
    $(".nav-pills a").click(function (event) {
      event.preventDefault(); // Prevent the default link behavior
  
      // Get the target tab ID from the href attribute of the clicked link
      var targetTab = $(this).attr("href");
  
      // Deactivate all tabs and tab panes
      $(".nav-pills a").removeClass("active");
      $(".tab-pane").removeClass("show active");
  
      // Activate the clicked tab and the corresponding content pane
      $(this).addClass("active");
      $(targetTab).addClass("show active");
    });
  });

    // Ratings
    
     // Select all rating-box elements
    const ratingBoxes = document.querySelectorAll(".rating-box");
    
    ratingBoxes.forEach((ratingBox) => {
      const stars = ratingBox.querySelectorAll(".stars i"); // Get the stars within this rating box
    
      stars.forEach((star, index1) => {
        star.addEventListener("click", () => {
          // Loop through the stars in the same rating box
          stars.forEach((star, index2) => {
            if (index1 >= index2) {
              star.classList.add("active"); // Mark this star and those before it
            } else {
              star.classList.remove("active"); // Unmark those after
            }
          });
        });
      });
    });