const axios = require('axios').create({
    baseURL: 'http://localhost:9000/',
    timeout: 1000,
});

const all = () => {
    return new Promise((resolve, reject) => {
        axios.get('/')
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

export {
    all
}
