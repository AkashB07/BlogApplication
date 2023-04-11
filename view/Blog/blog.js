let beforeCrawl = new Date();

const url = 'http://localhost';
// const url ='http://52.66.252.234';

//Like and Dislike buttons
var btn1 = document.querySelector('#green');
var btn2 = document.querySelector('#red');


const token = localStorage.getItem('token');
const name = localStorage.getItem('name');
const blogId = (+localStorage.getItem('blogId'));

//Displaying the user
document.getElementById("user").innerHTML = name;

//Displaying the blog
window.addEventListener('DOMContentLoaded', async () => {
    try {
        beforeCrawl = new Date();
        const response = await axios.get(`${url}:3000/blog/getablog/?blogId=${blogId}`, { headers: { "Authorization": token } });
        let blog = response.data.blog;
        document.getElementById("creator").innerHTML = blog.creator;
        document.getElementById("details").innerHTML = blog.details;
        document.getElementById("title").innerHTML = blog.title;
        document.getElementById("blog").innerHTML = blog.blog;

        //Displaying the tags
        let tags = blog.tags.split(', ');
        const parentElement = document.getElementById('listOfTags');
        for (let i = 0; i < tags.length; i++) {
            parentElement.innerHTML += `
            <button class="btn btn-secondary " onclick="viewTag('${tags[i]}')">${tags[i].toUpperCase()}</button> `
        }

        likeordislike();
        countlike();
        getComments();

        // Crawl time to load page
        let afterCrawl = new Date();
        let crawl = (afterCrawl - beforeCrawl) / 1000;
        document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";
    }
    catch (error) {
        console.log(error);
    }
})

//To view the clicked tag
function viewTag(tag) {
    localStorage.setItem('tag', tag);
    window.location.replace('../Tag/tag.html');
}

//Like button event
btn1.addEventListener('click', async function () {
    try {
        beforeCrawl = new Date();
        if (btn2.classList.contains('red')) {
            btn2.classList.remove('red');
        }
        this.classList.toggle('green');
        const likeDetails = {
            blogId: blogId,
            result: btn1.classList.length
        }
        await axios.post(`${url}:3000/like/likes`, likeDetails, { headers: { "Authorization": token } });
        likeordislike();
        countlike();

        // Crawl time to load page
        afterCrawl = new Date();
        crawl = (afterCrawl - beforeCrawl) / 1000;
        document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";
    }
    catch (error) {
        console.log(error);
    }
});

//Dislike button event
btn2.addEventListener('click', async function () {
    try {
        beforeCrawl = new Date();
        if (btn1.classList.contains('green')) {
            btn1.classList.remove('green');
        }
        this.classList.toggle('red');
        const likeDetails = {
            blogId: blogId,
            result: btn2.classList.length
        }
        await axios.post(`${url}:3000/like/dislikes`, likeDetails, { headers: { "Authorization": token } });
        likeordislike();
        countlike();

        // Crawl time to load page
        afterCrawl = new Date();
        crawl = (afterCrawl - beforeCrawl) / 1000;
        document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";
    }
    catch (error) {
        console.log(error);
    }
});

//To find if the blog is liked or disliked
async function likeordislike() {
    try {
        const response = await axios.get(`${url}:3000/like/likeordislike/?blogId=${blogId}`, { headers: { "Authorization": token } });
        if (response.data.success) {
            if (response.data.like.likes) {
                btn1.classList.value = "btn green";
            }
            if (response.data.like.dislikes) {
                btn2.classList.value = "btn red";
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

//To find total number of likes and dislikes to a blog
async function countlike() {
    try {
        const response = await axios.get(`${url}:3000/like/countlike/?blogId=${blogId}`, { headers: { "Authorization": token } });
        if (response.data.success) {
            // console.log(response.data.likes, response.data.dislikes);
            document.getElementById("like").innerHTML = response.data.likes;
            document.getElementById("dislike").innerHTML = response.data.dislikes;
        }
    }
    catch (error) {
        console.log(error);
    }
}

//Adding a comment to a blog
async function addComment(e) {
    try {
        e.preventDefault();
        beforeCrawl = new Date();
        let commentDetails = {
            comment: e.target.comment.value,
            blogId: blogId
        };
        e.target.comment.value = '';
        await axios.post(`${url}:3000/comment/addcomment`, commentDetails, { headers: { "Authorization": token } });

        //Adding Comment to ui
        const parentElement = document.getElementById('listOfComments');
        let length = (+localStorage.getItem('length')) + 1;
        localStorage.setItem('length', length)
        document.getElementById('length').innerHTML = length;
    
        //Getting date
        let today = new Date();
        //Getting day
        let day = today.getDate();
        //Getting month in words
        let month = today.toLocaleString('default', { month: 'long' });
        //Getting year
        let year = today.getFullYear();
        //Full date
        let date = `${day} ${month} ${year}`;

        parentElement.innerHTML = `
            <div class="card mb-4" i>
             <div class="card-body">
              <p>${commentDetails.comment}</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex flex-row align-items-center">
                  <p class="small mb-0 ms-2">${name}</p>
                </div>
                <div class="d-flex flex-row align-items-center">
                  <p class="small text-muted mb-0">${date}</p>
                </div>
               </div>
              </div>
            </div>`+ parentElement.innerHTML;

        // Crawl time to load page
        let afterCrawl = new Date();
        let crawl = (afterCrawl - beforeCrawl) / 1000;
        document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";
    }
    catch (error) {
        console.log(error);
    }
}

//To get all the comments of a blog
async function getComments() {
    try {
        const response = await axios.get(`${url}:3000/comment/getcomments/?blogId=${blogId}`, { headers: { "Authorization": token } });
        let comments = response.data.comment;
        if(response){
            localStorage.setItem('length', comments.length);
        }
        else {
            localStorage.setItem('length', 0);
        }

        for (let i = 0; i < comments.length; i++) {
            const parentElement = document.getElementById('listOfComments');
            document.getElementById('length').innerHTML = comments.length;
            const commentElemId = `${comments[i].id}`;

            //Getting date
            let today = new Date(comments[i].createdAt);
            //Getting day
            let day = today.getDate();
            //Getting month in words
            let month = today.toLocaleString('default', { month: 'long' });
            //Getting year
            let year = today.getFullYear();
            //Full date
            let date = `${day} ${month} ${year}`;

            parentElement.innerHTML += `
            <div class="card mb-4" id=${commentElemId}>
             <div class="card-body">
              <p>${comments[i].comments}</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex flex-row align-items-center">
                  <p class="small mb-0 ms-2">${comments[i].by}</p>
                </div>
                <div class="d-flex flex-row align-items-center">
                  <p class="small text-muted mb-0">${date}</p>
                </div>
               </div>
              </div>
            </div>`
        }
    }
    catch (error) {
        console.log(error);
    }

}

//To signout from the website
function signout() {
    localStorage.clear();
    window.location.replace('../Signin/signin.html');
}