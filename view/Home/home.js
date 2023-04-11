let beforeCrawl = new Date();

// const url = 'http://localhost';
const url ='http://65.0.102.136';

const token = localStorage.getItem('token');
const name = localStorage.getItem('name');

//Displaying the user
document.getElementById("user").innerHTML = name;

// Crawl time to load page
let afterCrawl = new Date();
let crawl = (afterCrawl - beforeCrawl)/1000;
document.getElementById("load").innerHTML = crawl+" seconds to crawl the page";

//To search the entered word 
function searchbox(e) {
    e.preventDefault();
    beforeCrawl = new Date();
    let tag = e.target.tag.value;
    e.target.tag.value = '';
    if (tag.length > 0) {
        addHistory(tag);
        searchtag(tag);
    }
    // Crawl time to load page
    afterCrawl = new Date();
    crawl = (afterCrawl - beforeCrawl)/1000;
    document.getElementById("load").innerHTML = crawl+" seconds to crawl the page";
}

//Storing the search History in database
async function addHistory(tag) {
    try {
        const historyDetails = {
            search: tag
        }
        await axios.post(`${url}:3000/searchhistory/addhistory`, historyDetails, { headers: { "Authorization": token } });
    }
    catch (error) {
        console.log(error);
    }
}

//Getting the search history
async function getHistory() {
    try {
        beforeCrawl = new Date();
        const response = await axios.get(`${url}:3000/searchhistory/gethistory`, { headers: { "Authorization": token } });
    
        //Displaying the search history
        document.getElementById('pagination').innerHTML='';
        document.getElementById('sugestion').innerHTML='';
        const container = document.getElementById('container');
                container.innerHTML = `<h2 class="mb-5">Search History</h2>
                <div class="table-responsive">
                <table class="table custom-table">
                <thead>
                    <tr>
                        <th scope="col">Search</th>
                        <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody id="listOfHistory">
                </tbody>
                </table>
                </div>`;
        response.data.history.forEach(history => {
            const parentElement = document.getElementById('listOfHistory');
            const searchElemId = `${history.id}`;
            parentElement.innerHTML += `<tr id=${searchElemId}>
            <td>${history.search}</td>
            <td>${new Date(history.createdAt)}</td>
            </tr>`;

        // Crawl time to load page
        afterCrawl = new Date();
        crawl = (afterCrawl - beforeCrawl)/1000;
        document.getElementById("load").innerHTML = crawl+" seconds to crawl the page";
        })    
    }
    catch (error) {
        console.log(error);
    }
}

//Searching the enterd word
async function searchtag(tag) {
    try {
        const response = await axios.get(`${url}:3000/blog/getallblogs/?tag=${tag}`, { headers: { "Authorization": token } });
 
        // If match is found
        if (response.data.success) {
            document.getElementById('sugestion').innerHTML = '';
            let tags = [];
            let blogs = [];
            for (let i = 0; i < response.data.data.length; i++) {
                tags[i] = response.data.data[i].tags.split(', ');
            }
            for (let i = 0; i < response.data.data.length; i++) {
                if (tags[i].includes(tag.toLowerCase())) {
                    blogs.push(response.data.data[i]);
                }
            }

            // If exact mach for tag is found
            if (blogs.length > 0) {
                const container = document.getElementById('container');
                container.innerHTML = `<h2 class="mb-5">Blogs</h2>
                <div class="table-responsive">
                <table class="table custom-table">
                <thead>
                    <tr>
                        <th scope="col">Creator</th>
                        <th scope="col">Title</th>
                        <th scope="col">Details</th>
                        <th scope="col">Likes</th>
                        <th scope="col">Dislikes</th>
                        <th scope="col">Comments</th>
                        <th scope="col">Tags</th>
                    </tr>
                </thead>
                <tbody id="listOfBlogs">
                </tbody>
                </table>
                </div>`;
                display(1, tag.toLowerCase())
            }
            
            // If exact mach for tag is not found
            else {
                suggestTag(tag, response.data.data);
                document.getElementById('pagination').innerHTML = '';
                document.getElementById('container').innerHTML = '';
            }
        }

        //If no match or suggestion is found
        if(!response.data.success){
            noSuggestTag();
            document.getElementById('pagination').innerHTML = '';
            document.getElementById('container').innerHTML = '';
        }
    }
    catch (error) {
        console.log(error);
    }
}

