const jwt = require('jsonwebtoken');

module.exports = {
    validateToken: (req,res,next) => {
        const authorizatonHeader = req.headers.authorization;
        let result;

        if(authorizatonHeader){
            const token = req.headers.authorization.split(' ')[1];
            const options = {
                expiresIn: '2d',
            };
            try{
                result = jwt.verify(token, process.env.JWT_SECRET, options);
                
                req.decoded = result;
                
                next();
            }catch (err) {
                throw new Error(err);
            }
        }else{
            result = {
                error: 'Authentication error. Token required.',
                status: 401
            };
            res.status(401).send(result);
        }
    }
};