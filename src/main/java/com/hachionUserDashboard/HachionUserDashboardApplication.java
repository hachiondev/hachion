package com.hachionUserDashboard;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EnableScheduling
@ComponentScan(basePackages = { "com.hachionUserDashboard" })
public class HachionUserDashboardApplication extends SpringBootServletInitializer {
	
	public static void main(String[] args) {
		SpringApplication.run(HachionUserDashboardApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(HachionUserDashboardApplication.class);
	}

	@Bean
	public CommandLineRunner run(DataSource dataSource) {
		return args -> {
			try (Connection connection = dataSource.getConnection()) {
				System.out.println("Connected to database: " + connection.getCatalog());
			} catch (SQLException e) {
				e.printStackTrace();
			}
		};
	}
}
