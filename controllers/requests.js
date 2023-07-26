import RequestMessage from '../models/requestMessage.js';
import mongoose from 'mongoose';
// const ObjectId = require('mongoose').Types.ObjectId;

// export const getRequests = async (req,res)=>{
//     try {
//         const requestMessages = await RequestMessage.find();
//         res.status(200).json(requestMessages);
//         console.log(requestMessages);
//     } catch (error) {
//         res.status(404).json({message: error.message});
//     }
// }   

export const getRequests = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;     
        const total = await RequestMessage.countDocuments({});
        const requests = await RequestMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: requests, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getRequestsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const requests = await RequestMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: requests });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const createRequest = async (req,res)=>{
    const request = req.body;
    // const newRequest = new RequestMessage(request);
    const newRequestMessage = new RequestMessage({ ...request, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newRequestMessage.save();  
        res.status(201).json(newRequestMessage);  
    } catch (error) {
        res.status(409).json({message: error.message});
    }
};

export const getRequest = async (req, res) => { 
    const { id } = req.params;
    

    try {
        const request = await RequestMessage.findById(id);
        
        res.status(200).json(request);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getRequestsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const requests = await PostMessage.find({ name });

        res.json({ data: requests });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id))  return res.status(404).send(`No request with id: ${id}`);

    const updatedRequest = { creator, title, message, tags, selectedFile, _id: id };

    await RequestMessage.findByIdAndUpdate(id, updatedRequest, { new: true });

    res.json(updatedRequest);
}

export const deleteRequest = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No request with id: ${id}`);

    await RequestMessage.findByIdAndRemove(id);

    res.json({ message: "Request deleted successfully." });
}

export const commentRequest = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const request = await RequestMessage.findById(id);

    request.comments.push(value);

    const updatedRequest = await RequestMessage.findByIdAndUpdate(id, request, { new: true });

    res.json(updatedRequest);
};