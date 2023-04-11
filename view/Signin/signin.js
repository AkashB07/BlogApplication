let beforeCrawl = new Date();

const url = 'http://localhost';
// const url ='http://52.66.252.234';

const token = localStorage.getItem('token');

// Crawl time to load page
let afterCrawl = new Date();
let crawl = (afterCrawl - beforeCrawl) / 1000;
document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";

//Skiping signin if user has already signed in
window.addEventListener('DOMContentLoaded', async () => {
    try {
        beforeCrawl = new Date();
        if (token) {
            const respone = await axios.get(`${url}:3000/user/issignin`, { headers: { "Authorization": token } });
            if (respone.data.success) {
                // Crawl time to load page
                afterCrawl = new Date();
                crawl = (afterCrawl - beforeCrawl) / 1000;
                document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";
                window.location.href = "../Home/home.html";
            }
        }
    }
    catch (error) {
        console.log(error);
    }
})

//For siging in
async function signin(e) {
    try {
        e.preventDefault();
        beforeCrawl = new Date();
        const signinDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        e.target.email.value = '';
        e.target.password.value = '';

        const respone = await axios.post(`${url}:3000/user/signin`, signinDetails);
        alert(respone.data.message);
        localStorage.setItem('token', respone.data.token);
        localStorage.setItem('name', respone.data.name);
        // Crawl time to load page
        afterCrawl = new Date();
        crawl = (afterCrawl - beforeCrawl) / 1000;
        document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";
        window.location.href = "../Home/home.html";
    }
    catch (error) {
        alert(error.response.data.message);
        console.log(error);
    }
}
