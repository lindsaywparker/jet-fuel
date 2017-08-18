
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function (table) {
      table.increments('id').primary();
      table.string('folderName').unique();

      table.timestamps(true, true);
    }),

    knex.schema.createTable('links', function (table) {
      table.increments('id').primary();
      table.string('linkLabel');
      table.string('linkLong').unique();
      table.string('linkShort');
      table.integer('folderID').unsigned();
      table.foreign('folderID').references('folders.id');

      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('folders'),
  ]);
};
