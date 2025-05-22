package com.hachionUserDashboard.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.entity.RegisterStudent;

import com.hachionUserDashboard.repository.RegisterStudentRepository;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

	private final RegisterStudentRepository userRepository;

	public CustomOAuth2UserService(RegisterStudentRepository userRepository) {
		this.userRepository = userRepository;
	}

//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
//
//        // Extract user details
//        Map<String, Object> attributes = oAuth2User.getAttributes();
//        String email = (String) attributes.get("email");
//        String name = (String) attributes.get("name");
//
//        // Check if user already exists, else save
//        RegisterStudent existingUser = userRepository.findByEmail(email);
//        if (existingUser.isEmpty()) {
//        	RegisterStudent newUser = new RegisterStudent();
//            newUser.setEmail(email);
//            newUser.setUserName(name);
//            userRepository.save(newUser);
//        }
//
//        return oAuth2User;
//    }
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

		Map<String, Object> attributes = oAuth2User.getAttributes();
		String email = (String) attributes.get("email");
		String name = (String) attributes.get("name");

		RegisterStudent existingUser = userRepository.findByEmail(email);

		if (existingUser == null) {
			RegisterStudent newUser = new RegisterStudent();
			newUser.setEmail(email);
			newUser.setUserName(name);
			userRepository.save(newUser);
		}

		return oAuth2User;
	}
}