//Displaying if the exact search is found
async function display(page, tag) {
    try {
        document.getElementById('listOfBlogs').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';

        const respone = await axios.get(`${url}:3000/blog/get10blogs/?tag=${tag}&page=${page}`, { headers: { "Authorization": token } })
        respone.data.blogs.forEach(blog => {
            addBlogstoUI(blog);
        });
        paginationHtmlCreation(respone, tag);
    }
    catch (error) {
        console.log(error);
    }
}

//Adding list of blogs if exact search is found
function addBlogstoUI(blog) {
    const parentElement = document.getElementById('listOfBlogs');
    const expenseElemId = `${blog.id}`;
    parentElement.innerHTML += `<tr id=${expenseElemId}>
    <td>${blog.creator}</td>
    <td><button type="submit" class="btn btn-link" onclick="viewBlog(${blog.id})">${blog.title}</button>  </td>
    <td>${blog.details}</td>
    <td>${blog.totallikes}</td>
    <td>${blog.totaldislikes}</td>
    <td>${blog.totalcomments}</td>
    <td>${blog.tags.toUpperCase()}</td>
    </tr>`
}

//For creating pagination of ten blogs list per page
function paginationHtmlCreation(response, tag) {
    let currentPage = response.data.currentPage;
    let hasNextPage = response.data.hasNextPage;
    let nextPage = response.data.nextPage;
    let hasPreviousPage = response.data.hasPreviousPage;
    let previousPage = response.data.previousPage;
    let lastPage = response.data.lastPage;
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';


    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.className = "btn btn-secondary";
        btn2.innerHTML = `Previous Page`;
        btn2.addEventListener('click', () => display(previousPage, tag));
        pagination.appendChild(btn2);
    }

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.className = "btn btn-secondary";
        btn3.innerHTML = `Next Page`;
        btn3.addEventListener('click', () => display(nextPage, tag));
        pagination.appendChild(btn3);
    }

}

//If suggestion is found for the search
function suggestTag(tag, data) {
    let set = new Set()
    for (let i = 0; i < data.length; i++) {
        let tags = [];
        tags = data[i].tags.split(', ');
        tags.forEach(tag => set.add(tag));
    }
    let sug = Array.from(set);
    let suggest = [];
    sug.forEach(word => {
        if (word.includes(tag)) {
            suggest.push(word);
        }
    })

    if (suggest.length > 0) {
        document.getElementById('listOfSuggestion'), innerHTML = '';
        const sugestion = document.getElementById('sugestion');
        sugestion.innerHTML = `<h2 class="mb-5">No Blogs Found, Suggested blogs</h2>
        <div id="listOfSuggestion"></div>`;
        const parentElement = document.getElementById('listOfSuggestion');
        for (let i = 0; i < suggest.length; i++) {
            parentElement.innerHTML += `
            <button class="btn btn-secondary" onclick="viewTag('${suggest[i]}')">${suggest[i].toUpperCase()}</button>   `
        }
    }
}

//If no suggestion is found for the search
function noSuggestTag() {
    const sugestion = document.getElementById('sugestion');
    sugestion.innerHTML = `<h2 class="mb-5">No Blogs Found</h2>`;
}

//To view the clicked blog
function viewBlog(blogId){
    localStorage.setItem('blogId', blogId);
    window.location.href = "../Blog/blog.html";
}

//To view the clicked tag
function viewTag(tag) {
    localStorage.setItem('tag', tag);
    window.location.replace('../Tag/tag.html');
}

//To signout from the website
function signout() {
    localStorage.clear()
    window.location.replace('../Signin/signin.html')
}