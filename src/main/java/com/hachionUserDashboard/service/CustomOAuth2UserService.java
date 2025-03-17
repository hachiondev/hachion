//package com.hachionUserDashboard.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.stereotype.Service;
//
//import com.hachionUserDashboard.entity.RegisterUser;
//import com.hachionUserDashboard.repository.RegisterUserRepository;
//import com.hachionUserDashboard.repository.UserRepository;
//
//
//
//@Service
//public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
//
//    @Autowired
//    private UserRepository userRepository;
//    
//    @Autowired
//    private RegisterUserRepository registerUserRepository;
//
//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);
//
//        String email = oauth2User.getAttribute("email");
//
//        // Save user if not already registered  
//        registerUserRepository.findByEmail(email).orElseGet(() -> {
//            RegisterUser registerUser = new RegisterUser();
//            registerUser.setEmail(email);
//            registerUser.setName(oauth2User.getAttribute("name"));
//            registerUser.setProvider(userRequest.getClientRegistration().getRegistrationId().toUpperCase());
//            registerUser.setVerified(true);
//            return registerUserRepository.save(registerUser);
//        });
//
//
//        return oauth2User;
//    }
//
//	public UserDetails loadUserByUsername(String userName) {
//		
//		return null;
//	}
//}
//
