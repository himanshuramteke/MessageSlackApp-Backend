import { StatusCodes } from "http-status-codes";

import { s3 } from "../config/awsConfig.js";
import { AWS_BUCKET_NAME } from "../config/serverConfig.js";
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

export const getPresignedUrlFromAWS = async (req, res) => {
    try {
        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: AWS_BUCKET_NAME,
            Key: `${Date.now()}`,
            Expires: 60 //1minute
        });
        return res
            .status(StatusCodes.OK)
            .json(successResponse(url, 'Presigned URL generated successfully'));
    } catch (error) {
        console.log('Error in getPresignedUrlFromAWS', error);
        
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res 
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json(internalErrorResponse(error));
    }
}
