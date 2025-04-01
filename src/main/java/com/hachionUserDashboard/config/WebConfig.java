package com.hachionUserDashboard.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration

//public class WebConfig implements WebMvcConfigurer {
//	
//
//    @Value("${upload.path}")
//    private String uploadPath; // Load from application.properties
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/uploads/images/**")
//                .addResourceLocations("file:" + uploadPath + "/images/");
//
//        registry.addResourceHandler("/uploads/pdf/**")
//                .addResourceLocations("file:" + uploadPath + "/pdfs/");
//        registry.addResourceHandler("/static/**")
//        .addResourceLocations("file:/home/cpanhach/public_html/static/");
//    }
//}
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${upload.path}")
    private String uploadPath; // Load from application.properties

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve all files inside /uploads/ and its subdirectories
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");

        // Serve specific folders (optional, already covered by "/uploads/**")
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + uploadPath + "/images/");

        registry.addResourceHandler("/uploads/pdf/**")
                .addResourceLocations("file:" + uploadPath + "/pdfs/");

        // Serve static files from another location
        registry.addResourceHandler("/static/**")
                .addResourceLocations("file:/home/cpanhach/public_html/static/");
    }
}


