import express from 'express';
import { getRequests, createRequest, updateRequest, getRequest,deleteRequest,getRequestsBySearch,getRequestsByCreator, commentRequest } from '../controllers/requests.js';

const router = express.Router();

router.get('/', getRequests);
router.get('/search', getRequestsBySearch);
router.post('/', createRequest);
router.get('/:id', getRequest);
router.patch('/:id', updateRequest);
router.delete('/:id', deleteRequest);
router.post('/:id/commentRequest', commentRequest);
router.get('/creator', getRequestsByCreator);
export default router;  