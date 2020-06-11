const { fetch } = require('../../businessLogicLayer/index.js');

module.exports = () => {
    return {
        method: 'get',
        url: '/fetch',
        func: fetch
    };
};
