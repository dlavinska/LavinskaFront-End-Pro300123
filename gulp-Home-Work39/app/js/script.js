const postsNumber = document.querySelector(".form__posts-number");
const postsBox = document.querySelector(".posts");
const btnComments = document.querySelector(".posts__btn-comments");
const commentsDiv = document.querySelector(".posts__comments");
const wrappDiv = document.querySelector(".wrapp");

const API = "https://jsonplaceholder.typicode.com";

const createEl = (postData) => {
    const div = document.createElement("div");
    div.classList.add("posts__post-data");
    div.innerHTML = `<h3 class="posts__post-title">${postData.title}</h3>
    <div class="posts__post-description">${postData.body}</div>`

    return div;
}

postsNumber.addEventListener("input", () => {

    function displayPost(container, data) {

        if (data.id == postsNumber.value) {
            container.innerHTML = "";
            container.append(createEl(data));
            container.append(btnComments);
            showElement(btnComments);
        } else {
            container.innerHTML = "";
        }
    }

    fetch(`${API}/posts/${postsNumber.value}`)
        .then(response => {
            if (response.status === 404) {

                return Promise.reject(new Error("There are no posts with this id"));
            }

            return response.json();
        })
        .then((json) => {
            displayPost(postsBox, json);
        })
        .catch(showError);
});

btnComments.addEventListener("click", () => {
    commentsDiv.innerHTML = "";

    fetch(`${API}/comments`)
        .then(response => {
            if (response.status === 404) {

                return Promise.reject(new Error("There are no posts with this id"));
            }

            return response.json();
        })
        .then((json) => {
            json.forEach((elem) => {
                if (elem.postId == postsNumber.value) {
                    const createComment = (comment) => {
                        const divComment = document.createElement("div");
                        
                        divComment.classList.add("posts__comment");
                        divComment.innerHTML = `<h3 class="posts__comment-title">${comment.name}</h3>
                            <div class="posts__comment-email">${comment.email}</div>
                            <div class="posts__comment-description">${comment.body}</div>`
                    
                        return divComment;
                    }

                    postsBox.append(commentsDiv);
                    commentsDiv.append(createComment(elem));
                }
            });
        })
        .catch(showError);
});

function showError(err) {
    if (postsNumber.value < 1 || postsNumber.value > 100) {
        postsBox.innerHTML = "";

        const errorMessage = document.createElement("div");
        errorMessage.classList.add("wrapp__mistake");
        errorMessage.innerHTML = `Ooops... ${err}`;
                
        const mistakeBtn = document.createElement("button");
        mistakeBtn.classList.add("wrapp__mistake-btn-error");
        mistakeBtn.innerHTML = `OK`;

        mistakeBtn.addEventListener("click", () => {
            // hideElement(errorMessage);
            errorMessage.style = "display:none";
            postsNumber.value = "";
        });

        errorMessage.append(mistakeBtn);

        wrappDiv.append(errorMessage);
        console.log(err);        
    }
}

function showElement(element) {
    element.classList.add("show");
    element.classList.remove("hide");
}

function hideElement(element) {
    element.classList.remove("show");
    element.classList.add("hide");
}