/*
  Warnings:

  - You are about to drop the `auth_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_group_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_user_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_book_authors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_book_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `django_admin_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `django_content_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `django_migrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `django_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth_group_permissions" DROP CONSTRAINT "auth_group_permissions_group_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_group_permissions" DROP CONSTRAINT "auth_group_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_permission" DROP CONSTRAINT "auth_permission_content_type_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_groups" DROP CONSTRAINT "auth_user_groups_group_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_groups" DROP CONSTRAINT "auth_user_groups_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_user_permissions" DROP CONSTRAINT "auth_user_user_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_user_user_permissions" DROP CONSTRAINT "auth_user_user_permissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "core_book_authors" DROP CONSTRAINT "core_book_authors_author_id_fkey";

-- DropForeignKey
ALTER TABLE "core_book_authors" DROP CONSTRAINT "core_book_authors_book_id_fkey";

-- DropForeignKey
ALTER TABLE "core_book_genres" DROP CONSTRAINT "core_book_genres_book_id_fkey";

-- DropForeignKey
ALTER TABLE "core_book_genres" DROP CONSTRAINT "core_book_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "django_admin_log" DROP CONSTRAINT "django_admin_log_content_type_id_fkey";

-- DropForeignKey
ALTER TABLE "django_admin_log" DROP CONSTRAINT "django_admin_log_user_id_fkey";

-- DropTable
DROP TABLE "auth_group";

-- DropTable
DROP TABLE "auth_group_permissions";

-- DropTable
DROP TABLE "auth_permission";

-- DropTable
DROP TABLE "auth_user";

-- DropTable
DROP TABLE "auth_user_groups";

-- DropTable
DROP TABLE "auth_user_user_permissions";

-- DropTable
DROP TABLE "core_author";

-- DropTable
DROP TABLE "core_book";

-- DropTable
DROP TABLE "core_book_authors";

-- DropTable
DROP TABLE "core_book_genres";

-- DropTable
DROP TABLE "core_genre";

-- DropTable
DROP TABLE "django_admin_log";

-- DropTable
DROP TABLE "django_content_type";

-- DropTable
DROP TABLE "django_migrations";

-- DropTable
DROP TABLE "django_session";
