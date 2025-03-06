import { StatusCodes } from 'http-status-codes';

import crudRepository from '../repositories/crudRepository.js'
import User from "../schema/users.schema.js"
import WorkSpace from "../schema/workspace.schema.js"
import ClientError from '../utils/errors/clientError.js'

const workspaceRepository = {
    ...crudRepository(WorkSpace),
    getWorkspaceByName: async function (workspacename) {
        const workspace = await WorkSpace.findOne({
            name: workspacename
        });

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspace;
    },
    getWorkspaceByJoinCode: async function (joinCode) {
        const workspace = await WorkSpace.findOne({
            name: joinCode
        });

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        return workspace;
    },
    addMemberToWorkspace: async function (workspaceId, memberId, role) {
        const workspace = await WorkSpace.findById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isValidUser = await User.findById(memberId);
        if(!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMemberAlreadyPartOfWorkspace = workspace.members.find(
            (member) => member.membersId == memberId
        );

        if(isMemberAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User already part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        workspace.members.push({
            memberId,
            role
        });

        await workspace.save();
        return workspace;
    },
    addChannelToWorkdspace: async function () {},
    fetchAllWorkspaceByMemberId: async function () {}
};

export default workspaceRepository;