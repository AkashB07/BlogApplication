let beforeCrawl = new Date();

const url = 'http://localhost';
// const url ='http://52.66.252.234';

let token = localStorage.getItem('token');
let name = localStorage.getItem('name');

//Displaying the user
document.getElementById("user").innerHTML = name;


//Displaying the list of blogs related to the tag
window.addEventListener('DOMContentLoaded', async () => {
    try {
        beforeCrawl = new Date();
        let tag = localStorage.getItem('tag');
        const response = await axios.get(`${url}:3000/blog/get10blogs/?tag=${tag}&page=${1}`, { headers: { "Authorization": token } });
        let blog = response.data.blogs;

        const container = document.getElementById('container');
        container.innerHTML = `<h2 class="mb-5">Resent ${tag.toUpperCase()} Blog's</h2>
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

        for(let i=0; i<blog.length; i++){
            const parentElement = document.getElementById('listOfBlogs');
            const expenseElemId = `${blog[i].id}`;
            parentElement.innerHTML += `<tr id=${expenseElemId}>
                <td>${blog[i].creator}</td>
                <td><button type="submit" class="btn btn-link" onclick="viewBlog(${blog[i].id})">${blog[i].title}</button>  </td>
                <td>${blog[i].details}</td>
                <td>${blog[i].totallikes}</td>
                <td>${blog[i].totaldislikes}</td>
                <td>${blog[i].totalcomments}</td>
                <td>${blog[i].tags.toUpperCase()}</td>
                </tr>`
        }   
    //    Crawl time to load page
        const afterCrawl = new Date();
        const crawl = (afterCrawl - beforeCrawl)/1000;
        document.getElementById("load").innerHTML = crawl+" seconds to crawl the page";
    }
    catch (error) {
        console.log(error);
    }
})

//To view the clicked blog
function viewBlog(blogId){
    localStorage.setItem('blogId', blogId);
    window.location.href = "../Blog/blog.html";
}

//To signout from the website
function signout() {
    localStorage.clear();
    window.location.replace('../Signin/signin.html');
}