import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {

    try {
        let {token} = req.cookies
        

        if(!token){
            return res.status(400).json({message: "user does not have a token"})
        }
        

        const verifyJwt = jwt.verify(token, process.env.JWT_SCERET)
        

        if(!verifyJwt){
            return res.status(400).json({message: "user does not have a valid token"})
        }

        req.userId = verifyJwt.userId
        
        next()

    } catch (error) {
        console.log("JWT Error:", error.message)
        return res.status(500).json({ message: `isAuthenticated error ${error}` })
    }
}


export default isAuthenticated