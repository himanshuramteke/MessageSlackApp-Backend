import { StatusCodes } from "http-status-codes";

import { createWorkspaceService, deleteWorkspaceService ,getWorkspacesUserIsMemberOfService } from "../services/workspaceService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObjects.js";

export const createWorkspaceController = async (req, res) => {
    try {
        console.log("Incoming request to create workspace");
        console.log("Request body:", req.body);
        console.log("Request user:", req.user);
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user
        });
        return res
        .status(StatusCodes.CREATED)
        .json(successResponse(response, 'Workspace created successfully'))
    } catch (error) {
        console.log("controller error",error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error))
        }

        return res 
           .status(StatusCodes.INTERNAL_SERVER_ERROR)
           .json(internalErrorResponse(error));
    }
}

export const getWorkspacesUserIsMemberOfController = async (req, res) => {
    try {
        const response = await getWorkspacesUserIsMemberOfService(req.user);
        return res
           .status(StatusCodes.OK)
           .json(successResponse(response, 'Workspaces fetched successfully'));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error))
        }

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(internalErrorResponse(error))
    }
};

export const deleteWorkspaceController = async (req, res) => {
    try {
       const response = await deleteWorkspaceService(
        req.params.workspaceId,
        req.user
       );
       return res
          .status(StatusCodes.OK)
          .json(successResponse(response, 'Workspace deleted successfully')) ;
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res 
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(internalErrorResponse(error));
    }
};