import { controllers } from '../db';
import log from '../utils/log';
import STATUS from '../utils/statusEnum';

const registerController = (_controller) => {
  return new Promise((resolve, reject) => {
    const id = `${_controller.manufacturer}-${_controller.model}-${_controller.serial}`;
    controllers.updateOne(
      {id: id},
      {
        $set: {
          core: _controller.core? _controller.core:process.env.DIRECTOR_CORE_ID,
          realm: _controller.realm? _controller.realm:'ROOT',
          id: id,
          status: STATUS.OK,
          label: `${_controller.manufacturer}-${_controller.model}`,
          ..._controller
        }
      },
      {upsert: true}
    )
      .then(() => {
        log('info','core/controllers',`Registered ${id}`);
        resolve(controllers.findOne({id: id}));
      })
      .catch(e => reject(e));
  });
};


export default registerController
