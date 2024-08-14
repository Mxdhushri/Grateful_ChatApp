import User from "../models/UserModel.js"

export const searchContacts = async (request, response, next) => {
    try {
        const {searchTerm} =request.body
        if(searchTerm===undefined || searchTerm===null){
            return response.status(400).send("Searchterm is undefined.")
        }
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")//special characters removeal when we search contacts CALLED REJEX 
        const regex = new RegExp(sanitizedSearchTerm,"i")
        const contacts = await User.find({
            $and:[{_id:{$ne:request.userId}}, {//same name should no equal
                $or:[{firstName:regex},{lastName:regex},{email:regex}]
            }],
        })
        return response.status(200).json({contacts})


        return response.status(200).send("Logout successful.")
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}