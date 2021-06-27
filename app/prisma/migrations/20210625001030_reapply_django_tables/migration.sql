-- CreateTable
CREATE TABLE "admin_interface_theme" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "title_visible" BOOLEAN NOT NULL,
    "logo" VARCHAR(100) NOT NULL,
    "logo_visible" BOOLEAN NOT NULL,
    "css_header_background_color" VARCHAR(10) NOT NULL,
    "title_color" VARCHAR(10) NOT NULL,
    "css_header_text_color" VARCHAR(10) NOT NULL,
    "css_header_link_color" VARCHAR(10) NOT NULL,
    "css_header_link_hover_color" VARCHAR(10) NOT NULL,
    "css_module_background_color" VARCHAR(10) NOT NULL,
    "css_module_text_color" VARCHAR(10) NOT NULL,
    "css_module_link_color" VARCHAR(10) NOT NULL,
    "css_module_link_hover_color" VARCHAR(10) NOT NULL,
    "css_module_rounded_corners" BOOLEAN NOT NULL,
    "css_generic_link_color" VARCHAR(10) NOT NULL,
    "css_generic_link_hover_color" VARCHAR(10) NOT NULL,
    "css_save_button_background_color" VARCHAR(10) NOT NULL,
    "css_save_button_background_hover_color" VARCHAR(10) NOT NULL,
    "css_save_button_text_color" VARCHAR(10) NOT NULL,
    "css_delete_button_background_color" VARCHAR(10) NOT NULL,
    "css_delete_button_background_hover_color" VARCHAR(10) NOT NULL,
    "css_delete_button_text_color" VARCHAR(10) NOT NULL,
    "css" TEXT NOT NULL,
    "list_filter_dropdown" BOOLEAN NOT NULL,
    "related_modal_active" BOOLEAN NOT NULL,
    "related_modal_background_color" VARCHAR(10) NOT NULL,
    "related_modal_rounded_corners" BOOLEAN NOT NULL,
    "logo_color" VARCHAR(10) NOT NULL,
    "recent_actions_visible" BOOLEAN NOT NULL,
    "favicon" VARCHAR(100) NOT NULL,
    "related_modal_background_opacity" VARCHAR(5) NOT NULL,
    "env_name" VARCHAR(50) NOT NULL,
    "env_visible_in_header" BOOLEAN NOT NULL,
    "env_color" VARCHAR(10) NOT NULL,
    "env_visible_in_favicon" BOOLEAN NOT NULL,
    "related_modal_close_button_visible" BOOLEAN NOT NULL,
    "language_chooser_active" BOOLEAN NOT NULL,
    "language_chooser_display" VARCHAR(10) NOT NULL,
    "list_filter_sticky" BOOLEAN NOT NULL,
    "form_pagination_sticky" BOOLEAN NOT NULL,
    "form_submit_sticky" BOOLEAN NOT NULL,
    "css_module_background_selected_color" VARCHAR(10) NOT NULL,
    "css_module_link_selected_color" VARCHAR(10) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_group_permissions" (
    "id" BIGSERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content_type_id" INTEGER NOT NULL,
    "codename" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMPTZ(6),
    "is_superuser" BOOLEAN NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "date_joined" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_groups" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_admin_log" (
    "id" SERIAL NOT NULL,
    "action_time" TIMESTAMPTZ(6) NOT NULL,
    "object_id" TEXT,
    "object_repr" VARCHAR(200) NOT NULL,
    "action_flag" SMALLINT NOT NULL,
    "change_message" TEXT NOT NULL,
    "content_type_id" INTEGER,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_content_type" (
    "id" SERIAL NOT NULL,
    "app_label" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_migrations" (
    "id" BIGSERIAL NOT NULL,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_session" (
    "session_key" VARCHAR(40) NOT NULL,
    "session_data" TEXT NOT NULL,
    "expire_date" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("session_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_interface_theme.name_unique" ON "admin_interface_theme"("name");

-- CreateIndex
CREATE INDEX "admin_interface_theme_name_30bda70f_like" ON "admin_interface_theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group.name_unique" ON "auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_name_a6ea08ec_like" ON "auth_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions"("group_id", "permission_id");

-- CreateIndex
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions"("group_id");

-- CreateIndex
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission"("content_type_id", "codename");

-- CreateIndex
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "auth_permission"("content_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user.username_unique" ON "auth_user"("username");

-- CreateIndex
CREATE INDEX "auth_user_username_6821ab7c_like" ON "auth_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_groups_user_id_group_id_94350c0c_uniq" ON "auth_user_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "auth_user_groups_group_id_97559544" ON "auth_user_groups"("group_id");

-- CreateIndex
CREATE INDEX "auth_user_groups_user_id_6a12ed8b" ON "auth_user_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_user_permissions_user_id_permission_id_14a6b632_uniq" ON "auth_user_user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "auth_user_user_permissions_permission_id_1fbb5f2c" ON "auth_user_user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "auth_user_user_permissions_user_id_a95ead1b" ON "auth_user_user_permissions"("user_id");

-- CreateIndex
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log"("content_type_id");

-- CreateIndex
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "django_admin_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type"("app_label", "model");

-- CreateIndex
CREATE INDEX "django_session_expire_date_a5c62663" ON "django_session"("expire_date");

-- CreateIndex
CREATE INDEX "django_session_session_key_c0390e0f_like" ON "django_session"("session_key");

-- AddForeignKey
ALTER TABLE "auth_group_permissions" ADD FOREIGN KEY ("group_id") REFERENCES "auth_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_group_permissions" ADD FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_permission" ADD FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_groups" ADD FOREIGN KEY ("group_id") REFERENCES "auth_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_groups" ADD FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_user_permissions" ADD FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_user_user_permissions" ADD FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "django_admin_log" ADD FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "django_admin_log" ADD FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
