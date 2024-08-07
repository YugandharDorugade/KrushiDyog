// This module exports a function that takes another function 'fn' as an argument
module.exports = (fn) => {
    // It returns a new middleware function that takes 'req', 'res', and 'next' as arguments
    return (req, res, next) => {
        // Calls 'fn' with 'req', 'res', and 'next'
        // If 'fn' returns a promise, '.catch(next)' will catch any errors and pass them to the next middleware
        fn(req, res, next).catch(next);
    }
}
