let beforeCrawl = new Date();

// const url = 'http://localhost';
const url ='http://65.0.102.136';

const token = localStorage.getItem('token');

// Crawl time to load page
let afterCrawl = new Date();
let crawl = (afterCrawl - beforeCrawl) / 1000;
document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";


async function signup(e) {
    try {
        e.preventDefault();
        beforeCrawl = new Date();
        let name = e.target.name.value;
        let email = e.target.email.value;
        let password = e.target.password.value;
        const signupDetails = {
            name: name,
            email: email,
            password: password
        }

        const respone = await axios.post(`${url}:3000/user/signup`, signupDetails)
        if (respone.status == 201) {
            e.target.name.value = '';
            e.target.email.value = '';
            e.target.password.value = '';
            alert(respone.data.message);

            // Crawl time to load page
            afterCrawl = new Date();
            crawl = (afterCrawl - beforeCrawl) / 1000;
            document.getElementById("load").innerHTML = crawl + " seconds to crawl the page";

            //Moving to Login page
            localStorage.clear();
            window.location.href = "../Signin/signin.html";
        }
        else {
            throw new Error('Failed to login')
        }
    }
    catch (error) {
        console.log(error)
        alert(error.response.data.err)
    }
}