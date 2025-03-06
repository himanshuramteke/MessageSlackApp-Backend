import Channel from '../schema/channel.schema.js';
import crudRepository from './crudRepository.js';

const channelRepository = {
    ...crudRepository(Channel)
};

export default channelRepository