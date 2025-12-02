package com.chopadelab.core.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class RenderDatabaseConfig {

    @Bean
    @ConditionalOnExpression("!'${DATABASE_URL:}'.isEmpty()")
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");
        log.info("Found DATABASE_URL environment variable. Parsing configuration...");

        // Handle JDBC format if present (strip jdbc: prefix)
        if (databaseUrl.startsWith("jdbc:")) {
            databaseUrl = databaseUrl.substring(5);
        }

        URI dbUri = new URI(databaseUrl);

        String username = dbUri.getUserInfo().split(":")[0];
        String password = dbUri.getUserInfo().split(":")[1];
        String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();

        log.info("Configuring DataSource with URL: {}", dbUrl);
        log.info("Database User: {}", username);

        return DataSourceBuilder.create()
                .url(dbUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
