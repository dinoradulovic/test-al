import db from "../../../db/init-db-connection";
import { Sequelize } from 'sequelize';
const Op = Sequelize.Op
import { RandomError } from '../../global/helpers/errors';

export default class ORM {
  static async findAll(model, options) {
    const { where, include, attributes, order } = options || {};
    const rows = await db[model].findAll({ where, include, order, attributes });

    const mappedRows = rows.map((row) => {
      return row.toJSON()
    })

    return mappedRows;
  }

  static async findById(model, id, options) {
    const row = await db[model].findByPk(id, options || {});

    if (!row) return {};
    return row.toJSON();
  }

  static async create(model, options) {
    const dbModel = db[model];
    const additionalOptions = {};

    if (options.associations) {
      additionalOptions.include = options.associations;
    }

    const dbResult = await dbModel.create({ ...options.fields, ...options.associations }, additionalOptions);

    return dbResult.toJSON();
  }

  static async update(modelName, options) {
    if (!options.where || !options.where.id || !modelName) {
      // TODO throw missing arguments
    }

    const model = db[modelName];
    const newModelFields = options.fields;
    const id = options.where.id;
    const associations = options.associations;
    const include = options.include || [];

    const rows = await model.findAll({ where: { id }, include });
    if (!rows.length) throw new RandomError(`Couldn't find a model '${modelName}' with ID: ${id}`);

    const row = rows[0];

    if (newModelFields) {
      Object.assign(row, newModelFields);
      await row.validate();
    }

    if (associations) {
      const associationNames = associations ? Object.keys(associations) : [];
      associationNames.forEach((key) => {
        const associationSet = associations[key];
        associationSet.forEach((newAssociation) => {
          const oldAssociation = row[key].find((oldRow) => oldRow.id === newAssociation.id);
          if (!oldAssociation) throw new RandomError(`Couldn't find an association '${key}' with ID: ${newAssociation.id}`);

          Object.assign(oldAssociation, newAssociation);
          oldAssociation.save();
        })
      });
    }

    row.save();
    return row.toJSON();
  }

  static async findOrCreate(model, fieldsToFindBy, moreFieldsToAdd) {
    const res = await db[model].findOrCreate({
      where: fieldsToFindBy,
      defaults: moreFieldsToAdd
    });

    const row = res[0].toJSON();

    const created = res[1];

    return [row, created];
  }

  // create or update
  static async createOrUpdate(model, fieldsToFindBy, moreFieldsToAdd) {
    const values = { ...fieldsToFindBy, ...moreFieldsToAdd };

    const rows = await ORM.findAll(model, {
      where: fieldsToFindBy
    });

    if (rows[0]) {
      values.id = rows[0].id;
    }

    const [record, created] = await db[model].upsert(values, {
      returning: true
    });

    return [record.toJSON(), created];
  }

  static async searchAndFindAll(model, fieldToSearch, searchQuery) {
    return await db[model].findAll({
      where: {
        [fieldToSearch]: {
          [Op.like]: `%${searchQuery}%`
        }
      }
    });
  }

  static async delete(model, id) {
    const dbModel = db[model];
    const dbResult = await dbModel.destroy({ where: { id } });
    if (dbResult === 1) {
      return true;
    }

    return false;
  }
}
