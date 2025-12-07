let starRating = 0;
const reviewList = [];

function generateStarRating(rating) {
    let starsHtml = '';
    for (let i = 0; i < rating; i++) {
        starsHtml += '<span class="star-filled">★</span>';
    }
    for (let i = rating; i < 5; i++) {
        starsHtml += '<span class="star-unfilled">★</span>';
    }
    
    return starsHtml;
}

function over18(birthdateString) {
    if (document.getElementById("date-error")) {document.getElementById("date-error").remove()}
    
    const dateError = document.createElement("div")
    dateError.classList.add("review-error")
    dateError.id = "date-error"
    
    if(!birthdateString) {
        dateError.innerHTML = "You have to chose a birthdate!"
        document.querySelector(".birthdate").appendChild(dateError)
        return false
    }
    const today = new Date()
    const birthDate = new Date(birthdateString);
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        dateError.innerHTML = "You have to be older than 18!"
        document.querySelector(".birthdate").appendChild(dateError)
        return false
    } else {return true}
}

function nameError(user) {
    if (document.getElementById("name-error")) {document.getElementById("name-error").remove()}
    if (document.getElementById("name").value === "") 
        {
            const nameError = document.createElement("div")
            nameError.classList.add("review-error")
            nameError.id = "name-error"
            nameError.innerHTML = "You have to give a name!"
            document.querySelector(".name").appendChild(nameError)
            return false
        } else {
            return true
    }
}

function ratingError() {
    if (document.getElementById("star-error")) {document.getElementById("star-error").remove()}
    if (starRating == 0) {
        const starError = document.createElement("div")
        starError.classList.add("review-error")
        starError.id = "star-error"
        starError.innerHTML = "You have to give a rating!"
        starError.style.order = "1"
        document.getElementById("consent").appendChild(starError)
        return false
    } else {return true}
}

function newData() {
    const user = {
        name: document.getElementById("name").value,
        birthdate: document.getElementById("bdate").value,
        email: document.getElementById("email").value,
        rating: starRating,
        title: document.getElementById("title-input").value,
        desc: document.getElementById("desc-input").value,
    };
    
    const isOver18 = over18(user.birthdate);
    const hasName = nameError(user);
    const hasRating = ratingError();
    const isConsentChecked = document.getElementById("consent-input").checked;

    if (isOver18 && hasName && hasRating) {
        starRating = 0; 

        document.getElementById("review-form").reset()

        resetErrors();

        if (isConsentChecked) {appendReview(user)}
    }

    
}

function appendReview(user) {
    const userReview = document.createElement("li");
    const authorName = document.createElement("div");
    const reviewStars = document.createElement("div");
    const reviewTitle = document.createElement("div");
    const reviewDesc = document.createElement("textarea");

    authorName.innerHTML = `${user.name}`
    authorName.classList.add("review-author")
    userReview.appendChild(authorName)

    if (user.title == "") {} 
    else {
        reviewTitle.innerHTML = `${user.title}`
        reviewTitle.classList.add("review-title")
        userReview.appendChild(reviewTitle)
    }

    reviewStars.innerHTML = `${generateStarRating(user.rating)}`
    reviewStars.classList.add("review-stars")
    userReview.appendChild(reviewStars)

    if (user.desc == "") {}
    else {
        reviewDesc.innerHTML = `${user.desc}`
        reviewDesc.classList.add("review-desc")
        reviewDesc.classList.add("no-resize")
        reviewDesc.disabled
        userReview.appendChild(reviewDesc)
    }

    document.getElementById("all-reviews").appendChild(userReview)  
}

function resetErrors() {
    const errors = document.querySelectorAll(".review-error");
    errors.forEach(el => el.remove());

}