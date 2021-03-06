let URLs = {};

if (process.env.NODE_ENV === "production") {
    URLs = {
        baseURL : "/api",
        socketURL: "https://keepitsimple-snacksinvan.herokuapp.com/"
    };

} else {
    URLs = {
        baseURL : "http://localhost:5000/api",
        socketURL: "http://localhost:5000/api",
    };
}

export default URLs;