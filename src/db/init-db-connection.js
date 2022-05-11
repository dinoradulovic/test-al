import Sequelize from 'sequelize';
import path from 'path';

import { findNestedFiles } from '../features/global/helpers/misc-helpers';


const db = {};

export class SequelizeConnection {
    constructor(database, username, password, dbConfig) {
        const sequelize = new Sequelize(database, username, password, dbConfig);

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;
    }

    setupModels() {
        const { sequelize } = db;
        const featuresDir = path.join(__dirname, '../features');

        findNestedFiles(featuresDir, /\model.js$/, (filename) => {
            let model = require(filename).default;
            if (model.init) {
                model.init(sequelize);
                db[model.name] = model;
            }
        });

        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

    }
}

export default db;
