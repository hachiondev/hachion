package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.CorporateCourse;
import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.entity.RequestBatch;
import com.hachionUserDashboard.repository.CorporateCourseRepository;
import com.hachionUserDashboard.repository.EnrollRepository;

@CrossOrigin
@RestController
public class EnrollController {
	@Autowired
	private EnrollRepository repo;
	 @Autowired
		public JavaMailSender javaMailSender;



	  @GetMapping("/enroll/{id}")
	    public ResponseEntity<Enroll> getEnroll(@PathVariable Integer id) {
	        return repo.findById(id)
	                   .map(ResponseEntity::ok)
	                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	    }

	    @GetMapping("/enroll")
	    public List<Enroll> getAllEnroll() {
	        return repo.findAll();
	    }

	@PostMapping("/enroll/add")
	 public ResponseEntity<?> addEnroll(@RequestBody Enroll requestEnroll) {
        // Handle adding the request batch, including userName
        Enroll enroll = new Enroll();
        enroll.setName(requestEnroll.getName());
        enroll.setEmail(requestEnroll.getEmail());
        enroll.setCourse_name(requestEnroll.getCourse_name());
        enroll.setEnroll_date(requestEnroll.getEnroll_date());
        enroll.setMobile(requestEnroll.getMobile());
        enroll.setMode(requestEnroll.getMode());
        enroll.setTime(requestEnroll.getTime());
        enroll.setAmount(requestEnroll.getAmount());
        enroll.setTrainer(requestEnroll.getTrainer());
        enroll.setMeeting_link(requestEnroll.getMeeting_link());
    

        // Save requestBatch to the database
        repo.save(enroll);
        sendEnrollEmail(enroll);
        return ResponseEntity.ok("Enrollment successfull");
    }

	 public void sendEnrollEmail(@RequestBody Enroll enrollRequest) {
			SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
	        simpleMailMessage.setTo(enrollRequest.getEmail());
	        simpleMailMessage.setSubject("Hachion Enrollment Confirmation");

	        String message = String.format(
	        		"Hii," + enrollRequest.getName() + "\n" +

	        		"Welcome to the Hachion Free Demo session, We're excited to have you join us." + "\n"+

	        		"Demo session details:" +"\n" +
	        		 

	        		                "Batch Date: " + enrollRequest.getEnroll_date() + "\n" +

	        		                "Batch Time: " + enrollRequest.getTime() + "\n" +

	        		                "Meeting Link:"+ enrollRequest.getMeeting_link()+ "\n\n" +
	        		                
"Duration:"+ enrollRequest.getCompletion_date()+ "\n\n" +

	        		                "Joining Instructions:"+ "\n" +
	        		"1. Click the link above 5 minutes before the start time." + "\n" +
	        		"2. You may need to download any necessary software (e.g., Zoom client)."+ "\n" +
	        		"Need Help?" + "\n\n" +
	"If you have any questions, please contact our support team at [Support Email Address] or call us at [Phone Number]. We look forward to seeing you there!"+ "\n" +
	        		"Best regards,"+ "\n" +
	        		"Hachion Support Team "+ "\n" +
	        		"Whatsapp: https://wa.me/17324852499");
	              
	        

	        simpleMailMessage.setText(message);
	        SimpleMailMessage supportMail = new SimpleMailMessage();
	        supportMail.setTo("trainings@hachion.co"); // Replace with the actual support email ID
	        supportMail.setSubject("New Enrollment Notification");
	        supportMail.setText("Dear Support Team,\n\n" +
	                "The following user has requested a batch:\n" +
	                "Name: " + enrollRequest.getName() + "\n" +
	                "Email: " + enrollRequest.getEmail() + "\n" +
	                "Mobile: " + enrollRequest.getMobile() + "\n" +
	                "Batch Date: " + enrollRequest.getEnroll_date() + "\n" +
	                "Batch Time: " + enrollRequest.getTime() + "\n" +
	                "Mode: " + enrollRequest.getMode() + "\n\n" +
	                "Please contact the user to assist them further.\n\n" +
	                "Best Regards,\nSystem Notification");

	        javaMailSender.send(supportMail);
	        javaMailSender.send(simpleMailMessage);
	    }
	 @PostMapping("/enroll/resend-email")
	 public ResponseEntity<?> resendEnrollEmail(@RequestBody Map<String, String> request) {
	     String email = request.get("email");
	     List<Enroll> enrollments = repo.findByEmail(email);

	     if (enrollments.isEmpty()) {
	         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No enrollment found for this email.");
	     }

	     Enroll latest = enrollments.get(enrollments.size() - 1); // assuming latest is last
	     latest.setResendCount(latest.getResendCount() + 1); // Increment the counter

	     repo.save(latest); // Save the updated resend count

	     sendEnrollEmail(latest); // Send the email

	     return ResponseEntity.ok("Email resent successfully. Check your registered email.");
	 }


	@DeleteMapping("enroll/delete/{id}")
	public ResponseEntity<?> deleteEnroll(@PathVariable int id) {
		Enroll enroll = repo.findById(id).get();
		repo.delete(enroll);
		return null;

	}

}
