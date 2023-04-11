let beforeCrawl = new Date();

const url = 'http://localhost';
// const url ='http://52.66.252.234';


const token = localStorage.getItem('token');
const name = localStorage.getItem('name');

//Displaying the user
document.getElementById("user").innerHTML = name;

// Crawl time to load page
let afterCrawl = new Date();
let crawl = (afterCrawl - beforeCrawl)/1000;
document.getElementById("load").innerHTML = crawl+" seconds to crawl the page";

//Submitting the blog
async function submitthearticle(e)
{
    try 
    {
        e.preventDefault();
        beforeCrawl = new Date();
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

        let creator = name;
        let title = e.target.title.value;
        let details = `${e.target.details.value}, ${date}`;
        let blog = e.target.blog.value;
        let tags = e.target.tags.value.toLowerCase();
        
        const articleDetails  = {
            creator: creator,
            title: title,
            details: details,
            blog: blog,
            tags: tags
        }

        e.target.title.value = '';
        e.target.details.value = '';
        e.target.blog.value = '';
        e.target.tags.value = '';
        
        await axios.post(`${url}:3000/blog/addblog`, articleDetails, {headers: {"Authorization" : token}});

        // Crawl time to load page
        afterCrawl = new Date();
        crawl = (afterCrawl - beforeCrawl)/1000;
        document.getElementById("load").innerHTML = crawl+" seconds to crawl the page";

        alert("Article submited");
        window.location.href = "../Home/home.html";
    }
    catch (error) 
    {
        console.log(error);
    }
}

//To signout from the website
function signout() {
    localStorage.clear()
    window.location.replace('../Signin/signin.html')
}