const History = require('../model/searchHistory');

//To verify the variable
function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

//To add a search history to the database
const addHistory = async (req, res) => {
    try {
        const { search } = req.body;
        const userId = req.user.id;
        if (isstringinvalid(search)) {
            return res.status(400).json({ message: 'title or details or blog or tags is missing', success: false });
        }
        await History.destroy({where: {search: search }});
        await History.create({ search: search, userId: userId });
        return res.status(201).json({success: true});
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

//To get all the search hisyory of a user
const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await History.findAll({where: {userId: userId }, order:[['createdAt','DESC']]});
        return res.status(200).json({history: history, succese: true});     
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}

//To export the functions
module.exports = {
    addHistory,
    getHistory
}