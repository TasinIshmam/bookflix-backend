/*
  Warnings:

  - You are about to drop the `admin_interface_theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_group_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_user_permissions` table. If the table is not empty, all the data it contains will be lost.
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
ALTER TABLE "django_admin_log" DROP CONSTRAINT "django_admin_log_content_type_id_fkey";

-- DropForeignKey
ALTER TABLE "django_admin_log" DROP CONSTRAINT "django_admin_log_user_id_fkey";

-- DropTable
DROP TABLE "admin_interface_theme";

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
DROP TABLE "django_admin_log";

-- DropTable
DROP TABLE "django_content_type";

-- DropTable
DROP TABLE "django_migrations";

-- DropTable
DROP TABLE "django_session";
