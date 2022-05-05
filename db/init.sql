create database if not exists recast;
use recast;

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status_code` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status_code` (`status_code`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`status_code`) REFERENCES `status` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=10009 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `report_type`;

CREATE TABLE `report_type` (
  `code` varchar(20) NOT NULL,
  `name` varchar(225) NOT NULL,
  `status_code` varchar(20) NOT NULL,
  PRIMARY KEY (`code`),
  KEY `status_code` (`status_code`),
  CONSTRAINT `report_type_ibfk_1` FOREIGN KEY (`status_code`) REFERENCES `status` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `project_report_con`;

CREATE TABLE `project_report_con` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `report_type_code` varchar(20) NOT NULL,
  `name` varchar(225) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `report_type_code` (`report_type_code`),
  CONSTRAINT `project_report_con_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `project_report_con_ibfk_2` FOREIGN KEY (`report_type_code`) REFERENCES `report_type` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=10110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `task_status`;
CREATE TABLE `task_status` (
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




DROP TABLE IF EXISTS `prj_rpt_analysis`;
CREATE TABLE `prj_rpt_analysis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `report_type_code` varchar(20) NOT NULL,
  `project_report_con_id` int NOT NULL,
  `task_name` varchar(200) NOT NULL,
  `task_status_code` varchar(20) NOT NULL,
  `comment` longtext,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `report_type_code` (`report_type_code`),
  KEY `task_status_code` (`task_status_code`),
  KEY `prj_rpt_analysis_ibfk_3` (`project_report_con_id`),
  CONSTRAINT `prj_rpt_analysis_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `prj_rpt_analysis_ibfk_2` FOREIGN KEY (`report_type_code`) REFERENCES `report_type` (`code`),
  CONSTRAINT `prj_rpt_analysis_ibfk_3` FOREIGN KEY (`project_report_con_id`) REFERENCES `project_report_con` (`id`),
  CONSTRAINT `prj_rpt_analysis_ibfk_4` FOREIGN KEY (`task_status_code`) REFERENCES `task_status` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=541 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `analysis_report`;
CREATE TABLE `analysis_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prj_rpt_analysis_id` int DEFAULT NULL,
  `column_names` longtext,
  `report_type` varchar(45) DEFAULT NULL,
  `report_id` varchar(200) DEFAULT NULL,
  `report_name` mediumtext,
  `report_updated_date` varchar(200) DEFAULT NULL,
  `report_creation_date` datetime DEFAULT NULL,
  `folder_path` mediumtext,
  `number_of_instances` int DEFAULT NULL,
  `number_of_recurring_instances` int DEFAULT NULL,
  `average_run_time` int DEFAULT NULL,
  `total_size` int DEFAULT NULL,
  `total_universe_count` int DEFAULT NULL,
  `number_of_blocks` int DEFAULT NULL,
  `number_of_formulas` int DEFAULT NULL,
  `number_of_tabs` int DEFAULT NULL,
  `number_of_filters` int DEFAULT NULL,
  `number_of_columns` int DEFAULT NULL,
  `number_of_query` int DEFAULT NULL,
  `universe_name` varchar(1024) DEFAULT NULL,
  `universe_path` mediumtext,
  `is_report_scheduled` tinyint DEFAULT NULL,
  `universe_id` int DEFAULT NULL,
  `number_of_rows` int DEFAULT NULL,
  `is_actively_used` tinyint DEFAULT NULL,
  `number_of_failures` int DEFAULT NULL,
  `report_user` varchar(45) DEFAULT NULL,
  `is_report_published` tinyint DEFAULT NULL,
  `commonality_factor` int DEFAULT NULL,
  `table_column_map` longtext,
  `query_list` longtext,
  `table_set` longtext,
  `chart_set` longtext,
  `number_of_report_pages` int DEFAULT NULL,
  `number_of_variables` int DEFAULT NULL,
  `number_of_conditional_blocks` int DEFAULT NULL,
  `pivot_table_set` longtext,
  `complexity` double DEFAULT NULL,
  `tab_list` longtext,
  `number_of_images` int DEFAULT NULL,
  `number_of_embedded_elements` int DEFAULT NULL,
  `exception_report` longtext,
  `variable_list` longtext,
  `alerters` longtext,
  `input_control` longtext,
  `data_filters` longtext,
  `query_filters` longtext,
  `page_container` longtext,
  `container_count` varchar(200) DEFAULT NULL,
  `page_count` varchar(200) DEFAULT NULL,
  `prompt_pages` longtext,
  `prompt_count` int DEFAULT NULL,
  `conditional_blocks` longtext,
  `workbook_name` longtext,
  PRIMARY KEY (`id`),
  KEY `analyzer_project_fk_idx` (`prj_rpt_analysis_id`),
  CONSTRAINT `analyzer_project_fk` FOREIGN KEY (`prj_rpt_analysis_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `analysis_reports_table`;
CREATE TABLE `analysis_reports_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `report_Id` int NOT NULL,
  `report_name` varchar(200) DEFAULT NULL,
  `data_source` varchar(200) DEFAULT NULL,
  `query_name` varchar(200) DEFAULT NULL,
  `table_names` varchar(200) DEFAULT NULL,
  `table_alias_names` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `analysis_reports_table_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1904 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `analysis_reports_visualization`;
CREATE TABLE `analysis_reports_visualization` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `report_Id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_tab_id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_tab_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `element_type` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `element_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `always_flag` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `x_position` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `y_position` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `minimal_width` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `minimal_height` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `background_color` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `border` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `font` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `allignment` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `formula` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `element_id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `background_color_alpha` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `chart_type` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `chart_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `chart_title` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `chart_legend` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `chart_plot_area` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `chart_axes` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `parent_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `maximum_width` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `maximum_height` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `horizontal_anchor_type` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `horizontal_anchor_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `vertical_anchor_type` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `vertical_anchor_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `alerter_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `layout_list` longtext COLLATE utf8_unicode_ci,
  `style_rules` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `analysis_reports_visualization_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20469 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `analysis_semantic_columns`;
CREATE TABLE `analysis_semantic_columns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `semantic_id` int NOT NULL,
  `semantic_name` varchar(200) DEFAULT NULL,
  `column_qualification` varchar(200) DEFAULT NULL,
  `column_names` varchar(200) DEFAULT NULL,
  `data_type` varchar(200) DEFAULT NULL,
  `functions` longtext,
  `object_identifier` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `analysis_semantic_columns_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=290018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `commonality_params`;
CREATE TABLE `commonality_params` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `report_id` varchar(200) DEFAULT NULL,
  `report_name` varchar(200) DEFAULT NULL,
  `data_source_name` varchar(200) DEFAULT NULL,
  `table_name` varchar(200) DEFAULT NULL,
  `column_name` varchar(200) DEFAULT NULL,
  `column_Type` varchar(200) DEFAULT NULL,
  `column_Alias` varchar(200) DEFAULT NULL,
  `dimension_list` longtext,
  `measure_list` longtext,
  `variable_list` longtext,
  `attribute_list` longtext,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `commonality_params_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8776 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `commonality_report`;
CREATE TABLE `commonality_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prj_rpt_analysis_id` int NOT NULL,
  `analysis_report1_id` int NOT NULL,
  `analysis_report2_id` int NOT NULL,
  `commonality` int NOT NULL,
  `identical` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commonality_report_fk1_idx` (`prj_rpt_analysis_id`),
  KEY `commonality_report_fk2_idx` (`analysis_report1_id`),
  KEY `commonality_report_fk3_idx` (`analysis_report2_id`),
  CONSTRAINT `commonality_report_fk1` FOREIGN KEY (`prj_rpt_analysis_id`) REFERENCES `prj_rpt_analysis` (`id`),
  CONSTRAINT `commonality_report_fk2` FOREIGN KEY (`analysis_report1_id`) REFERENCES `analysis_report` (`id`),
  CONSTRAINT `commonality_report_fk3` FOREIGN KEY (`analysis_report2_id`) REFERENCES `analysis_report` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4730 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `complexity_report`;
CREATE TABLE `complexity_report` (
  `complexity_Id` int NOT NULL AUTO_INCREMENT,
  `task_Id` int NOT NULL,
  `report_Id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_Name` varchar(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `complexity_Status` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `complexity_parameter` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  PRIMARY KEY (`complexity_Id`),
  KEY `task_Id` (`task_Id`),
  CONSTRAINT `complexity_report_ibfk_1` FOREIGN KEY (`task_Id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2342 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `connection_path`;
CREATE TABLE `connection_path` (
  `path_Id` int NOT NULL AUTO_INCREMENT,
  `connection_Id` int NOT NULL,
  `path_Name` varchar(200) NOT NULL,
  PRIMARY KEY (`path_Id`),
  KEY `connection_Id` (`connection_Id`),
  CONSTRAINT `connection_path_ibfk_1` FOREIGN KEY (`connection_Id`) REFERENCES `project_report_con` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `folder_task`;
CREATE TABLE `folder_task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prj_folder_analysis_id` int DEFAULT NULL,
  `report_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_name` mediumtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `report_path` mediumtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `analyzer_folder_fk_idx` (`prj_folder_analysis_id`),
  CONSTRAINT `analyzer_folder_fk` FOREIGN KEY (`prj_folder_analysis_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=943 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `hibernate_sequence`;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE `user_profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `emailid` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10025 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `number_attemps` int NOT NULL DEFAULT '0',
  `account_locked` bit(1) NOT NULL,
  `account_enabled` bit(1) NOT NULL,
  `user_profile_id` int NOT NULL,
  PRIMARY KEY (`user_name`),
  KEY `user_profile_id` (`user_profile_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `password_reset_token`;
CREATE TABLE `password_reset_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(400) NOT NULL,
  `expiry_date` timestamp NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `pw_changed` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `user_name` (`user_name`),
  CONSTRAINT `password_reset_token_ibfk_1` FOREIGN KEY (`user_name`) REFERENCES `user` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `prj_rpt_action_type`;
CREATE TABLE `prj_rpt_action_type` (
  `code` varchar(80) NOT NULL,
  `name` varchar(225) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `rpt_con_param_type`;
CREATE TABLE `rpt_con_param_type` (
  `code` varchar(80) NOT NULL,
  `name` varchar(225) NOT NULL,
  `report_type_code` varchar(20) NOT NULL,
  PRIMARY KEY (`code`),
  KEY `report_type_code` (`report_type_code`),
  CONSTRAINT `rpt_con_param_type_ibfk_1` FOREIGN KEY (`report_type_code`) REFERENCES `report_type` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `prj_rpt_con_params`;
CREATE TABLE `prj_rpt_con_params` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_report_con_id` int NOT NULL,
  `rpt_con_param_type_code` varchar(20) NOT NULL,
  `rpt_con_param_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_report_con_id` (`project_report_con_id`),
  KEY `rpt_con_param_type_code` (`rpt_con_param_type_code`),
  CONSTRAINT `prj_rpt_con_params_ibfk_1` FOREIGN KEY (`project_report_con_id`) REFERENCES `project_report_con` (`id`),
  CONSTRAINT `prj_rpt_con_params_ibfk_2` FOREIGN KEY (`rpt_con_param_type_code`) REFERENCES `rpt_con_param_type` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=12270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `prj_rpt_migrator`;
CREATE TABLE `prj_rpt_migrator` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `source_report_type_code` varchar(20) NOT NULL,
  `target_report_type_code` varchar(20) NOT NULL,
  `project_report_source_con_id` int NOT NULL,
  `project_report_target_con_id` int NOT NULL,
  `task_name` varchar(200) NOT NULL,
  `task_status_code` varchar(20) NOT NULL,
  `comment` longtext,
  `source_task_name` varchar(255) DEFAULT NULL,
  `source_universe_name` varchar(255) DEFAULT NULL,
  `source_universe_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `source_report_type_code` (`source_report_type_code`),
  KEY `target_report_type_code` (`target_report_type_code`),
  KEY `task_status_code` (`task_status_code`),
  KEY `project_report_source_con_id` (`project_report_source_con_id`),
  KEY `project_report_target_con_id` (`project_report_target_con_id`),
  CONSTRAINT `prj_rpt_migrator_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `prj_rpt_migrator_ibfk_2` FOREIGN KEY (`source_report_type_code`) REFERENCES `report_type` (`code`),
  CONSTRAINT `prj_rpt_migrator_ibfk_3` FOREIGN KEY (`target_report_type_code`) REFERENCES `report_type` (`code`),
  CONSTRAINT `prj_rpt_migrator_ibfk_4` FOREIGN KEY (`project_report_source_con_id`) REFERENCES `project_report_con` (`id`),
  CONSTRAINT `prj_rpt_migrator_ibfk_5` FOREIGN KEY (`project_report_target_con_id`) REFERENCES `project_report_con` (`id`),
  CONSTRAINT `prj_rpt_migrator_ibfk_6` FOREIGN KEY (`task_status_code`) REFERENCES `task_status` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `project_user_xref`;
CREATE TABLE `project_user_xref` (
  `project_id` int NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`project_id`,`user_name`),
  KEY `user_name` (`user_name`),
  CONSTRAINT `project_user_xref_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `project_user_xref_ibfk_2` FOREIGN KEY (`user_name`) REFERENCES `user` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `report_path`;
CREATE TABLE `report_path` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `path_Id` int NOT NULL,
  `report_Id` varchar(200) NOT NULL,
  `report_Name` varchar(200) NOT NULL,
  `report_Size` varchar(200) NOT NULL,
  `report_Date` varchar(200) NOT NULL,
  `universes` varchar(200) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `path_Id` (`path_Id`),
  CONSTRAINT `report_path_ibfk_1` FOREIGN KEY (`path_Id`) REFERENCES `connection_path` (`path_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8461 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `project_report_target_con`;

CREATE TABLE `project_report_target_con` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_type_code` varchar(20) NOT NULL,
  `name` varchar(225) NOT NULL,
  `status` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_report_target_con_ibfk_1_idx` (`report_type_code`),
  CONSTRAINT `project_report_target_con_ibfk_1` FOREIGN KEY (`report_type_code`) REFERENCES `report_type` (`code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `rpt_target_con_param_type`;
CREATE TABLE `rpt_target_con_param_type` (
  `code` varchar(80) NOT NULL,
  `name` varchar(225) NOT NULL,
  `report_type_code` varchar(20) NOT NULL,
  PRIMARY KEY (`code`),
  KEY `rpt_target_con_param_type_ibfk_1_idx` (`report_type_code`),
  CONSTRAINT `rpt_target_con_param_type_ibfk_1` FOREIGN KEY (`report_type_code`) REFERENCES `report_type` (`code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `prj_rpt_target_con_params`;
CREATE TABLE `prj_rpt_target_con_params` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_report_target_con_id` int NOT NULL,
  `rpt_target_con_param_type_code` varchar(20) NOT NULL,
  `rpt_target_con_param_value` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prj_rpt_target_con_params_ibfk_1_idx` (`project_report_target_con_id`),
  KEY `prj_rpt_target_con_params_ibfk_2_idx` (`rpt_target_con_param_type_code`),
  CONSTRAINT `prj_rpt_target_con_params_ibfk_1` FOREIGN KEY (`project_report_target_con_id`) REFERENCES `project_report_target_con` (`id`),
  CONSTRAINT `prj_rpt_target_con_params_ibfk_2` FOREIGN KEY (`rpt_target_con_param_type_code`) REFERENCES `rpt_target_con_param_type` (`code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `report_strategizer`;

CREATE TABLE `report_strategizer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_task_id` int NOT NULL,
  `task_name` varchar(200) NOT NULL,
  `task_status_code` varchar(20) NOT NULL,
  `source_report_type` varchar(200) DEFAULT NULL,
  `target_report_type` varchar(200) DEFAULT NULL,
  `project_report_target_con_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_status_code` (`task_status_code`),
  KEY `fk_target_connection_id` (`project_report_target_con_id`),
  CONSTRAINT `fk_target_connection_id` FOREIGN KEY (`project_report_target_con_id`) REFERENCES `project_report_target_con` (`id`),
  CONSTRAINT `report_strategizer_ibfk_1` FOREIGN KEY (`task_status_code`) REFERENCES `task_status` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




DROP TABLE IF EXISTS `migrator_status`;
CREATE TABLE `migrator_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) DEFAULT NULL,
  `report_tab_id` varchar(200) DEFAULT NULL,
  `status_message` varchar(200) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `macro_runtime` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_id` (`report_id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `migrator_status_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17764 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_name` varchar(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `sapbo_powerbi_mapping`;
CREATE TABLE `sapbo_powerbi_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sapbo_Component` varchar(200) DEFAULT NULL,
  `powerbi_Component` varchar(200) DEFAULT NULL,
  `powerbi_Component_Availability` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `sapbo_tableau_mapping`;
CREATE TABLE `sapbo_tableau_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sapbo_Component` varchar(200) DEFAULT NULL,
  `tableau_Component` varchar(200) DEFAULT NULL,
  `tableau_Component_Availability` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `strategizer_calculated_column`;
CREATE TABLE `strategizer_calculated_column` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) DEFAULT NULL,
  `report_tab_id` varchar(200) DEFAULT NULL,
  `formula` longtext,
  `calculated_formula` longtext,
  `column_qualification` varchar(200) DEFAULT NULL,
  `formula_name` varchar(200) DEFAULT NULL,
  `report_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `strategizer_calculated_column_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `strategizer_calculations`;
CREATE TABLE `strategizer_calculations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `calculation_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `column_names` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `formula` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `report_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `strategizer_calculations_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `strategizer_datasource_model`;

CREATE TABLE `strategizer_datasource_model` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Ltable` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Lcolumn` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Rtable` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Rcolumn` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `strategizer_datasource_model_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



DROP TABLE IF EXISTS `strategizer_metadata_columns`;
CREATE TABLE `strategizer_metadata_columns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `metadata_column_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `datatype` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `semantics_type` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `table_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `value_type` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `strategizer_metadata_columns_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;



DROP TABLE IF EXISTS `strategizer_query_conversion`;
CREATE TABLE `strategizer_query_conversion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) DEFAULT NULL,
  `database_type` varchar(200) DEFAULT NULL,
  `hostname` varchar(200) DEFAULT NULL,
  `database_name` varchar(200) DEFAULT NULL,
  `query_statement` longtext,
  `converted_query_statement` longtext,
  `query_name` varchar(200) DEFAULT NULL,
  `converted_query_name` varchar(200) DEFAULT NULL,
  `report_name` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `strategizer_query_conversion_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `strategizer_visualization_conversion`;
CREATE TABLE `strategizer_visualization_conversion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `strat_task_id` int NOT NULL,
  `report_id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_tab_id` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_tab_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_component_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_component_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_position_x` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_position_y` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_minimal_width` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_minimal_height` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_position_x` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_position_y` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_minimal_width` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `target_minimal_height` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `formula_name` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `font` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `value_type` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `parent_element` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `report_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `calculations` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `source_element_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,	
  `strategizer_conversion_status` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,	
  `strategizer_conversion_status_reason` longtext COLLATE utf8_unicode_ci,	
  `strategizer_conversion_hint` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `strat_task_id` (`strat_task_id`),
  CONSTRAINT `strategizer_visualization_conversion_ibfk_1` FOREIGN KEY (`strat_task_id`) REFERENCES `report_strategizer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=588 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;



DROP TABLE IF EXISTS `universe_report`;

CREATE TABLE `universe_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL,
  `description` mediumtext,
  `items` longtext,
  `prj_rpt_analysis_id` int DEFAULT NULL,
  `universe_source_id` varchar(45) DEFAULT NULL,
  `tables` longtext,
  `joins` longtext,
  `data_sources` longtext,
  `filters` longtext,
  `connection_class` longtext,
  PRIMARY KEY (`id`),
  KEY `universe_report_fk1_idx` (`prj_rpt_analysis_id`),
  CONSTRAINT `universe_report_fk1` FOREIGN KEY (`prj_rpt_analysis_id`) REFERENCES `prj_rpt_analysis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=719 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



DROP TABLE IF EXISTS `user_role_xref`;

CREATE TABLE `user_role_xref` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `role_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`,`role_name`),
  KEY `role_name` (`role_name`),
  CONSTRAINT `user_role_xref_ibfk_1` FOREIGN KEY (`user_name`) REFERENCES `user` (`user_name`),
  CONSTRAINT `user_role_xref_ibfk_2` FOREIGN KEY (`role_name`) REFERENCES `role` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




DROP TABLE IF EXISTS `yes_no_ind`;
CREATE TABLE `yes_no_ind` (
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `similarity_matrix`;

CREATE TABLE `similarity_matrix` (
  `id` varchar(50) NOT NULL,
  `task_id` int DEFAULT NULL,
  `report_id1` int DEFAULT NULL,
  `report_id2` int DEFAULT NULL,
  `step1` varchar(1) DEFAULT 'N',
  `step2` varchar(1) DEFAULT 'N',
  `step3` varchar(1) DEFAULT 'N',
  `step4` varchar(1) DEFAULT 'N',
  `step5` varchar(1) DEFAULT 'N',
  `step6` varchar(1) DEFAULT 'N',
  `total_score` int DEFAULT '0',
  `cluster_column` varchar(45) DEFAULT NULL,
  `step1_description` varchar(255) DEFAULT NULL,
  `step2_description` longtext,
  `step3_description` varchar(255) DEFAULT NULL,
  `step4_description` varchar(255) DEFAULT NULL,
  `step5_description` varchar(255) DEFAULT NULL,
  `step6_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `status` (`code`,`name`) VALUES ('ACT','Active');
INSERT INTO `status` (`code`,`name`) VALUES ('INACT','Inactive');


INSERT INTO `project` (`id`,`name`,`start_date`,`end_date`,`status_code`) VALUES (100,'Recast','2021-06-22','2021-12-20','ACT');

INSERT INTO `report_type` (`code`,`name`,`status_code`) VALUES ('BO','SAP Business Object','ACT');
INSERT INTO `report_type` (`code`,`name`,`status_code`) VALUES ('COGNOS','IBM Cognos','ACT');
INSERT INTO `report_type` (`code`,`name`,`status_code`) VALUES ('MSTR','Microstrategy','ACT');
INSERT INTO `report_type` (`code`,`name`,`status_code`) VALUES ('POWERBI','Power BI','ACT');
INSERT INTO `report_type` (`code`,`name`,`status_code`) VALUES ('TABLEAU','Tableau','ACT');


INSERT INTO `task_status` (`code`,`name`) VALUES ('FAIL','Failed');
INSERT INTO `task_status` (`code`,`name`) VALUES ('FIN','Finished');
INSERT INTO `task_status` (`code`,`name`) VALUES ('INPROG','In-Progress');
INSERT INTO `task_status` (`code`,`name`) VALUES ('SUB','Submitted');

INSERT INTO `user_profile` VALUES (1,'admin','admin@test.com','9999999999');

INSERT INTO `user` VALUES ('admin','sgfsdfdfhb',1,_binary '\0',_binary '',1);


INSERT INTO `prj_rpt_action_type` (`code`,`name`) VALUES ('ANALYSIS','Analysis');
INSERT INTO `prj_rpt_action_type` (`code`,`name`) VALUES ('CONVERSION','Conversion');
INSERT INTO `prj_rpt_action_type` (`code`,`name`) VALUES ('STRATEGY','Strategy');


INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('BO_HOST_NAME','Host Name','BO');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('BO_PASSWORD','Password','BO');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('BO_PORT','Port','BO');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('BO_USERNAME','Username','BO');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('COGNOS_HOST_NAME','Host Name','COGNOS');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('COGNOS_NAMESPACE','Namespace','COGNOS');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('COGNOS_PASSWORD','Password','COGNOS');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('COGNOS_PATH','Path','COGNOS');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('COGNOS_PORT','Port','COGNOS');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('COGNOS_USERNAME','Username','COGNOS');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('MSTR_HOST_NAME','Host Name','MSTR');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('MSTR_PASSWORD','Password','MSTR');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('MSTR_PATH','Path','MSTR');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('MSTR_PORT','Port','MSTR');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('MSTR_USERNAME','Username','MSTR');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('PBI_HOST_NAME','Host Name','POWERBI');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_PATH','Path','TABLEAU');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_CONNECTION_TYPE','Connection Type','TABLEAU');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_CONTENT_URL','Content Url','TABLEAU');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_HOST_NAME','Host Name','TABLEAU');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_PASSWORD','Password','TABLEAU');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_USERNAME','Username','TABLEAU');
INSERT INTO `rpt_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('TAB_EXTRACT_TYPE', 'Extract Type', 'TABLEAU');

INSERT INTO `rpt_target_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('PBI_PASSWORD','Password','POWERBI');
INSERT INTO `rpt_target_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('PBI_SERVICE_URL','Service Url','POWERBI');
INSERT INTO `rpt_target_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('PBI_USERNAME','Username','POWERBI');
INSERT INTO `rpt_target_con_param_type` (`code`,`name`,`report_type_code`) VALUES ('PBI_WORKSPACE','Workspace','POWERBI');

INSERT INTO `role` (`role_name`,`description`) VALUES ('ROLE_ADMIN','Administrator');
INSERT INTO `role` (`role_name`,`description`) VALUES ('ROLE_CHECKER','Checker/Project Lead');
INSERT INTO `role` (`role_name`,`description`) VALUES ('ROLE_MAKER','Maker/Developer');


INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (1,'Line','LineChart','1');
INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (2,'LinearGauge','Gauge','2');
INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (3,'GeoPie','Map','1');
INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (4,'VerticalBar','ClusteredColumnChart','1');
INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (5,'StringCell','TextBox','1');
INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (6,'NumericCell','TextBox','1');
INSERT INTO `sapbo_powerbi_mapping` (`id`,`sapbo_Component`,`powerbi_Component`,`powerbi_Component_Availability`) VALUES (7,'DynamicCell','Card','1');


INSERT INTO `user_role_xref` (`id`,`user_name`,`role_name`) VALUES (1,'admin','ROLE_ADMIN');

INSERT INTO `yes_no_ind` (`code`,`name`) VALUES ('N','No');
INSERT INTO `yes_no_ind` (`code`,`name`) VALUES ('Y','Yes');

