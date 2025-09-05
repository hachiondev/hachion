//package com.hachionUserDashboard.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//
//@Entity
//public class Admin {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String username;
//    private String email;
//    private String password;  // Secure the password with encryption
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//
//    public String getEmail() {
//		return email;
//	}
//
//	public void setEmail(String email) {
//		this.email = email;
//	}
//
//	public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}
package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
public class Admin {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(name = "username", nullable = false)
	    private String username;

	    @Column(name = "email", nullable = false, unique = true)
	    private String email;
	    

	    @Column(name = "password", nullable = false)
	    private String password;
	 
	    public Admin() {
	    	
	    }

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		@Override
		public String toString() {
			return "Admin [id=" + id + ", username=" + username + ", email=" + email + ", password=" + password + "]";
		}

		public Admin(Long id, String username, String email, String password) {
			super();
			this.id = id;
			this.username = username;
			this.email = email;
			this.password = password;
		}

		public boolean isEmpty() {
			// TODO Auto-generated method stub
			return false;
		}

		public RegisterStudent orElseThrow(Object object) {
			// TODO Auto-generated method stub
			return null;
		}
}