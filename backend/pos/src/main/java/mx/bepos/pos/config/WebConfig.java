package mx.bepos.pos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",        // For local development
                    "http://192.168.0.21:5173",
                    "https://your-production-app.com", // Example production frontend domain
                    "http://192.168.0.21:8080",
                    "http://localhost:8080"     // Example for a specific tablet IP during testing
                    // Add other specific origins as needed
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
