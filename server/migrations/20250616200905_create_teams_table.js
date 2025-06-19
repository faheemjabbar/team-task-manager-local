export async function up(knex) {
  return knex.schema.createTable('teams', table => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('teams');
}
