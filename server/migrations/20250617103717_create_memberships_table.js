export function up(knex) {
  return knex.schema.createTable('memberships', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('team_id').unsigned().references('id').inTable('teams').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_id', 'team_id']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('memberships');
}
