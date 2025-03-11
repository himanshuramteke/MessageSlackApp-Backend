import { StatusCodes } from "http-status-codes";

import { getMessagesService } from "../services/messageService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObjects.js";

export const getMessages = async (req, res) => {
    try {
       const messages = await getMessagesService(
        {
            channelId: req.query.channelId,
            workspace: req.query.workspaceId
        },
        req.query.page || 1,
        req.query.limit || 20,
        req.user  
       );
       
       return res 
          .status(StatusCodes.OK) 
          .json(successResponse(messages, 'Messages Fetched Successfully'));

    } catch (error) {
        console.log('Messages controller error', error);
        
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res 
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json(internalErrorResponse(error));
    };
};
