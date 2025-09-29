package com.hachionUserDashboard.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.List;

@Configuration
public class JsonOnlyWebConfig implements WebMvcConfigurer {

	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer c) {
		c.favorPathExtension(false).favorParameter(false).ignoreAcceptHeader(false)
				.defaultContentType(MediaType.APPLICATION_JSON);
	}

	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
		// Wipe whatever Spring auto-registered (including any XML converters)
		converters.clear();
		converters.add(mappingJackson2HttpMessageConverter());
	}

	@Bean
	public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
		ObjectMapper om = new ObjectMapper();
		om.registerModule(new JavaTimeModule());
		om.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		MappingJackson2HttpMessageConverter json = new MappingJackson2HttpMessageConverter(om);
		json.setSupportedMediaTypes(List.of(MediaType.APPLICATION_JSON));
		return json;
	}
}