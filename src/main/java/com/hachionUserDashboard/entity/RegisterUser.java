////package com.hachionUserDashboard.entity;
////
////import java.util.Optional;
////
////import jakarta.persistence.Entity;
////import jakarta.persistence.GeneratedValue;
////import jakarta.persistence.GenerationType;
////import jakarta.persistence.Id;
////import jakarta.persistence.Table;
////
////@Entity
////@Table(name = "REGISTER_USER")  // Ensure the table name matches your database
////public class RegisterUser {
////	
////	 @Id
////	    @GeneratedValue(strategy = GenerationType.IDENTITY)
////	    private Long id;
////
////	    private String email;
////	    private String name;
////	    private String password;
////	    private boolean verified;
////	    private String provider;
////	    
////	    // Getters and setters
////	    
////		public Long getId() {
////			return id;
////		}
////		public void setId(Long id) {
////			this.id = id;
////		}
////		public String getEmail() {
////			return email;
////		}
////		public void setEmail(String email) {
////			this.email = email;
////		}
////		public String getName() {
////			return name;
////		}
////		public void setName(String name) {
////			this.name = name;
////		}
////		public String getPassword() {
////			return password;
////		}
////		public void setPassword(String password) {
////			this.password = password;
////		}
////		public boolean isVerified() {
////			return verified;
////		}
////		public void setVerified(boolean verified) {
////			this.verified = verified;
////		}
////		public String getProvider() {
////			return provider;
////		}
////		public void setProvider(String provider) {
////			this.provider = provider;
////		}
////		public void setSocialId(String socialId) {
////			// TODO Auto-generated method stub
////			
////		}
////		
////		public boolean isPresent() {
////			// TODO Auto-generated method stub
////			return false;
////		}
////		
//////		public static RegisterUser findByEmail(String email2) {
//////			// TODO Auto-generated method stub
//////			return null;
//////		}
////		
////		public static Optional<RegisterUser> findByEmail(String email) {
////		    // Logic to find user by email, returning an Optional
////		    return Optional.ofNullable(null/* logic to find the user */);
////		}
////
////		public void orElseGet(Object object) {
////			// TODO Auto-generated method stub
////			
////		}
////		
////
////	}
//
//
////package com.hachionUserDashboard.entity;
////
////import jakarta.persistence.Entity;
////import jakarta.persistence.GeneratedValue;
////import jakarta.persistence.GenerationType;
////import jakarta.persistence.Id;
////import jakarta.persistence.Table;
////
////@Entity
////@Table(name = "REGISTER_USER")
////public class RegisterUser {
////
////    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
////    private Long id;
////
////    private String email;
////    private String name;
////    private String password;
////    private boolean verified;
////    private String provider;
////
////    // Getters and setters
////    
////    public Long getId() {
////        return id;
////    }
////
////    public void setId(Long id) {
////        this.id = id;
////    }
////
////    public String getEmail() {
////        return email;
////    }
////
////    public void setEmail(String email) {
////        this.email = email;
////    }
////
////    public String getName() {
////        return name;
////    }
////
////    public void setName(String name) {
////        this.name = name;
////    }
////
////    public String getPassword() {
////        return password;
////    }
////
////    public void setPassword(String password) {
////        this.password = password;
////    }
////
////    public boolean isVerified() {
////        return verified;
////    }
////
////    public void setVerified(boolean verified) {
////        this.verified = verified;
////    }
////
////    public String getProvider() {
////        return provider;
////    }
////
////    public void setProvider(String provider) {
////        this.provider = provider;
////    }
////
////	public void setSocialId(String socialId) {
////		// TODO Auto-generated method stub
////		
////	}
////
////	public static Object findByEmail(String email2) {
////		// TODO Auto-generated method stub
////		return null;
////	}
////}
//
//
//package com.hachionUserDashboard.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//
//@Entity
//@Table(name = "REGISTER_USER_TBL")
//public class RegisterUser {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private String name;
//    private String email;
//    private boolean isVerified;
//    private String socialId;  // For social logins
//	public Long getId() {
//		return id;
//	}
//	public void setId(Long id) {
//		this.id = id;
//	}
//	public String getName() {
//		return name;
//	}
//	public void setName(String name) {
//		this.name = name;
//	}
//	public String getEmail() {
//		return email;
//	}
//	public void setEmail(String email) {
//		this.email = email;
//	}
//	public boolean isVerified() {
//		return isVerified;
//	}
//	public void setVerified(boolean isVerified) {
//		this.isVerified = isVerified;
//	}
//	public String getSocialId() {
//		return socialId;
//	}
//	public void setSocialId(String socialId) {
//		this.socialId = socialId;
//	}
//	public void setPassword(String encode) {
//		// TODO Auto-generated method stub
//		
//	}
//	public void setProvider(String upperCase) {
//		// TODO Auto-generated method stub
//		
//	}
//}
//
