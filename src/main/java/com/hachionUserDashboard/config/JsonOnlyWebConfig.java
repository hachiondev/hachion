package com.hachionUserDashboard.config;

import java.util.Iterator;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JsonOnlyWebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer c) {
        // Prefer JSON; do not use path extensions or URL params for content-type.
        c.favorPathExtension(false)
         .favorParameter(false)
         .ignoreAcceptHeader(false)
         .defaultContentType(MediaType.APPLICATION_JSON);
    }

    // IMPORTANT: extend (keep defaults), do NOT clear/replace
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // 1) Remove ONLY the XML converter if present (so responses won't negotiate XML)
        for (Iterator<HttpMessageConverter<?>> it = converters.iterator(); it.hasNext();) {
            HttpMessageConverter<?> conv = it.next();
            if (conv instanceof MappingJackson2XmlHttpMessageConverter) {
                it.remove();
            }
        }

        // 2) Ensure we have our JSON converter with the desired ObjectMapper
        boolean hasJson = converters.stream().anyMatch(c -> c instanceof MappingJackson2HttpMessageConverter);
        if (!hasJson) {
            converters.add(mappingJackson2HttpMessageConverter());
        }

        // 3) Ensure non-JSON converters that you NEED remain (for images/files/strings)
        boolean hasResource = converters.stream().anyMatch(c -> c instanceof ResourceHttpMessageConverter);
        if (!hasResource) converters.add(new ResourceHttpMessageConverter());

        boolean hasBytes = converters.stream().anyMatch(c -> c instanceof ByteArrayHttpMessageConverter);
        if (!hasBytes) converters.add(new ByteArrayHttpMessageConverter());

        boolean hasString = converters.stream().anyMatch(c -> c instanceof StringHttpMessageConverter);
        if (!hasString) converters.add(new StringHttpMessageConverter());
    }

    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        ObjectMapper om = new ObjectMapper();
        om.registerModule(new JavaTimeModule());
        om.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        om.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        MappingJackson2HttpMessageConverter json = new MappingJackson2HttpMessageConverter(om);
        json.setSupportedMediaTypes(List.of(MediaType.APPLICATION_JSON));
        return json;
    }
}