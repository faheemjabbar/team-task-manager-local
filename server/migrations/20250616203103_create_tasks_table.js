export async function up(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.date('due_date');
    table.string('status').defaultTo('pending');
    table
      .integer('team_id')
      .references('id')
      .inTable('teams')
      .onDelete('CASCADE');
    table
      .integer('assignee_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('tasks');
}
