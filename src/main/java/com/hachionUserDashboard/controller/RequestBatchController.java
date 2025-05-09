package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.RequestBatch;
import com.hachionUserDashboard.repository.RequestBatchRepository;


@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RestController
public class RequestBatchController {

    @Autowired
    private RequestBatchRepository repo;
    @Autowired
	public JavaMailSender javaMailSender;
	

    @GetMapping("/requestbatch/{id}")
    public ResponseEntity<RequestBatch> getRequestBatch(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/requestbatch")
    public List<RequestBatch> getAllRequestBatch() {
        return repo.findAll();
    }

    @PostMapping("/requestbatch/add")
    public ResponseEntity<?> addRequestBatch(@RequestBody RequestBatch requestBatchRequest) {
        // Handle adding the request batch, including userName
        RequestBatch requestBatch = new RequestBatch();
        requestBatch.setSchedule_date(requestBatchRequest.getSchedule_date());
        requestBatch.setTime_zone(requestBatchRequest.getTime_zone());
        requestBatch.setEmail(requestBatchRequest.getEmail());
        requestBatch.setMobile(requestBatchRequest.getMobile());
        requestBatch.setMode(requestBatchRequest.getMode());
        requestBatch.setCountry(requestBatchRequest.getCountry());
        requestBatch.setCourse_name(requestBatchRequest.getCourse_name());
        requestBatch.setUserName(requestBatchRequest.getUserName()); // Save the userName

        // Save requestBatch to the database
        repo.save(requestBatch);
        sendRequestEmail(requestBatch);
        return ResponseEntity.ok("Request batch added successfully");
    }

    public void sendRequestEmail(@RequestBody RequestBatch requestBatchRequest) {
		SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(requestBatchRequest.getEmail());
        simpleMailMessage.setSubject("Hachion Batch Request Confirmation");

        String message = String.format(
        		"Hii," + requestBatchRequest.getUserName() + "\n" +

        		"Welcome to the [Technology] Demo session, We're excited to have you join us." + "\n"+

        		"Demo session details:" +"\n" +
        		 

        		                "Batch Date: " + requestBatchRequest.getSchedule_date() + "\n" +

        		                "Batch Time: " + requestBatchRequest.getTime_zone() + "\n" +

        		                "Meeting Link: [Link to Meeting Platform]"+ "\n\n" +

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
        supportMail.setTo("monikarathore.cs@gmail.com"); // Replace with the actual support email ID
        supportMail.setSubject("New Batch Request Notification");
        supportMail.setText("Dear Support Team,\n\n" +
                "The following user has requested a batch:\n" +
                "Name: " + requestBatchRequest.getUserName() + "\n" +
                "Email: " + requestBatchRequest.getEmail() + "\n" +
                "Mobile: " + requestBatchRequest.getMobile() + "\n" +
                "Batch Date: " + requestBatchRequest.getSchedule_date() + "\n" +
                "Batch Time: " + requestBatchRequest.getTime_zone() + "\n" +
                "Mode: " + requestBatchRequest.getMode() + "\n\n" +
                "Please contact the user to assist them further.\n\n" +
                "Best Regards,\nSystem Notification");

        // Send emails
     
        javaMailSender.send(supportMail);
        javaMailSender.send(simpleMailMessage);
    }
	@DeleteMapping("requestbatch/delete/{id}") public ResponseEntity<?>
    deleteRequestBatch(@PathVariable int id) { RequestBatch requestbatch=
    repo.findById(id).get(); repo.delete(requestbatch); return null;
    
    }
}