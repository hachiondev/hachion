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

import com.hachionUserDashboard.entity.Query;
import com.hachionUserDashboard.repository.QueryRepository;


@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RestController
public class QueryController {

    @Autowired
    private QueryRepository repo;
    @Autowired
	public JavaMailSender javaMailSender;
	

    @GetMapping("/haveanyquery/{id}")
    public ResponseEntity<Query> getQuery(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/haveanyquery")
    public List<Query> getAllQuery() {
        return repo.findAll();
    }

    @PostMapping("/haveanyquery/add")
    public ResponseEntity<?> addQuery(@RequestBody Query queryRequest) {
        // Handle adding the request batch, including userName
        Query query = new Query();
        query.setName(queryRequest.getName());
        query.setEmail(queryRequest.getEmail());
        query.setMobile(queryRequest.getMobile());
        query.setComment(queryRequest.getComment());
     

        // Save requestBatch to the database
        repo.save(query);
        sendQueryEmail(query);
        return ResponseEntity.ok("Query Submitted successfully");
    }

    public void sendQueryEmail(@RequestBody Query query) {
		SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(query.getEmail());
        simpleMailMessage.setSubject("Hachion Query Submission");

        String message = String.format(
        		"Hii," + query.getName() + "\n" +

        		"Welcome to the Hachion" + "\n"+

        		"We have received your query" +"\n" +
        		 

        		          "Our Business Team will call you shortly or responded in the details provided by you"+ "\n" +
        		
"If you have any questions, please contact our support team at trainings.hachion@gmail.com or call us at 17324852499. We look forward to seeing you there!"+ "\n" +
        		"Best regards,"+ "\n" +
        		"Hachion Business Team "+ "\n" +
        		"Whatsapp: https://wa.me/17324852499");
              
        

        simpleMailMessage.setText(message);
        SimpleMailMessage supportMail = new SimpleMailMessage();
        supportMail.setTo("trainings@hachion.co"); // Replace with the actual support email ID
        supportMail.setSubject("Have any Query?");
        supportMail.setText("Dear Support Team,\n\n" +
                "The following user has raise a query:\n" +
                "Name: " + query.getName() + "\n" +
                "Email: " + query.getEmail() + "\n" +
                "Mobile: " + query.getMobile() + "\n" +
                "Comment: " + query.getComment() + "\n" +
               
                "Please contact the user to assist them further.\n\n" +
                "Best Regards,\nSystem Notification");

        // Send emails
     
        javaMailSender.send(supportMail);
        javaMailSender.send(simpleMailMessage);
    }

}