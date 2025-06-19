export async function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id');                 // user id
    table.string('username').notNullable(); // required username
    table.string('email').unique().notNullable(); // unique email
    table.string('password').notNullable();  // hashed password
    table.timestamps(true, true);            // created_at and updated_at
  });
}

export async function down(knex) {
  return knex.schema.dropTable('users');
}
